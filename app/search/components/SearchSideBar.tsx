"use client";
import { PRICE } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SearchSideBar = ({
  locations,
  cuisines,
  searchParams,
}: {
  locations: { id: number; name: string }[];
  cuisines: { id: number; name: string }[];
  searchParams: { city?: string; cuisine?: string; price?: PRICE };
}) => {
  const router = useRouter();
  const [location, setLocation] = useState<string | undefined>(searchParams.city);
  const [cuisine, setCuisine] = useState<string | undefined>(searchParams.cuisine);
  const [price, setPrice] = useState<string | undefined>(searchParams.price);

  useEffect(() => {
    let path = [];
    if (location) {
      path.push(`city=${location?.toLowerCase()}`);
    }
    if (cuisine) {
      path.push(`cuisine=${cuisine?.toLowerCase()}`);
    }
    if (price) {
      path.push(`price=${price?.toUpperCase()}`);
    }
    router.push(`/search?${path.join("&")}`);
  }, [location, cuisine, price]);

  return (
    <div className="w-1/5 p-3">
      <div className="border-b pb-4">
        <h1 className="mb-2">Region</h1>
        {locations.map((inst) => {
          return (
            <div>
              <button
                key={inst.id}
                onClick={() => {
                  location === inst.name ? setLocation(undefined) : setLocation(inst.name);
                }}
                className={`${
                  location === inst.name ? "text-blue-800" : ""
                } font-light text-reg text-start capitalize`}
              >
                {inst.name}
              </button>
            </div>
          );
        })}
      </div>
      <div className="border-b pb-4 mt-3">
        <h1 className="mb-2">Cuisine</h1>
        {cuisines.map((inst) => {
          return (
            <div>
              <button
                key={inst.id}
                onClick={() => {
                  cuisine === inst.name ? setCuisine(undefined) : setCuisine(inst.name);
                }}
                className={`${
                  cuisine === inst.name ? "text-blue-800" : ""
                } font-light text-reg text-start capitalize`}
              >
                {inst.name}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pb-4">
        <h1 className="mb-2">Price</h1>
        <div className="flex">
          <button
            onClick={() => {
              price === "CHEAP" ? setPrice(undefined) : setPrice("CHEAP");
            }}
            className={`${
              price === "CHEAP" ? "text-blue-800" : ""
            } border w-full text-reg font-light rounded-l p-2 hover:text-blue-600`}
          >
            $
          </button>
          <button
            onClick={() => {
              price === "REGULAR" ? setPrice(undefined) : setPrice("REGULAR");
            }}
            className={`${
              price === "REGULAR" ? "text-blue-800" : ""
            } border-r border-t border-b w-full text-reg font-light p-2 hover:text-blue-600`}
          >
            $$
          </button>
          <button
            onClick={() => {
              price === "EXPENSIVE" ? setPrice(undefined) : setPrice("EXPENSIVE");
            }}
            className={`${
              price === "EXPENSIVE" ? "text-blue-800" : ""
            } border-r border-t border-b w-full text-reg font-light p-2 rounded-r hover:text-blue-600`}
          >
            $$$
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSideBar;
