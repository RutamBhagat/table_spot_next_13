import { NextRequest, NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

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
      return NextResponse.json({ errorMessage: inst.errorMessage }, { status: 400 });
    }
  });

  // Check if user exists and check user credentials
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return NextResponse.json({ errorMessage: "Invalid email or password" }, { status: 400 });
  }

  const isMatchingPassword = await bcrypt.compare(password, user.password);

  if (!isMatchingPassword) {
    return NextResponse.json({ errorMessage: "Invalid email or password" }, { status: 400 });
  }

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
    {
      status: 200,
    }
  );

  response.cookies.set("jwt", token, { maxAge: 24 * 60 * 60 * 6 });

  return response;
}
