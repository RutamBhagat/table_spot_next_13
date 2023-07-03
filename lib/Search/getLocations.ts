import { prisma } from "@/lib/prisma";

export default async function getLocations() {
  const locations = await prisma.location.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return locations;
}
