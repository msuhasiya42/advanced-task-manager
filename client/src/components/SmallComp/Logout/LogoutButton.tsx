import React from "react";
import useAuthStore from "../../../Zustand/authStore";
const LogoutButton = () => {
  const { logout } = useAuthStore();
  const logoutUser = () => {
    logout();
  };
  return (
    <div className="ml-4">
      <button
        onClick={logoutUser}
        className="uppercase font-bold flex flex-row justify-center items-center m-1 btn-sm w-20 rounded-md btn-primary hover:cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
