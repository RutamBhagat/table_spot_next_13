import { type PRICE } from "@prisma/client";

const PriceComponent = ({ price }: { price: PRICE }) => {
  return (
    <div className="mr-3 font-medium">
      {price === "CHEAP" ? (
        <p>
          $<span className="text-gray-400">$$</span>
        </p>
      ) : price === "REGULAR" ? (
        <p>
          $$<span className="text-gray-400">$</span>
        </p>
      ) : (
        <p>$$$</p>
      )}
    </div>
  );
};

export default PriceComponent;
