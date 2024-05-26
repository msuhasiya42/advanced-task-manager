import React from "react";
import useAuthStore from "../../../Store/authStore";

const ProfileButton = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    // Handle the case where the user is null
    return null; // or handle it accordingly
  }

  const { name, picture } = user;
  const getUserName = () => {
    return name.split(" ")[0];
  };

  return (
    <div>
      <a href="/user-profile">
        <div className="flex items-center justify-center gap-2 ml-2 mr-2 mt-1 h-10 px-3 py-1.5 bg-gray-800 text-white rounded-lg transition duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <img
            className="w-8 h-8 rounded-full bg-gray-700"
            src={picture ? picture : "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Images.png"}
            alt="User profile"
          />
          <span className="font-medium text-sm">{getUserName()}</span>
        </div>
      </a>
    </div>
  );
};

export default ProfileButton;
