import React from "react";
import shortid from "shortid";

const Images = ({ images }: { images: string[] }) => {
  return (
    <div>
      <h1 className="font-bold text-3xl mt-10 mb-7 border-b pb-5">
        {images.length === 1 ? <p>{images.length} Photo</p> : <p>{images.length} Photos</p>}
      </h1>
      <div className="flex flex-wrap">
        {images.map((image) => {
          return <img key={shortid.generate()} className="w-56 h-44 mr-1 mb-1" src={image} alt="" />;
        })}
      </div>
    </div>
  );
};

export default Images;
