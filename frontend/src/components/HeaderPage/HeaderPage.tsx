import React, { useState, useEffect } from "react";
import ProfileButton from "../SmallComp/ProfileButton/ProfileButton";
import Theme from "../SmallComp/Theme/Theme";
import LogoutButton from "../SmallComp/Logout/LogoutButton";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";

const HeaderPage = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div
      className={`fixed z-50 w-full backdrop-blur-md py-3 px-3 flex flex-wrap sm:justify-between mx-auto transition-all duration-300 border-b ${scrolled
        ? "bg-gray-900/95 shadow-lg shadow-blue-900/20 border-blue-900/30"
        : "bg-gray-900/80 border-gray-700/40"
        }`}
    >
      <a href="/user-dashboard" className="flex items-center group">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 mr-2 shadow-lg shadow-purple-500/20 transform transition-transform group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <span className="sm:ml-1 self-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent whitespace-nowrap group-hover:from-blue-300 group-hover:to-purple-500 transition-all duration-300">
          Task Manager
        </span>
      </a>

      {user ? (
        <div className="hidden md:flex flex-grow justify-end items-center">
          <div className="flex space-x-4 items-center bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-700/30 shadow-md">
            <ProfileButton />
            <Theme />
            <LogoutButton />
          </div>
        </div>
      ) : (
        <div className="hidden w-full md:block md:w-auto">
          <ul className="flex items-center space-x-2 font-medium">
            <li>
              <a
                href="/"
                className={`flex items-center py-2 px-4 rounded-full transition-all duration-300 ${isActive("/")
                  ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-md shadow-blue-600/20 font-medium"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </a>
            </li>
            <li>
              <a
                href="/login"
                className={`flex items-center py-2 px-4 rounded-full transition-all duration-300 ${isActive("/login")
                  ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-md shadow-blue-600/20 font-medium"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </a>
            </li>
            <li>
              <a
                href="/signup"
                className={`flex items-center py-2 px-4 rounded-full transition-all duration-300 ${isActive("/signup")
                  ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-md shadow-blue-600/20 font-medium"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
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
