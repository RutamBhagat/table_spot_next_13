import React from "react";
import RestaurantNavbar from "../components/RestaurantNavbar";
import Menu from "../components/Menu";
import { PrismaClient, Review } from "@prisma/client";
import ErrorComponent from "../components/ErrorComponent";
import Header from "../components/Header";
import ReservationCard from "../components/ReservationCard";

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

const getRestaurantMenu = async (slug: string) => {
  const data = await prisma.restaurant.findUnique({
    where: {
      slug: slug,
    },
    select: {
      items: true,
    },
  });
  return data;
};

const page = async ({ params }: { params: { slug: string } }) => {
  const restaurant = await getRestaurantBySlug(params.slug);

  if (!restaurant) {
    return <ErrorComponent message="Restaurant not found" />;
  }

  const data = await getRestaurantMenu(params.slug);

  if (!data) {
    return <ErrorComponent message={"No items found"} />;
  }

  return (
    <div className="pb-20">
      {restaurant && <Header name={params.slug} />}
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        <div className="bg-white w-[90%] rounded p-3 shadow">
          <RestaurantNavbar slug={params.slug} />
          <Menu items={data.items} />
        </div>
      </div>
      <ReservationCard open_time={restaurant.open_time} close_time={restaurant.close_time} slug={params.slug} />
    </div>
  );
};

export default page;
