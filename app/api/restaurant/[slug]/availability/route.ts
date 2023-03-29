import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findAvailableTables } from "@/services/restaurant/findAvailableTables";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(request.url);
  const slug = params.slug;
  const day = searchParams.get("day");
  const time = searchParams.get("time");
  const partySize = searchParams.get("partySize");

  if (!slug || !day || !time || !partySize) {
    return NextResponse.json({ errorMessage: "Missing required parameters" }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    return NextResponse.json({ errorMessage: "Invaild restaurant provided" }, { status: 400 });
  }

  const searchTimesWithTables = await findAvailableTables({ day, time, restaurant });

  if (!searchTimesWithTables) {
    return NextResponse.json({ errorMessage: "Invalid data provided" }, { status: 404 });
  }

  // Map over the searchTimesWithTables array
  // For each instance of the searchTimesWithTables array, return an object
  let availabilities = searchTimesWithTables.map((inst) => {
    // Create a variable and initialize it to the sum of the seats of each table at the instance
    const sumSeats = inst.tables.reduce((acc, table) => {
      return acc + table.seats;
    }, 0);

    // Return an object with two properties: time and available
    // The time property should be set to the time property of the instance
    // The available property should be set to a boolean indicating if the time has enough seats for the party size
    return {
      time: inst.time,
      available: sumSeats >= parseInt(partySize),
    };
  });

  // Filter the availabilities array
  // For each instance of the availabilities array, return a boolean
  // The boolean should be true if the instance's time is after the restaurant's opening time and before the restaurant's closing time
  availabilities = availabilities.filter((inst) => {
    // Create a variable and initialize it to a boolean indicating if the instance's time is after the restaurant's opening time
    const timeIsAfterOpeningHour = new Date(`${day}T${inst.time}`) >= new Date(`${day}T${restaurant.open_time}`);
    // Create a variable and initialize it to a boolean indicating if the instance's time is before the restaurant's closing time
    const timeIsBeforeClosingHour = new Date(`${day}T${inst.time}`) <= new Date(`${day}T${restaurant.close_time}`);

    // Return a boolean indicating if the instance's time is after the restaurant's opening time and before the restaurant's closing time
    return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
  });

  return NextResponse.json(availabilities, { status: 200 });
}
