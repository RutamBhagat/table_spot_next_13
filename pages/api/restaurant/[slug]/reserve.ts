// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { findAvailableTables } from "@/services/restaurant/findAvailableTables";
import validator from "validator";
import { prisma } from "@/lib/prisma";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { slug, partySize, day, time } = req.query as { slug: string; partySize: string; day: string; time: string };

    const { bookerFirstName, bookerLastName, bookerEmail, bookerPhone, bookerOccasion, bookerRequest } = req.body;
    const validationSchema = [
      {
        valid: validator.isLength(bookerFirstName, { min: 1, max: 20 }),
        errorMessage: "Booker First name must be between 1 and 20 characters",
      },
      {
        valid: validator.isLength(bookerLastName, { min: 1, max: 20 }),
        errorMessage: "Booker Last name must be between 1 and 20 characters",
      },
      {
        valid: validator.isEmail(bookerEmail),
        errorMessage: "Booker Email is not valid",
      },
      {
        valid: validator.isMobilePhone(bookerPhone),
        errorMessage: "Booker Phone is not valid",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        res.status(400).json({ errorMessage: check.errorMessage });
        return;
      }
    });

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
      return res.status(404).json({ errorMessage: "Restaurant not found" });
    }

    if (
      new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
      new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
    ) {
      return res.status(400).json({ errorMessage: "Restaurant is not open at that time" });
    }

    const searchTimesWithTables = await findAvailableTables({ day, time, res, restaurant });

    if (!searchTimesWithTables) {
      return res.status(404).json({ errorMessage: "Invalid data provided" });
    }

    const searchTimeWithTables = searchTimesWithTables.find((t) => {
      return t.date.toISOString() === new Date(`${day}T${time}`).toISOString();
    });

    if (!searchTimeWithTables) {
      return res.status(404).json({ errorMessage: "No availability, cannot book" });
    }

    const tablesCount: {
      2: number[];
      4: number[];
    } = {
      2: [],
      4: [],
    };

    searchTimeWithTables.tables.forEach((table) => {
      if (table.seats === 2) {
        tablesCount[2].push(table.id);
      } else {
        tablesCount[4].push(table.id);
      }
    });

    const tablesToBook: number[] = [];
    let seatsRemaining = parseInt(partySize);

    while (seatsRemaining > 0) {
      if (seatsRemaining > 2) {
        if (tablesCount[4].length) {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining -= 4;
        } else {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining -= 2;
        }
      } else {
        if (tablesCount[2].length) {
          tablesToBook.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining -= 2;
        } else {
          tablesToBook.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining -= 4;
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

    const bookingsOnTablesData = tablesToBook.map((tableId) => {
      return {
        table_id: tableId,
        booking_id: booking.id,
      };
    });

    await prisma.bookingsOnTables.createMany({
      data: bookingsOnTablesData,
    });

    return res.status(200).json(booking);
  } else {
    res.status(400).json({ errorMessage: "Method not allowed" });
  }
}
