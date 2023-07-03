import React from "react";
import RestaurantNavbar from "../components/RestaurantNavbar";
import Menu from "../components/Menu";
import ErrorComponent from "../components/ErrorComponent";
import ReservationCard from "../components/ReservationCard";
import getRestaurantMenu from "@/lib/Restaurant/getRestaurantMenu";
import getRestaurantBySlug from "@/lib/Restaurant/getRestaurantBySlug";

type Props = { params: { slug: string } };

export default async function page({ params }: Props) {
  const restaurant = await getRestaurantBySlug(params.slug);

  if (!restaurant) {
    return <ErrorComponent message="Restaurant not found" />;
  }

  const data = await getRestaurantMenu(params.slug);

  if (!data) {
    return <ErrorComponent message={"No items found"} />;
  }

  return (
    <div className="">
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        <div className="bg-white w-[90%] rounded p-3 shadow">
          <RestaurantNavbar slug={params.slug} />
          {/* @ts-ignore  */}
          <Menu items={data.items} />
        </div>
      </div>
      <ReservationCard open_time={restaurant.open_time} close_time={restaurant.close_time} slug={params.slug} />
    </div>
  );
}
