import { PRICE, PrismaClient } from "@prisma/client";
import React from "react";
import Images from "./components/Images";
import Rating from "./components/Rating";
import ReservationCard from "./components/ReservationCard";
import RestaurantNavbar from "./components/RestaurantNavbar";
import Reviews from "./components/Reviews";

const prisma = new PrismaClient();

export type RestaurantBySlugType = {
  id: number;
  name: string;
  images: string[];
  description: string;
  slug: string;
};

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
      slug: true
    }
  });
  return restaurant;
};

const ID = async ({ params }: { params: { slug: string } }) => {
  const restaurant = await getRestaurantBySlug(params.slug);

  if (!restaurant) {
    //Note the null error is handled in layout.tsx file,
    //there was some problem with the error boundry now working as expected
    return <></>;
  }

  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow">
        <RestaurantNavbar slug={params.slug} />
        {/* TITLE */}
        <div className="mt-4 border-b pb-6">
          <h1 className="font-bold text-6xl">{restaurant.name}</h1>
        </div>
        {/* TITLE */}
        <Rating />
        {/* DESCRIPTION */}
        <div className="mt-4">
          <p className="text-lg font-light">{restaurant.description}</p>
        </div>
        {/* DESCRIPTION */}
        <Images images={restaurant.images} />
        <Reviews />
      </div>
      <div className="w-[27%] relative text-reg">
        <ReservationCard />
      </div>
    </>
  );
};

export default ID;
