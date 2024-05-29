import { LoadingOutlined } from "@ant-design/icons";
import React from "react";

const LoadingPage = ({ message }: { message?: string }) => {
  return (
    <div role="status" className="bg-gray-900 h-full w-full flex justify-center items-center">
      <div style={{ marginRight: "10px" }}>{message}</div>
      <LoadingOutlined style={{ fontSize: "40px" }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
    </div>
  );
};

export default LoadingPage;
