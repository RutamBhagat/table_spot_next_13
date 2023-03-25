import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { findAvailableTables } from "@/services/restaurant/findAvailableTables";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    const { bookerEmail, bookerPhone, bookerFirstName, bookerLastName, bookerOccasion, bookerRequest } = req.body;

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
        id: true,
      },
    });

    if (!restaurant) {
      return res.status(400).json({
        errorMessage: "Restaurant not found",
      });
    }

    if (
      new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
      new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
      return res.status(400).json({
        errorMessage: "Restaurant is not open at that time",
      });
    }

    const searchTimesWithTables = await findAvailableTables({
      day,
      time,
      res,
      restaurant,
    });

    if (!searchTimesWithTables) {
      return res.status(400).json({
        errorMessage: "Invalid data provided",
      });
    }

    const searchTimeWithTables = searchTimesWithTables.find((inst) => {
      return inst.date.toISOString() === new Date(`${day}T${time}`).toISOString();
    });

    if (!searchTimeWithTables) {
      return res.status(400).json({
        errorMessage: "No availablity, cannot book",
      });
    }

    // Create an object with two empty arrays for 2 seat and 4 seat tables
    const tablesCount: {
      2: number[];
      4: number[];
    } = {
      2: [],
      4: [],
    };

    // Iterate over all tables in the searchTimeWithTables object
    for(let inst of searchTimeWithTables.tables){
      // If the table has 2 seats, add its id to the 2 seat array
      if (inst.seats === 2) {
        tablesCount[2].push(inst.id);
      // If the table has 4 seats, add its id to the 4 seat array
      } else {
        tablesCount[4].push(inst.id);
      }
    }

    // Create an empty array to store the ids of the tables we will book
    const tablesToBooks: number[] = [];
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
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
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

    return res.json(booking);
  } else {
    res.status(400).json({ errorMessage: "Method not allowed" });
  }
}
