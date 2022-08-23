import React from "react";
import { Blog } from "./Blog";

export const BlogsLayout = ({ content }: any) => {
  console.log("BLOGS...", content);
  return (
    <div className="grid grid-cols-3 gap-10">
      {content?.blogs?.map((blog: any, idx: number) => (
        <Blog blog={blog} key={idx} />
      ))}
    </div>
  );
};
