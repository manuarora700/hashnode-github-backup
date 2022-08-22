import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BlogsLayout } from "../components/BlogsLayout";
import { Layout } from "../components/Layout";
import { Navbar } from "../components/Navbar";
import { fetchArticles } from "../requests";

export async function getServerSideProps() {
  try {
    const res = await fetchArticles();
    // console.log("res?.data?.data?.user?.publications", res?.data?.data?.user);

    let content = {
      userPhoto: res?.data?.data?.user?.photo || "",
      blogs: res?.data?.data?.user?.publication?.posts || [],
    };

    return { props: { content } };
  } catch (err: any) {
    console.log("err", err?.message);
    return { props: { blogs: [] } };
  }
}

const Home: NextPage = ({ content }: any) => {
  // TODO: Bonus: useSWR Maybe?

  return (
    <Layout>
      <Navbar />
      <BlogsLayout content={content} />
    </Layout>
  );
};

export default Home;
