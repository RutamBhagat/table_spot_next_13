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
    // Create an object for each table booked~
    const tableIdObj = inst.tables.reduce((acc, table) => {
      return {
        ...acc,
        [table.table_id]: true,
      };
    }, {});

    // THIS WAS THE ORIGINAL PROBLEM:
    // You were overwriting the tableIdObj for each booking with the latest booking's tableIdObj
    // // Store the table booked for each booking
    // bookingTablesObj[inst.booking_time.toISOString()] = tableIdObj;

    // Store the table booked for each booking properly
    bookingTablesObj[inst.booking_time.toISOString()] = {
      ...(bookingTablesObj[inst.booking_time.toISOString()] || {}),
      ...tableIdObj,
    };
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

  return searchTimesWithTables;
};

`
bookings [{"number_of_people":8,"booking_time":"2023-03-29T10:00:00.000Z","tables":[{"booking_id":49,"table_id":295,"created_at":"2023-03-29T14:23:32.805Z","updated_at":"2023-03-29T14:23:32.805Z"},{"booking_id":49,"table_id":296,"created_at":"2023-03-29T14:23:32.805Z","updated_at":"2023-03-29T14:23:32.805Z"}]},{"number_of_people":2,"booking_time":"2023-03-29T10:00:00.000Z","tables":[{"booking_id":50,"table_id":297,"created_at":"2023-03-29T14:24:45.824Z","updated_at":"2023-03-29T14:24:45.824Z"}]}]
bookingTablesObj { '2023-03-29T10:00:00.000Z': { '297': true } }
`;
