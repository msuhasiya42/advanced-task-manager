import { LoadingOutlined } from "@ant-design/icons";
import React from "react";

const LoadingPage = () => {
  return (
    <div>
      <div className="flex min-h-screen items-center justify-center w-full h-full  border-gray-200  bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div role="status">
          <LoadingOutlined />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
