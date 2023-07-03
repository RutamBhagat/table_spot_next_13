import { prisma } from "@/lib/prisma";
import { type Restaurant } from "@prisma/client";

export default async function fetchRestaurants(): Promise<Restaurant[]> {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      main_image: true,
      images: true,
      description: true,
      open_time: true,
      close_time: true,
      slug: true,
      price: true,
      items: true,
      bookings: true,
      tables: true,
      reviews: true,
      location_id: true,
      location: true,
      cuisine_id: true,
      cuisine: true,
      created_at: true,
      updated_at: true,
    },
  });
  return restaurants;
}
