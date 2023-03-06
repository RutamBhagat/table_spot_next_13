import React from "react";
import RestaurantNavbar from "../components/RestaurantNavbar";
import Menu from "../components/Menu";
import { PrismaClient } from "@prisma/client";
import ErrorComponent from "../components/ErrorComponent";


const prisma = new PrismaClient();

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

const page = async({ params }: { params: { slug: string } }) => {
  const data = await getRestaurantMenu(params.slug);

  if (!data) {
    return <ErrorComponent message={"No items found"} />;
  }

  return (
    <div className="bg-white w-[100%] rounded p-3 shadow">
      <RestaurantNavbar slug={params.slug} />
      <Menu items={data.items} />
    </div>
  );
};

export default page;
