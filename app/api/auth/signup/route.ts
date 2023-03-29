import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { firstName, lastName, email, password, phone, city } = body;

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
      return NextResponse.json({ errorMessage: check.errorMessage }, { status: 400 });
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
    return NextResponse.json({ errorMessage: "Email already exists, please sign in" }, { status: 400 });
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

  const response = NextResponse.json(
    {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    },
    { status: 200 }
  );

  response.cookies.set("jwt", token, { maxAge: 24 * 60 * 60 * 6 });

  return response;
}
