import { prisma } from "@/lib/prisma";

export default async function fetchNumberOfBookings(id: string): Promise<number> {
  const day = new Date().toISOString().split("T")[0];

  const bookings = await prisma.booking.findMany({
    where: {
      restaurant_id: id,
      booking_time: {
        gte: new Date(`${day}T00:00:00.000Z`),
        lte: new Date(`${day}T23:30:00.000Z`),
      },
    },
  });

  return bookings.length;
}
