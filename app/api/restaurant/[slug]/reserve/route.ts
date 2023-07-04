import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findAvailableTables } from "@/services/restaurant/findAvailableTables";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const req = await request.json(); // req now is the body
  const { bookerEmail, bookerPhone, bookerName, bookerOccasion, bookerRequest } = req;

  const { searchParams } = new URL(request.url);
  const slug = params.slug;
  const day = searchParams.get("day") as string;
  const time = searchParams.get("time") as string;
  const partySize = searchParams.get("partySize") as string;

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    return NextResponse.json({ errorMessage: "Restaurant not found" }, { status: 400 });
  }

  if (
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
  ) {
    return NextResponse.json({ errorMessage: "Restaurant is not open at that time" }, { status: 400 });
  }

  const searchTimesWithTables = await findAvailableTables({
    day,
    time,
    restaurant,
  });

  if (!searchTimesWithTables) {
    return NextResponse.json({ errorMessage: "Invalid data provided" }, { status: 400 });
  }

  const searchTimeWithTables = searchTimesWithTables.find((inst) => {
    return inst.date.toISOString() === new Date(`${day}T${time}`).toISOString();
  });

  if (!searchTimeWithTables) {
    return NextResponse.json({ errorMessage: "No availablity, cannot book" }, { status: 400 });
  }

  // Create an object with two empty arrays for 2 seat and 4 seat tables
  const tablesCount: {
    2: string[];
    4: string[];
  } = {
    2: [],
    4: [],
  };

  // Iterate over all tables in the searchTimeWithTables object
  for (let inst of searchTimeWithTables.tables) {
    // If the table has 2 seats, add its id to the 2 seat array
    if (inst.seats === 2) {
      tablesCount[2].push(inst.id);
      // If the table has 4 seats, add its id to the 4 seat array
    } else {
      tablesCount[4].push(inst.id);
    }
  }

  // Create an empty array to store the ids of the tables we will book
  const tablesToBooks: string[] = [];
  // Create a variable to store the number of seats remaining to be booked
  let seatsRemaining = parseInt(partySize);

  // Loop until all seats have been booked
  while (seatsRemaining > 0) {
    // If there are more than 2 seats remaining, try and book a 4 seat table
    if (seatsRemaining >= 3) {
      // If there are any 4 seat tables left, book the first one
      if (tablesCount[4].length) {
        tablesToBooks.push(tablesCount[4][0]);
        tablesCount[4].shift();
        seatsRemaining = seatsRemaining - 4;
        // Otherwise, book a 2 seat table
      } else {
        tablesToBooks.push(tablesCount[2][0]);
        tablesCount[2].shift();
        seatsRemaining = seatsRemaining - 2;
      }
      // If there are only 2 seats remaining, try and book a 2 seat table
    } else {
      // If there are any 2 seat tables left, book the first one
      if (tablesCount[2].length) {
        tablesToBooks.push(tablesCount[2][0]);
        tablesCount[2].shift();
        seatsRemaining = seatsRemaining - 2;
        // Otherwise, book a 4 seat table
      } else {
        tablesToBooks.push(tablesCount[4][0]);
        tablesCount[4].shift();
        seatsRemaining = seatsRemaining - 4;
      }
    }
  }

  const booking = await prisma.booking.create({
    data: {
      number_of_people: parseInt(partySize),
      booking_time: new Date(`${day}T${time}`),
      booker_email: bookerEmail,
      booker_phone: bookerPhone,
      booker_name: bookerName,
      booker_occasion: bookerOccasion,
      booker_request: bookerRequest,
      restaurant_id: restaurant.id,
    },
  });

  const bookingsOnTablesData = tablesToBooks.map((table_id) => {
    return {
      table_id,
      booking_id: booking.id,
    };
  });

  await prisma.bookingsOnTables.createMany({
    data: bookingsOnTablesData,
  });

  return NextResponse.json(booking, { status: 200 });
}
