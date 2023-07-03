import React from "react";
import RestaurantCard from "./components/RestaurantCard";
import SearchSideBar from "./components/SearchSideBar";
import ErrorComponent from "../restaurant/[slug]/components/ErrorComponent";
import { type PRICE } from "@prisma/client";
import shortid from "shortid";
import getCuisines from "@/lib/Search/getCuisines";
import getLocations from "@/lib/Search/getLocations";
import getRestaurantsByCity from "@/lib/Search/getRestaurantsByCity";

export const metadata = {
  title: "Search Restaurants | Table Spot",
  description: "Find the best restaurants in your area",
};

export type searchParamsType = {
  city: string;
  cuisine?: string;
  price?: PRICE;
};

type Props = { searchParams: searchParamsType };

export default async function page({ searchParams }: Props) {
  const restaurants = await getRestaurantsByCity(searchParams);
  const locations = await getLocations();
  const cuisines = await getCuisines();

  return (
    <>
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <div className="w-4/5">
          {!restaurants.length ? (
            <ErrorComponent message={"No restaurants found !!!"} />
          ) : (
            restaurants.map((restaurant) => {
              return <RestaurantCard key={shortid.generate()} restaurant={restaurant} />;
            })
          )}
        </div>
        <div className="w-1/5">
          <SearchSideBar locations={locations} cuisines={cuisines} searchParams={searchParams} />
        </div>
      </div>
    </>
  );
}
