// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as jose from "jose";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const bearerToken = req.headers.authorization;
    const token = bearerToken?.split(" ")[1];
    if (!bearerToken || !token) {
      return res.status(401).json({ error: "Please provide authorization token" });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    //Token varification
    try {
      await jose.jwtVerify(token, secret);
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized request" });
    }

    //Token decoding and extracting email from it
    type PayloadType = {
      email: string;
      exp: number;
    };
    const payload = jwt.decode(token) as PayloadType;
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

    return res.status(200).json({ user });
  } else {
    return res.status(405).json({ name: "Method not allowed" });
  }
}
