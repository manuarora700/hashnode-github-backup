import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BlogsLayout } from "@/components/BlogsLayout";
import { Layout } from "@/components/Layout";
import { ReposModal } from "@/components/ReposModal";
import { Navbar } from "@/components/Navbar";
import { fetchArticles } from "@/requests/index";
import { showError, showSuccess } from "@/util/index";
import { createBackupOnGitHub } from "@/lib/index";
import { Search } from "@/components/Search";

const Home: NextPage = () => {
  // TODO: Bonus: useSWR Maybe?
  const [content, setContent] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchData = async (username: any) => {
    try {
      const res = await fetchArticles(username);

      // TODO: Add the case where the user has no blogs but the account exists - eg: manuarora
      if (!res?.data?.data?.user?.publication) {
        showError("No posts found for the given username");
        setContent([]);
        return;
      }

      let retrievedContent = {
        userPhoto: res?.data?.data?.user?.photo || "",
        blogs: res?.data?.data?.user?.publication?.posts || [],
      };
      setContent(retrievedContent);
      setLoading(false);
      showSuccess("Posts populated!");
    } catch (err: any) {
      console.log("err", err?.message);
      setLoading(false);
    }
  };

  const onClickHandler = (action: any, value: any) => {
    switch (action) {
      case "search-click": {
        // Do something
        fetchData(value);
        break;
      }

      default: {
        console.warn("case not handled!", action, value);
      }
    }
  };

  const createBackup = () => {
    setProcessing(true);
    const markdowns = content?.blogs?.map((el: any) => {
      return {
        _id: el?._id,
        contentMarkdown: el?.contentMarkdown,
        title: el?.title,
      };
    });

    createBackupOnGitHub(markdowns)
      .then((res) => {
        if (!res?.data?.error) {
          showSuccess("Data backed up successfully!");
          setProcessing(false);
        }
      })
      .catch((err) => {
        console.log(err);
        showError("Something went wrong, please try again!");
        setProcessing(false);
      });
  };

  return (
    <>
      <Layout>
        <Navbar />
        <Search onClick={onClickHandler} />
        {content?.blogs?.length > 0 ? (
          <div className="flex flex-row space-x-2 items-center mb-6 ">
            <button
              onClick={createBackup}
              className="border border-slate-500  rounded-md shadow-lg self-end px-4 py-2 text-sm text-gray-700 hover:shadow-xl transition duration-200"
            >
              {!processing ? "Backup on GitHub" : "Processing..."}
            </button>
          </div>
        ) : null}
        <BlogsLayout content={content} />
      </Layout>
    </>
  );
};

export default Home;
