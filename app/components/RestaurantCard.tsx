import Link from "next/link";
import React from "react";
import { type RestaurantCardType } from "../page";
import PriceComponent from "./PriceComponent";
import StarsComponent from "./StarsComponent";

const RestaurantCard = ({ restaurant }: { restaurant: RestaurantCardType }) => {
  const totalRestaurantRating = restaurant.reviews.reduce((acc, inst) => {
    return acc + inst.rating;
  }, 0);
  const averageRestaurantRating = parseFloat((totalRestaurantRating / restaurant.reviews.length || 0).toFixed(1));

  return (
    <div className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer">
      <Link href={`/restaurant/${restaurant.slug}`}>
        <img src={restaurant.main_image} alt="" className="w-full h-36" />
        <div className="p-1">
          <h3 className="font-bold text-2xl mb-2">{restaurant.name}</h3>
          <div className="flex items-start">
            <StarsComponent stars={averageRestaurantRating} />
            <p className="ml-2">{restaurant.reviews.length} reviews</p>
          </div>
          <div className="flex text-reg font-light capitalize">
            <p className=" mr-3">{restaurant.cuisine.name}</p>
            <PriceComponent price={restaurant.price} />
            <p>{restaurant.location.name}</p>
          </div>
          <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
        </div>
      </Link>
    </div>
  );
};

export default RestaurantCard;
