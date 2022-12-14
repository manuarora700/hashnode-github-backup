import Head from "next/head";
import React from "react";
import { Meta } from "../interfaces";

export const Layout = ({ children, ...customMeta }: Meta) => {
  const meta = {
    title: "Hashnode GitHub Backup Assignment",
    description: "Assignment solution by Manu Arora",
    ...customMeta,
  };
  return (
    <div className="max-w-5xl mx-auto  min-h-screen p-10">
      <Head>
        <title>{meta.title}</title>
        <meta title="description" content={meta.description} />
      </Head>
      {children}
    </div>
  );
};
