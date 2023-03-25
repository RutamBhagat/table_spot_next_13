import { times } from "@/data";
import { type Table } from "@prisma/client";
import { NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export const findAvailableTables = async ({
  res,
  day,
  time,
  restaurant,
}: {
  res: NextApiResponse;
  day: string;
  time: string;
  restaurant: {
    tables: Table[];
    open_time: string;
    close_time: string;
  };
}) => {
  const searchTimes = times.find((inst) => inst.time === time)?.searchTimes;

  if (!searchTimes) {
    res.status(400).json({ errorMessage: "Invalid data provided" });
    return;
  }

  // Get the bookings in the searchTimes range
  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  // Step 1: Create a booking object for each booking with an object of table ids:
  // Create an object to store the tables booked for each booking
  const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

  // Loop through each booking
  for (let inst of bookings) {
    // Create an object for each table booked
    const tableIdObj = inst.tables.reduce((acc, table) => {
      return {
        ...acc,
        [table.table_id]: true,
      };
    }, {});

    // Store the table booked for each booking
    bookingTablesObj[inst.booking_time.toISOString()] = tableIdObj;
  }

  // Step 2: Create a search time object for each search time with an array of tables:
  const searchTimesWithTables = searchTimes.map((inst) => {
    return {
      date: new Date(`${day}T${inst}`),
      time: inst,
      tables: restaurant.tables,
    };
  });

  // Step 3: Filter the tables of each search time object to only include those not booked:
  for (let inst of searchTimesWithTables) {
    inst.tables = inst.tables.filter((table) => {
      if (bookingTablesObj[inst.date.toISOString()]) {
        if (bookingTablesObj[inst.date.toISOString()][table.id]) {
          return false;
        }
      }
      return true;
    });
  }

  for(let inst of searchTimesWithTables) {
    console.log('inst.tables', inst.tables)
  }

  return searchTimesWithTables;
};
