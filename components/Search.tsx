import Head from "next/head";
import React, { useState } from "react";

export const Search = ({ onClick }: any) => {
  const [input, setInput] = useState<any>("");

  const handleClick = () => {
    onClick("search-click", input);
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      handleClick();
    }
  };
  return (
    <div className="flex flex-row items-center justify-center mb-20">
      <input
        type="text"
        className="border border-gray-200 rounded-md text-sm px-2 py-1.5 mr-2 text-gray-600"
        placeholder="Search by username"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      <button
        className="text-xs bg-gray-700 text-white focus:outline-none px-2 py-2 rounded-md shadow-xl"
        onClick={handleClick}
      >
        Search Posts
      </button>
    </div>
  );
};
