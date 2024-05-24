import { LoadingOutlined } from "@ant-design/icons";
import React from "react";

const LoadingPage = () => {
  return (
    <div role="status" className="bg-gray-900 h-screen w-full flex justify-center items-center">
      <LoadingOutlined style={{ fontSize: "40px" }} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingPage;
