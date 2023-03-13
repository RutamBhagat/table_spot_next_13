import React from "react";

const Header = ({ name }: { name: string }) => {
  const createTitle = () => {
    const nameArr = name.split("-");
    nameArr[nameArr.length - 1] = `(${nameArr[nameArr.length - 1]})`;
    return nameArr.join(" ");
  };

  return (
    <div className="bg-gradient-to-t from-[#0a081a] to-[#1c1649] p-2 py-20">
      <div className="text-center my-10">
        <h1 className="text-[#dee3ea] text-5xl font-bold mb-2 capitalize">{createTitle()}</h1>
      </div>
    </div>
  );
};

export default Header;
