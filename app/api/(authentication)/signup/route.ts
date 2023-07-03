import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import { isTemporaryEmail } from "temporary-email-validator";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

type RequestBody = {
  name: string;
  city: string;
  phone: string;
  email: string;
  password: string;
};

export async function POST(request: NextRequest) {
  const body: RequestBody = await request.json();

  // Data validation
  const validationSchema = [
    {
      valid: validator.isLength(body.name, { min: 2, max: 30 }),
      errorMessage: "Name must be between 2 and 30 characters",
    },
    {
      valid: validator.isLength(body.city, { min: 2, max: 30 }),
      errorMessage: "City must be between 2 and 30 characters",
    },
    {
      valid: validator.isLength(body.phone, { min: 10, max: 10 }) && validator.isMobilePhone(body.phone),
      errorMessage: "Invalid Phone Number: Phone must be at least 10 digits",
    },
    {
      valid: validator.isEmail(body.email),
      errorMessage: "Email is not valid",
    },
    {
      valid: isTemporaryEmail(body.email) === false,
      errorMessage: "Do not use a temporary email address",
    },
    {
      valid: validator.isStrongPassword(body.password),
      errorMessage: "Weak password",
    },
  ];

  let hasError = false;
  let errorMessage = "";
  for (let check of validationSchema) {
    if (check.valid === false) {
      hasError = true;
      errorMessage = check.errorMessage;
      break;
    }
  }
  if (hasError) {
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  // Send error if user exists and is not OAuth user
  if (user && user.password) {
    return NextResponse.json({ error: "Email already exists, please sign in" }, { status: 500 });
  }
  if (user && !user.password) {
    return NextResponse.json({ error: "Please sign in using your OAuth account" }, { status: 500 });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  //create user in db using prisma client
  //Note try upsert instead of create next time
  const newUser = await prisma.user.create({
    data: {
      name: body.name,
      city: body.city,
      phone: body.phone,
      email: body.email,
      password: hashedPassword,
    },
  });

  const { password, ...userWithoutPassword } = newUser;
  return NextResponse.json(userWithoutPassword, { status: 200 });
}
