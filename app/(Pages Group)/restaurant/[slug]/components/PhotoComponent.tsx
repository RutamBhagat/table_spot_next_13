"use client";

import { useState } from "react";

type Props = {
  imageUrl: string;
};

export default function PhotoComponent({ imageUrl }: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const toggleFullscreen = () => setFullscreen(!fullscreen);

  return (
    <>
      <img
        onClick={toggleFullscreen}
        src={imageUrl}
        className={`w-full h-full cursor-pointer object-cover object-center`}
      />
      {fullscreen && (
        <div onClick={toggleFullscreen} className="fixed z-50 inset-0 bg-black bg-opacity-75">
          <div className="w-full h-full flex justify-center items-center cursor-pointer">
            <div className="relative">
              <img
                onClick={(e) => {
                  e.stopPropagation();
                }}
                src={imageUrl}
                className={`relative max-w-[75vw] max-h-[90vh] cursor-default`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
