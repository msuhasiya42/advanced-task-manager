import React from "react";
import { useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-full ">
      <nav className="bg-white shadow-md border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-center sm:justify-between mx-auto p-4">
          <a href="/" className="flex items-center">
            <span className="self-center text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
              Task-Manager
            </span>
          </a>

          <div
            className="hidden w-full md:block md:w-auto"
            id="navbar-dropdown"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="/"
                  className={`block py-2 pl-3 pr-4 rounded transition-all duration-300 md:hover:bg-transparent ${
                    isActive("/")
                      ? "text-white bg-blue-700 hover:bg-blue-600"
                      : "text-gray-900 hover:bg-gray-100 md:text-white dark:hover:bg-gray-700"
                  }`}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className={`block py-2 pl-3 pr-4 rounded transition-all duration-300 md:hover:bg-transparent ${
                    isActive("/login")
                      ? "text-white bg-blue-700 hover:bg-blue-600"
                      : "text-gray-900 hover:bg-gray-100 md:text-white dark:hover:bg-gray-700"
                  }`}
                >
                  Login
                </a>
              </li>
              <li>
                <a
                  href="/signup"
                  className={`block py-2 pl-3 pr-4 rounded transition-all duration-300 md:hover:bg-transparent ${
                    isActive("/signup")
                      ? "text-white bg-blue-700 hover:bg-blue-600"
                      : "text-gray-900 hover:bg-gray-100 md:text-white dark:hover:bg-gray-700"
                  }`}
                >
                  Sign Up
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
