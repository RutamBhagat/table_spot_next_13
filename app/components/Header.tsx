import React from "react";
import SearchBar from "./SearchBar";

const Header = () => {
  return (
    <div className="bg-gradient-to-t from-[#0a081a] to-[#1c1649] p-2 py-20">
      <div className="text-center mt-10">
        <h1 className="text-[#dee3ea] text-5xl font-bold mb-2">Discover the perfect table for any event</h1>
        <SearchBar />
      </div>
    </div>
  );
};

export default Header;
