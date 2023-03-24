import { findAvailableTables } from "@/services/restaurant/findAvailableTables";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";


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

    const searchTimesWithTables = await findAvailableTables({ day, time, res, restaurant });

    if (!searchTimesWithTables) {
      return res.status(404).json({ errorMessage: "Invalid data provided" });
    }

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

    return res.status(200).json(availabilities);
  } else {
    res.status(400).json({ errorMessage: "Method not allowed" });
  }
}
