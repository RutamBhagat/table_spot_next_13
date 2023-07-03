import { prisma } from "@/lib/prisma";
import { searchParamsType } from "@/app/(Pages Group)/search/page";
import { type PRICE, type Restaurant } from "@prisma/client";

export default async function getRestaurantsByCity({ city, cuisine, price }: searchParamsType): Promise<Restaurant[]> {
  const select = {
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
  };

  const where: {
    location?: { name: string };
    cuisine?: { name: string };
    price?: PRICE;
  } = {};

  if (city) {
    where.location = { name: city };
  }
  if (cuisine) {
    where.cuisine = { name: cuisine };
  }
  if (price) {
    where.price = price;
  }

  if (!city && !cuisine && !price) {
    const restaurants = await prisma.restaurant.findMany({
      select,
    });
    return restaurants;
  }

  const restaurants = await prisma.restaurant.findMany({
    where,
    select,
  });
  return restaurants;
}
