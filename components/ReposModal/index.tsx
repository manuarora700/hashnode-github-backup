import React, { useEffect, useRef, useState } from "react";

import SearchSVG from "../../Icons/Search";
import StarSVG from "../../Icons/Star";
import ForkSVG from "../../Icons/Fork";

export const ReposModal = ({ repositories, onClick }: any) => {
  console.log("repos in modal", repositories);
  const inputRef = useRef<any>(null);
  const [input, setInput] = useState("");
  const [filteredRepositories, setFilteredRepositories] =
    useState(repositories);

  const handleNavlinkClick = (e: any, link: any) => {
    e.stopPropagation();
    onClick("repo-click", link);
  };
  const handleBackgroundClick = () => {
    onClick("close-modal");
  };

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    onInputChanged();
  }, [input]);

  const onInputChanged = () => {
    let filtered = repositories?.filter((el: any) =>
      el.full_name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredRepositories(filtered);
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="absolute items-center w-screen h-screen flex justify-center z-10 bg-[#00000070]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[80%] max-w-[500px] bg-[#0f172a] p-10 text-gray-200 h-[80%] overflow-y-auto rounded-xl shadow-xl border border-[#1e293b] flex flex-col gap-4"
      >
        <h1 className="font-bold text-left mb-0">
          Choose a repository to take Backup into.
        </h1>
        <p className="warning text-sm text-red-500">
          Contents of the repo will be overwritten.
        </p>

        <div className="flex items-center gap-2">
          <SearchSVG className="w-6 h-6 text-[#4b5563]" />
          <input
            ref={inputRef}
            className="bg-transparent border-none w-full text-[#fff] focus:outline-none placeholder:text-gray-500"
            placeholder="Search repositories"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <p className="mb-0 text-sm mt-10  text-[#9ca3af]">Repositories</p>
        {filteredRepositories?.map((el: any, idx: any) => (
          <button
            key={`button-${idx}`}
            className="p-4 rounded-md text-left border border-gray-800 bg-transparent cursor-pointer flex flex-col items-start gap-4 hover:bg-[#1f2937]"
            tabIndex={idx}
            onClick={(e) => handleNavlinkClick(e, el?.link)}
          >
            {/* <el.icon className={styles.icon} /> */}
            <p className="text-base font-bold">{el?.full_name}</p>
            <div className="flex flex-row space-x-1 items-center">
              <StarSVG className="h-4 w-4" />{" "}
              <p className="text-xs text-gray-500">{el?.stargazers_count}</p>
              <ForkSVG className="h-4 w-4" />{" "}
              <p className="text-xs text-gray-500">{el?.forks_count}</p>
            </div>
            <p className="text-sm text-gray-400">{el?.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
