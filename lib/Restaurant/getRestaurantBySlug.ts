import { prisma } from "./../prisma";
import { Restaurant } from "@prisma/client";

export default async function getRestaurantBySlug(name: string): Promise<Restaurant> {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: name,
    },
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
      location_id: true,
      cuisine_id: true,
      cuisine: true,
      updated_at: true,
    },
  });
  // @ts-ignore
  return restaurant;
}
