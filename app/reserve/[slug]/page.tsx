import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import Form from "./components/Form";
import Header from "./components/Header";

const prisma = new PrismaClient();

const fetchRestaurantsBySlug = async (slug: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      main_image: true,
      name: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return restaurant;
};

const Slug = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    date: string;
    partySize: string;
  };
}) => {
  const restaurant = await fetchRestaurantsBySlug(params.slug);

  return (
    <div className="border-t h-screen">
      <div className="py-9 w-3/5 m-auto">
        <Header image={restaurant.main_image} name={restaurant.name} date={searchParams.date} partySize={searchParams.partySize} />
        <Form slug={params.slug} date={searchParams.date} partySize={searchParams.partySize} />
      </div>
    </div>
  );
};

export default Slug;
