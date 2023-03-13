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

  const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach((inst) => {
    bookingTablesObj[inst.booking_time.toISOString()] = inst.tables.reduce((acc, table) => {
      return {
        ...acc,
        [table.table_id]: true,
      };
    }, {});
  });

  const tables = restaurant.tables;

  const searchTimesWithTables = searchTimes.map((searchTime) => {
    return {
      date: new Date(`${day}T${searchTime}`),
      time: searchTime,
      tables: tables,
    };
  });

  searchTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      if (bookingTablesObj[t.date.toISOString()]) {
        if (bookingTablesObj[t.date.toISOString()][table.id]) return false;
      }
      return true;
    });
  });

  return searchTimesWithTables;
};
