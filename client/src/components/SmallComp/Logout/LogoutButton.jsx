import React from "react";
import useAuthStore from "../../../Zustand/authStore";
const LogoutButton = () => {
  const { logout } = useAuthStore();
  const logoutUser = () => {
    logout();
  };
  return (
    <>
      <button onClick={logoutUser} className="mt-1 btn btn-primary">
        Logout
      </button>
    </>
  );
};

export default LogoutButton;
