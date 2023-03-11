import { PrismaClient, type Review } from "@prisma/client";
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
  reviews: Review[];
  open_time: string;
  close_time: string;
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
      slug: true,
      reviews: true,
      open_time: true,
      close_time: true,
    },
  });
  return restaurant;
};

const ID = async ({ params }: { params: { slug: string } }) => {
  const restaurant = await getRestaurantBySlug(params.slug);

  if (!restaurant) {
    throw new Error("Restaurant not found");
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
        <Rating reviews={restaurant.reviews} />
        {/* DESCRIPTION */}
        <div className="mt-4">
          <p className="text-lg font-light">{restaurant.description}</p>
        </div>
        {/* DESCRIPTION */}
        <Images images={restaurant.images} />
        <Reviews reviews={restaurant.reviews} />
      </div>
      <div className="w-[27%] relative text-reg">
        <ReservationCard open_time={restaurant.open_time} close_time={restaurant.close_time} slug={params.slug} />
      </div>
    </>
  );
};

export default ID;
