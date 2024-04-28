import React from "react";
import useAuthStore from "../../../Zustand/authStore";
import { User } from "../../Login/types";
const ProfileButton = () => {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    // Handle the case where the user is null
    // Maybe set default values or throw an error, etc.
    alert("User null");
    return; // or handle it accordingly
  }

  const { name, picture }: User = user;
  const getUserName = () => {
    return name.split(" ")[0];
  };

  return (
    <div>
      <a href="/user-profile">
        <div className="ml-3 mr-2 w-22 mt-1 h-8 items-center justify-center text-white bg-gray-900 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-1.5 dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-700 dark:border-gray-700">
          <div className="flex items-center space-x-1 ">
            <img
              className="w-5 h-5 rounded-lg"
              src={
                picture == undefined
                  ? "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Images.png"
                  : picture
              }
              alt="User profile"
            />
            <div className="text-sm">{getUserName()}</div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ProfileButton;
