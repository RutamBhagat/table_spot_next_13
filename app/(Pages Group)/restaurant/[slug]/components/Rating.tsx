import { type Review } from "@prisma/client";
import StarsComponent from "@/app/components/StarsComponent";

type Props = { reviews: Review[] };

export default function Rating({ reviews }: Props) {
  const totalRestaurantRating = reviews.reduce((acc, inst) => {
    return acc + inst.rating;
  }, 0);
  const averageRestaurantRating = parseFloat((totalRestaurantRating / reviews.length || 0).toFixed(1));

  return (
    <div className="flex items-end">
      <div className="ratings mt-2 flex items-center">
        <StarsComponent stars={averageRestaurantRating} />
        <p className="text-reg ml-3">{averageRestaurantRating}</p>
      </div>
      <div>
        <p className="text-reg ml-4">{reviews.length} Reviews</p>
      </div>
    </div>
  );
}
