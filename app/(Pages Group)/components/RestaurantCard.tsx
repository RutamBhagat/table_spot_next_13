import Link from "next/link";
import React from "react";
import PriceComponent from "./PriceComponent";
import StarsComponent from "./StarsComponent";
import { type Restaurant } from "@prisma/client";
import fetchNumberOfBookings from "@/lib/Restaurant/fetchNumberOfBookings";

type Props = {
  restaurant: Restaurant;
};

export default async function RestaurantCard({ restaurant }: Props) {
  // @ts-ignore
  const totalRestaurantRating = restaurant.reviews.reduce((acc, inst) => {
    return acc + inst.rating;
  }, 0);

  // @ts-ignore
  const averageRestaurantRating = parseFloat((totalRestaurantRating / restaurant.reviews.length || 0).toFixed(1));

  const numberOfBookings = await fetchNumberOfBookings(restaurant.id);

  return (
    <Link
      href={`/restaurant/${restaurant.slug}`}
      className="max-w-sm bg-[#dee3ea] border m-1 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="">
        <img className="rounded-t-lg object-cover h-96" src={restaurant.main_image} alt="" />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-2xl mb-2">{restaurant.name}</h3>
        <div className="flex justify-between text-reg font-light capitalize mb-2">
          <div>
            {/* @ts-ignore */}
            <p className="text-start">Cuisine {restaurant.cuisine.name}</p>
            {/* @ts-ignore */}
            <p className="text-start">Location {restaurant.location.name}</p>
          </div>
          <div className="flex justify-center items-center">
            <PriceComponent price={restaurant.price} />
          </div>
        </div>
        <div className="flex justify-between items-center py-2">
          <p className="text-sm mt-1 font-bold">Booked {numberOfBookings} times today</p>
          <div className="flex flex-col items-start">
            <StarsComponent stars={averageRestaurantRating} />
            {/* @ts-ignore */}
            <p className="ml-2">{restaurant.reviews.length} reviews</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
