import Head from "next/head";
import React, { useState } from "react";

export const Navbar = ({ onClick }: any) => {
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
    <div className="flex flex-row items-center justify-between mb-20">
      <h1 className="font-bold text-lg bg-gradient-to-r from-black to-slate-700 bg-clip-text text-transparent inline-block mr-4">
        Hashnode Blog
      </h1>
      <div>
        <a
          href="https://github.com/manuarora700/posts-backup"
          target="__blank"
          className="text-gray-600 text-sm mr-8"
        >
          Take me to the{" "}
          <span className="border border-dashed rounded-md text-gray-700 px-1 py-0.5">
            backup
          </span>{" "}
          repo
        </a>
        <input
          type="text"
          className="border border-gray-200 rounded-md text-sm px-2 py-1 mr-2 text-gray-600"
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
    </div>
  );
};
