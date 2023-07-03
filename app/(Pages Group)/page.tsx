import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import fetchRestaurants from "@/lib/Restaurant/fetchRestaurants";

export const metadata = {
  title: "Table Spot",
  description: "Find the best restaurants in your area",
};

export default async function Home() {
  const restaurants = await fetchRestaurants();

  return (
    <main>
      <Header />
      <div className="py-3 px-36 pt-10 flex flex-wrap justify-center bg-[#0a081a]">
        {restaurants.map((restaurant) => {
          // @ts-ignore //
          return <RestaurantCard key={restaurant.id} restaurant={restaurant} />;
        })}
      </div>
    </main>
  );
}
