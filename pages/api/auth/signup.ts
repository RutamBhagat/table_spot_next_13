// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { setCookie } from "cookies-next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { firstName, lastName, email, password, phone, city } = req.body;

    // Data validation
    const validationSchema = [
      {
        valid: validator.isLength(firstName, { min: 1, max: 20 }),
        errorMessage: "First name must be between 1 and 20 characters",
      },
      {
        valid: validator.isLength(lastName, { min: 1, max: 20 }),
        errorMessage: "Last name must be between 1 and 20 characters",
      },
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is not valid",
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: "Weak password",
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: "Phone is not valid",
      },
      {
        valid: validator.isLength(city, { min: 1, max: 20 }),
        errorMessage: "City name must be between 1 and 20 characters",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        res.status(400).json({ errorMessage: check.errorMessage });
        return;
      }
    });

    // Check if user exists
    const userByEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    // Send error if user exists
    if (userByEmail) {
      res.status(400).json({ errorMessage: "Email already exists, please sign in" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //create user in db using prisma client
    //Note try upsert instead of create next time
    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hashedPassword,
        phone: phone,
        city: city,
      },
    });

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
