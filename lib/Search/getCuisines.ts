import { prisma } from "@/lib/prisma";

export default async function getCuisines() {
  const cuisines = await prisma.cuisine.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return cuisines;
}
