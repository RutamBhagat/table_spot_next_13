// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { slug, partySize, day, time } = req.query as { slug: string; partySize: string; day: string; time: string };

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug: slug,
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



    return res.status(200).json({ slug, partySize, day, time });
  } else {
    res.status(400).json({ errorMessage: "Method not allowed" });
  }
}
