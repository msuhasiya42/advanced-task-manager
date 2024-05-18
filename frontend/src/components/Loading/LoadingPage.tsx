import { LoadingOutlined } from "@ant-design/icons";
import React from "react";

const LoadingPage = () => {
  return (
    <div role="status">
      <LoadingOutlined />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingPage;
