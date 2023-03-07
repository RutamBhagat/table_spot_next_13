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
    <div className="border-b flex pb-5">
      <img src={restaurant.main_image} alt="" className="w-44 rounded" />
      <div className="pl-5">
        <h2 className="text-3xl">{restaurant.name}</h2>
        <div className="flex items-center">
          <StarsComponent stars={averageRestaurantRating} />
          <p className="ml-2 text-sm">
            {averageRestaurantRating >= 4.5 ? "Awesome" : averageRestaurantRating != 0 ? "Good" : "Not Rated"}
          </p>
        </div>
        <div className="mb-9">
          <div className="font-light flex text-reg">
            <PriceComponent price={restaurant.price} />
            <p className="mr-4 capitalize">{restaurant.location.name}</p>
            <p className="mr-4 capitalize">{restaurant.cuisine.name}</p>
          </div>
        </div>
        <div className="text-red-600">
          <Link href={`/restaurant/${restaurant.slug}`}>View more information</Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
