import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";

export const Navbar = () => {
  return (
    <div className="flex flex-row items-center justify-between mb-10">
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

        <a
          href="https://github.com/manuarora700/hashnode-github-backup"
          target="__blank"
          className="text-sm px-4 py-2 rounded-2xl border-2 text-gray-600 hover:shadow-[3px_3px_0px_0px_#cbd5e1] transition duration-200"
        >
          Documentation / Source Code
        </a>
      </div>
    </div>
  );
};
