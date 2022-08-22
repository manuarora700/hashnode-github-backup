import Image from "next/image";
import React from "react";
import moment from "moment";
import Link from "next/link";

export const Blog = ({ blog }: any) => {
  return (
    <div className="rounded-lg shadow-md bg-white overflow-hidden">
      <Link href={blog?.slug}>
        <a>
          <div style={{ position: "relative", height: "200px" }}>
            <Image
              alt="Mountains"
              src={blog?.coverImage}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="content p-4">
            <h1 className="font-bold text-base text-slate-700">
              {blog?.title}
            </h1>
            <h4 className="text-sm text-slate-600 mt-2">{blog?.brief}</h4>
            <p className="text-xs text-gray-500 mt-6">
              {moment(blog?.dateAdded).format("Do MMM YYYY")}
            </p>
          </div>
        </a>
      </Link>
    </div>
  );
};
