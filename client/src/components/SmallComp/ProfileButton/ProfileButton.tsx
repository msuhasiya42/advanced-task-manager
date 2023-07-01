import React, { useEffect, useState } from "react";
import { getUserData } from "../../../ApiCalls";
import useAuthStore from "../../../Zustand/authStore";

const ProfileButton = () => {
  const [user, setUser] = useState({
    name: "",
  });
  const userId = useAuthStore((state) => state.user.id);
  const getUserName = () => {
    return user.name.split(" ")[0];
  };
  useEffect(() => {
    // getting user data
    getUserData(userId)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error retrieving user data:", error);
      });
  }, [userId]);

  return (
    <div>
      <li>
        <a href="/user-profile">
          <div className="ml-3 mr-2 w-22 mt-1 h-8 items-center justify-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-2 py-1.5 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            <div className="flex items-center space-x-1 ">
              <img
                className="w-5 h-5 rounded-"
                src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Images.png"
                alt="User profile"
              />
              <div className="text-sm">{getUserName()}</div>
            </div>
          </div>
        </a>
      </li>
    </div>
  );
};

export default ProfileButton;
