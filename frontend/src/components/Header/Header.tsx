import React from "react";
import ProfileButton from "../SmallComp/ProfileButton/ProfileButton";
import Theme from "../SmallComp/Theme/Theme";
import LogoutButton from "../SmallComp/Logout/LogoutButton";

const Header = () => {
  return (
    <div className="justify-center w-full border-b-2 py-2 flex flex-wrap sm:justify-between mx-auto dark:bg-gray-900 dark:border-gray-700">
      <a href="/user-dashboard" className="flex items-center">
        <span className="sm:ml-6 self-center text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
          Task Manager
        </span>
      </a>
      <div className="hidden md:flex flex-grow justify-end items-center">
        <ul className="flex space-x-2">
          {/* <Filter /> */}
          {/* <Search /> */}
          <ProfileButton />
          <Theme />
          {/* <Notifications /> */}
          <LogoutButton />
        </ul>
      </div>
    </div>
  );
};

export default Header;
