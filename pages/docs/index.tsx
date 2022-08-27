import type { NextPage } from "next";
import { Layout } from "@/components/Layout";
import { showError, showSuccess } from "@/util/index";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { markdown } from "./markdown";

const Docs: NextPage = () => {
  const tableOfContents = [
    {
      id: "overflow",
      name: "Overview",
    },
    {
      id: "tech-stack",
      name: "Tech Stack",
    },
    {
      id: "fetching-blogs-from-hashnode",
      name: "Fetching Blogs From Hashnode",
    },
    {
      id: "backing-up-data-on-github",
      name: "Backing Up Data On GitHub",
    },
    {
      id: "optimizations-and-considerations",
      name: "Optimizations And Considerations",
    },
    {
      id: "conclusion",
      name: "Conclusion",
    },
  ];
  const handleNavlinkClick = (linkObject: any) => {};
  return (
    <Layout
      title="Documentation"
      description="Documentation of the entire application."
    >
      <Header />
      <div className="grid grid-cols-4 gap-4 w-full">
        <div className="navigation  flex flex-col items-start sticky top-0 max-h-48 py-4">
          {tableOfContents.map((el) => (
            <button
              className="text-sm mb-2 font-semibold hover:text-gray-700 text-left"
              key={el?.id}
              onClick={() => handleNavlinkClick(el)}
            >
              {el?.name}
            </button>
          ))}
        </div>
        <div className="content col-span-3 h-screen prose prose-base max-w-full px-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            children={markdown}
          ></ReactMarkdown>
        </div>
      </div>
    </Layout>
  );
};

export const Header = () => {
  return (
    <div className="flex flex-row justify-between items-center mb-10">
      <h1 className="font-bold">Documentation</h1>
      <Link href="/">
        <a className="text-sm px-4 py-2 rounded-2xl border-2 text-gray-600 hover:shadow-[3px_3px_0px_0px_#cbd5e1] transition duration-200">
          Home
        </a>
      </Link>
    </div>
  );
};

export default Docs;
