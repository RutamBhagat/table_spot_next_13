import convertToDisplayTime from "@/lib/Restaurant/convertToDisplayTime";
import { format } from "date-fns";
import Link from "next/link";

const Header = ({
  image,
  name,
  date,
  partySize,
  slug,
}: {
  image: string;
  name: string;
  date: string;
  partySize: string;
  slug: string;
}) => {
  const [day, time] = date.split("T");

  return (
    <Link
      href={`/restaurant/${slug}`}
      className="flex w-4/5 mx-auto items-center m-3 bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div className="w-3/5">
        <img className="rounded-l-lg object-cover h-60 w-full" src={image} alt="" />
      </div>
      <div className="flex w-2/5 flex-col justify-between p-4 leading-normal">
        <h3 className="font-bold mb-2">You're almost done!</h3>
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
        <div className="flex mt-3">
          <p className="mr-6">{format(new Date(date), "ccc, LLL d")}</p>
          <p className="mr-6">{convertToDisplayTime(time)}</p>
          <p className="mr-6">{partySize} people</p>
        </div>
      </div>
    </Link>
  );
};

export default Header;
