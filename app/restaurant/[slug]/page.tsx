import { type Review } from "@prisma/client";
import React from "react";
import ErrorComponent from "./components/ErrorComponent";
import Header from "./components/Header";
import Images from "./components/Images";
import Rating from "./components/Rating";
import ReservationCard from "./components/ReservationCard";
import RestaurantNavbar from "./components/RestaurantNavbar";
import Reviews from "./components/Reviews";
import { prisma } from "@/lib/prisma";

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
    return <ErrorComponent message="Restaurant not found" />;
  }

  return (
    <div className="pb-20">
      {restaurant && <Header name={params.slug} />}
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        <div className="bg-white w-[90%] rounded p-3 shadow px-5">
          <RestaurantNavbar slug={params.slug} />
          <div className="flex justify-between items-center">
            <h1 className="my-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              {restaurant.name}
            </h1>
            <Rating reviews={restaurant.reviews} />
          </div>
          <p className="mb-6 text-lg text-start font-normal text-gray-500 lg:text-xl dark:text-gray-400">
            {restaurant.description}
          </p>
          <Images images={restaurant.images} />
          <Reviews reviews={restaurant.reviews} />
        </div>
      </div>
      <ReservationCard open_time={restaurant.open_time} close_time={restaurant.close_time} slug={params.slug} />
    </div>
  );
};

export default ID;
