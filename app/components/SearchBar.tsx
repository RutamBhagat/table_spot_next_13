"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (location.length > 0) {
      router.push(`/search?city=${location.toLowerCase()}`);
    }
    setLocation("")
  };

  return (
    <div className="text-left text-lg py-3 m-auto flex justify-center">
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setLocation(e.target.value);
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        className="rounded  mr-3 p-2 w-[450px]"
        type="text"
        value={location}
        placeholder="State, city or town"
      />
      <button onClick={handleSearch} className="rounded bg-red-600 px-9 py-2 text-white">
        Let's go
      </button>
    </div>
  );
};

export default SearchBar;
