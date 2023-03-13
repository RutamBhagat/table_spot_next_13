// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const bearerToken = req.headers.authorization as string;
    const token = bearerToken?.split(" ")[1];

    //Token decoding and extracting email from it
    const payload = jwt.decode(token) as { email: string };
    if (!payload.email) {
      return res.status(401).json({ error: "Unauthorized request" });
    }

    //Getting user from database with email from token
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        city: true,
        email: true,
        phone: true,
        reviews: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    return res.status(200).json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    });
  } else {
    return res.status(405).json({ name: "Method not allowed" });
  }
}
