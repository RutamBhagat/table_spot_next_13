// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { setCookie } from "cookies-next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Data validation
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

    validationSchema.forEach((inst) => {
      if (!inst.valid) {
        return res.status(400).json({ errorMessage: inst.errorMessage });
      }
    });

    // Check if user exists and check user credentials
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({ errorMessage: "Invalid email or password" });
    }

    const isMatchingPassword = await bcrypt.compare(password, user.password);

    if (!isMatchingPassword) {
      return res.status(400).json({ errorMessage: "Invalid email or password" });
    }

    // Token creation using jose library
    const algo = "HS256";
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({ email: email })
      .setProtectedHeader({ alg: algo })
      .setExpirationTime("24h")
      .sign(secret);

    // Set the cookie in the browser, this cookie will expire in 6 days
    setCookie("jwt", token, { req, res, maxAge: 24 * 60 * 60 * 6 });

    return res.status(200).json({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    });
  } else {
    return res.status(405).json({ errorMessage: "Method not allowed" });
  }
}
