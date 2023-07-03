import React, { useId } from "react";

type StarsProps = {
  stars: number;
};

const StarsComponent = ({ stars }: StarsProps) => {
  const starArr = [];
  let totalStars = 5;
  let fillColor = "currentColor";
  while (totalStars !== 0) {
    if (stars <= 0) {
      fillColor = "none";
    }
    starArr.push(
      <svg
        key={useId()}
        fill={fillColor}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-yellow-600"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>
    );
    totalStars--;
    stars--;
  }
  return (
    <div className="flex items-center justify-between">
      <div className="item-center m-1 flex">{starArr}</div>
    </div>
  );
};
export default StarsComponent;