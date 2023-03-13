"use client";
import ErrorComponent from "@/app/restaurant/[slug]/components/ErrorComponent";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Form from "./components/Form";
import Header from "./components/Header";
import { useSearchParams } from "next/navigation";

export default function () {
  const searchParams = useSearchParams();
  const [date, setDate] = useState("");
  const [partySize, setPartySize] = useState("");
  const [slug, setSlug] = useState("");

  const [restaurant, setRestaurant] = useState<{
    id: string;
    main_image: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    setDate(searchParams.get("date") as string);
    setPartySize(searchParams.get("partySize") as string);
    setSlug(searchParams.get("slug") as string);

    const getRestaurant = async () => {
      const response = await axios.post<{
        id: string;
        main_image: string;
        name: string;
      } | null>(`/api/reserve/reserveRestaurant`, {
        slug: searchParams.get("slug"),
      });
      setRestaurant(response.data);
    };

    getRestaurant();
  }, []);

  if (!restaurant) {
    return <ErrorComponent message="Loading your restaurant please wait..." />;
  }

  return (
    <div className="min-h-screen py-10">
      <div className="p-8 py-10 w-3/5 m-auto rounded-lg bg-[#dee3ea]">
        <Header image={restaurant.main_image} name={restaurant.name} date={date} partySize={partySize} />
        <div className="flex justify-center items-center">
          <Form slug={slug} date={date} partySize={partySize} />
        </div>
      </div>
    </div>
  );
}
