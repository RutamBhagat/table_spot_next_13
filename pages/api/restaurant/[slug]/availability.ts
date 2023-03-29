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
        id: true,
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

    console.log('availabilities', availabilities)
    return res.status(200).json(availabilities);
  } else {
    res.status(400).json({ errorMessage: "Method not allowed" });
  }
}
