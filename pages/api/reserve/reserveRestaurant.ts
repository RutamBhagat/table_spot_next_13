// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { slug } = req.body;

    try {
      const restaurant = await prisma.restaurant.findUnique({
        where: {
          slug: slug,
        },
        select: {
          id: true,
          main_image: true,
          name: true,
        },
      });
      return res.status(200).json(restaurant);
    } catch (error) {
      return res.status(400).json({ errorMessage: "Error fetching restaurant" });
    }
  } else {
    return res.status(405).json({ name: "Method not allowed" });
  }
}
