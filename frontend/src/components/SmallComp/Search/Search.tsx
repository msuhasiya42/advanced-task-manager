import React, { useState } from "react";
import SearchResultTasks from "./SearchResultTasks";
import { SearchOutlined } from "@ant-design/icons";
const Search = () => {
  const [showResult, setShowResult] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      <li>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          </span>
          <input
            type="text"
            onChange={(e) => {
              setInputValue(e.target.value);
              if (e.target.value) {
                setShowResult(true);
              } else {
                setShowResult(false);
              }
            }}
            className="w-full py-1.5 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
            placeholder="Search Task"
          />
        </div>
        {showResult && inputValue && (
          <SearchResultTasks
            searchedString={inputValue}
            setShowResult={setShowResult}
          />
        )}
      </li>
    </div>
  );
};

export default Search;
