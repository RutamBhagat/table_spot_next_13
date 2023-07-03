import getRestaurantReviews from "@/lib/Restaurant/getRestaurantReviews";
import ErrorComponent from "./components/ErrorComponent";
import Images from "./components/Images";
import Rating from "./components/Rating";
import ReservationCard from "./components/ReservationCard";
import RestaurantNavbar from "./components/RestaurantNavbar";
import Reviews from "./components/Reviews";
import getRestaurantBySlug from "@/lib/Restaurant/getRestaurantBySlug";
import toTitleCase from "@/lib/Restaurant/toTitleCase";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: toTitleCase(params.slug.split("-").join(" ")),
    description: "Find the best restaurants in your area",
  };
}

const ID = async ({ params }: { params: { slug: string } }) => {
  const restaurant = await getRestaurantBySlug(params.slug as string);
  const reviews = await getRestaurantReviews(restaurant.id);

  if (!restaurant || !reviews) {
    return <ErrorComponent message="Restaurant not found" />;
  }

  return (
    <div className="">
      <div className="flex m-auto w-2/3 justify-between items-start 0 -mt-11">
        <div className="bg-white w-[90%] rounded p-3 shadow px-5">
          <RestaurantNavbar slug={params.slug} />
          <div className="flex justify-between items-center">
            <h1 className="my-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              {restaurant.name}
            </h1>
            <Rating reviews={reviews} />
          </div>
          <p className="mb-6 text-lg text-start font-normal text-gray-500 lg:text-xl dark:text-gray-400">
            {restaurant.description}
          </p>
          <Images images={restaurant.images} />
          <Reviews reviews={reviews} />
        </div>
      </div>
      <ReservationCard open_time={restaurant.open_time} close_time={restaurant.close_time} slug={params.slug} />
    </div>
  );
};

export default ID;
