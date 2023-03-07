import React from "react";
import Header from "./components/Header";
import { PrismaClient } from "@prisma/client";
import { type RestaurantBySlugType } from "./page";
import ErrorComponent from "./components/ErrorComponent";

const prisma = new PrismaClient();

//Duplicate function since I cant seem to export this function
const getRestaurantBySlug = async (name: string): Promise<RestaurantBySlugType | null> => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug: name,
    },
    select: {
      id: true,
      name: true,
      images: true,
      description: true,
      slug: true,
      reviews: true,
    },
  });
  return restaurant;
};

const RestaurantLayout = async ({ children, params }: { children: React.ReactNode; params: { slug: string } }) => {
  const restaurant = await getRestaurantBySlug(params.slug);

  return (
    <>
      {restaurant && <Header name={params.slug} />}
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">{children}</div>
    </>
  );
};

export default RestaurantLayout;
