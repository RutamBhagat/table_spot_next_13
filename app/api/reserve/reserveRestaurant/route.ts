import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const req = await request.json(); // req now is the body
  const { slug } = req;

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

    return NextResponse.json(restaurant, { status: 200 });
  } catch (error) {
    return NextResponse.json({ errorMessage: "Error fetching restaurant" }, { status: 500 });
  }
}
