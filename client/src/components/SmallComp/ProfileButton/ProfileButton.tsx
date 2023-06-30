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
          <div className="w-32 ml-1 mt-1 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
            <div className="flex items-center space-x-2 ">
              <img
                className="w-7 h-7 rounded-full"
                src="https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Images.png"
                alt="User profile"
              />

              <div className="font-medium dark:text-white">
                <div className="text-sm">{getUserName()}</div>
              </div>
            </div>
          </div>
        </a>
      </li>
    </div>
  );
};

export default ProfileButton;
