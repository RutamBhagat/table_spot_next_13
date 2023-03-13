import React from "react";
import shortid from "shortid";

const Images = ({ images }: { images: string[] }) => {
  return (
    <div>
      <h1 className="font-semibold text-3xl mt-10 mb-5 border-b pb-2">
        {images.length === 1 ? <p>{images.length} Photo</p> : <p>{images.length} Photos</p>}
      </h1>
      <div className="flex flex-wrap">
        {images.map((image) => {
          return <img key={shortid.generate()} className="object-cover w-56 h-44 m-2 rounded-md" src={image} alt="" />;
        })}
      </div>
    </div>
  );
};

export default Images;
