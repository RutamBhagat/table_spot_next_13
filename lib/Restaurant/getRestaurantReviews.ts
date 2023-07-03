import { prisma } from "./../prisma";
import { Review } from "@prisma/client";

export default async function getRestaurantReviews(id: string): Promise<Review[]> {
  const review = await prisma.review.findMany({
    where: {
      restaurant_id: id,
    },
    select: {
      id: true,
      name: true,
      text: true,
      rating: true,
      restaurant_id: true,
      restaurant: true,
      user_id: true,
      user: true,
      created_at: true,
      updated_at: true,
    },
  });
  return review;
}
