import React from "react";
import ProfileButton from "../SmallComp/ProfileButton/ProfileButton";
import Theme from "../SmallComp/Theme/Theme";
import LogoutButton from "../SmallComp/Logout/LogoutButton";
import { useLocation } from "react-router-dom";
import useAuthStore from "../../Store/authStore";

const HeaderPage = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const user = useAuthStore((state) => state.user);

  return (
    <div className="fixed z-50 justify-center w-full border-b-2 py-2 px-2 flex flex-wrap sm:justify-between mx-auto bg-gray-900 border-gray-700">
      <a href="/user-dashboard" className="flex items-center">
        <span className="sm:ml-6 self-center text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
          Task Manager
        </span>
      </a>

      {user ? (
        <div className="hidden md:flex flex-grow justify-end items-center">
          <ul className="flex space-x-4">
            <ProfileButton />
            <Theme />
            <LogoutButton />
          </ul>
        </div>
      ) : (
        <div className="hidden w-full md:block md:w-auto">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent bg-gray-800 md:bg-gray-900 border-gray-700">
            <li>
              <a
                href="/"
                className={`block py-2 px-4 rounded-lg transition-all duration-300 ${isActive("/") ? "text-white bg-blue-700" : "text-gray-400"
                  } hover:bg-blue-500 hover:text-white`}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/login"
                className={`block py-2 px-4 rounded-lg transition-all duration-300 ${isActive("/login")
                  ? "text-white bg-blue-700"
                  : "text-gray-400"
                  } hover:bg-blue-500 hover:text-white`}
              >
                Login
              </a>
            </li>
            <li>
              <a
                href="/signup"
                className={`block py-2 px-4 rounded-lg transition-all duration-300 ${isActive("/signup")
                  ? "text-white bg-blue-700"
                  : "text-gray-400"
                  } hover:bg-blue-500 hover:text-white`}
              >
                Sign Up
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeaderPage;
