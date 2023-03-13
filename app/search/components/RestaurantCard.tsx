import PriceComponent from "@/app/components/PriceComponent";
import StarsComponent from "@/app/components/StarsComponent";
import Link from "next/link";
import React from "react";
import { type SearchRestaurantType } from "../page";

const RestaurantCard = ({ restaurant }: { restaurant: SearchRestaurantType }) => {
  const totalRestaurantRating = restaurant.reviews.reduce((acc, inst) => {
    return acc + inst.rating;
  }, 0);
  const averageRestaurantRating = parseFloat((totalRestaurantRating / restaurant.reviews.length || 0).toFixed(1));

  return (
    <div className="flex w-[95%] items-center m-3 bg-[#dee3ea] border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <div className="w-3/5">
        <img className="rounded-l-lg object-cover h-60 w-full" src={restaurant.main_image} alt="" />
      </div>
      <div className="flex w-2/5 flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{restaurant.name}</h5>
        <div className="flex justify-between text-reg font-light capitalize mb-2">
          <p className="text-center">Cuisine {restaurant.cuisine.name}</p>
          <div className="flex justify-center items-center">
            <PriceComponent price={restaurant.price} />
          </div>
          <p className="text-center">Location {restaurant.location.name}</p>
        </div>
        <div className="flex items-start mb-9">
          <StarsComponent stars={averageRestaurantRating} />
          <p className="ml-2 text-sm">
            {averageRestaurantRating >= 4.5 ? "Awesome" : averageRestaurantRating != 0 ? "Good" : "Not Rated"}
          </p>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${restaurant.slug}`}>View more information</Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
