// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { times } from "@/data";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    if (!slug || !day || !time || !partySize) {
      res.status(400).json({ errorMessage: "Missing required parameters" });
      return;
    }

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

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug: slug,
      },
      select: {
        tables: true,
        open_time: true,
        close_time: true,
      },
    });

    if (!restaurant) {
      return res.status(400).json({
        errorMessage: "Invaild restaurant provided",
      });
    }

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

    const availabilities = searchTimesWithTables
      .map((t) => {
        const sumSeats = t.tables.reduce((acc, table) => {
          return acc + table.seats;
        }, 0);

        return {
          time: t.time,
          available: sumSeats >= parseInt(partySize),
        };
      })
      .filter((inst) => {
        const timeIsAfterOpeningHour = new Date(`${day}T${inst.time}`) >= new Date(`${day}T${restaurant.open_time}`);
        const timeIsBeforeClosingHour = new Date(`${day}T${inst.time}`) <= new Date(`${day}T${restaurant.close_time}`);

        return timeIsAfterOpeningHour && timeIsBeforeClosingHour;
      });

    return res.status(200).json({ availabilities });
  } else {
    res.status(400).json({ errorMessage: "Method not allowed" });
  }
}
