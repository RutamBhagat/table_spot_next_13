import { PrismaClient, type Review } from "@prisma/client";
import React from "react";
import ErrorComponent from "./components/ErrorComponent";
import Header from "./components/Header";
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
    return <ErrorComponent message="Restaurant not found" />;
  }

  return (
    <div className="">
      {restaurant && <Header name={params.slug} />}
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        <div className="bg-white w-[90%] rounded p-3 shadow">
          <RestaurantNavbar slug={params.slug} />
          <div className="mt-4 border-b pb-6">
            <h1 className="font-bold text-6xl">{restaurant.name}</h1>
          </div>
          <Rating reviews={restaurant.reviews} />
          <div className="mt-4">
            <p className="text-lg font-light">{restaurant.description}</p>
          </div>
          <Images images={restaurant.images} />
          <Reviews reviews={restaurant.reviews} />
        </div>
      </div>
      <ReservationCard open_time={restaurant.open_time} close_time={restaurant.close_time} slug={params.slug} />
    </div>
  );
};

export default ID;
