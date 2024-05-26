import React from "react";
import useAuthStore from "../../../Store/authStore";
import { LogoutOutlined } from "@ant-design/icons";

const LogoutButton = () => {
  const { logout } = useAuthStore();

  const logoutUser = () => {
    logout();
  };

  return (
    <div className="ml-4">
      <button
        onClick={logoutUser}
        className="flex flex-row items-center justify-center px-3 py-2 m-1 text-sm font-medium text-white transition duration-300 bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <LogoutOutlined className="mr-2" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
        <p className="hidden sm:block">Logout</p>
      </button>
    </div>
  );
};

export default LogoutButton;
