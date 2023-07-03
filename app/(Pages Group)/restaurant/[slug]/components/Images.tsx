"use client";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import PhotoComponent from "./PhotoComponent";

const Images = ({ images }: { images: string[] }) => {
  return (
    <div>
      <h1 className="font-semibold text-3xl mt-10 mb-5 border-b pb-2">
        {images.length === 1 ? <p>{images.length} Photo</p> : <p>{images.length} Photos</p>}
      </h1>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 600: 2, 900: 3 }}>
        <Masonry gutter="12px">
          {images?.map((image) => (
            <PhotoComponent imageUrl={image} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default Images;
