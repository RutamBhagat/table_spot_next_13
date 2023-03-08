// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jose from "jose";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    const validationSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is not valid",
      },
      {
        valid: validator.isLength(password, { min: 1 }),
        errorMessage: "Password is invalid",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        res.status(400).json({ error: check.errorMessage });
        return;
      }
    });

    const userByEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!userByEmail) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const isMatchingPassword = await bcrypt.compare(password, userByEmail.password);

    if (!isMatchingPassword) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const algo = "HS256";
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({ email: email })
      .setProtectedHeader({ alg: algo })
      .setExpirationTime("24h")
      .sign(secret);

    return res.status(200).json({ token });
  } else {
    return res.status(405).json({ name: "Method not allowed" });
  }
}
