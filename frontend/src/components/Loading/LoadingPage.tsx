import { LoadingOutlined } from "@ant-design/icons";
import React from "react";

const LoadingPage = () => {
  return (
    <div role="status" className="bg-gray-900 h-full w-full flex justify-center items-center">
      <LoadingOutlined style={{ fontSize: "40px" }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
    </div>
  );
};

export default LoadingPage;
