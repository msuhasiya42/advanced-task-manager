import React from "react";
import Filter from "../Filter/Filter";
import ProfileButton from "../SmallComp/ProfileButton/ProfileButton";
import Theme from "../SmallComp/Theme/Theme";
import Search from "../SmallComp/Search/Search";
import LogoutButton from "../SmallComp/Logout/LogoutButton";
import Notifications from "../SmallComp/Notifications/Notifications";

const Header = () => {
  return (
    <div>
      <nav className=" bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-screen-2xl flex flex-wrap  justify-between mx-auto">
          <a href="/user-dashboard" className="flex items-center">
            {/* <img
              src="https://w7.pngwing.com/pngs/209/1016/png-transparent-computer-icons-task-id-miscellaneous-computer-logo.png"
              className="h-8  mr-2"
              alt="Flowbite Logo"
            /> */}
            <span className="uppercase ml-3 self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Task Manager
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-dropdown"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-dropdown"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>

          {/* nav bar right side buttons */}

          <div
            className="mt-2 mr-2  w-full md:block md:w-auto"
            id="navbar-dropdown"
          >
            <ul className="flex flex-col  font-medium p-2 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-1 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {/* search button */}
              <Search />

              {/* filter */}
              <Filter />

              {/* user photo with options on it */}
              <ProfileButton />

              {/* theme button */}
              <Theme />

              {/* <!-- Notifications --> */}
              <Notifications />
              {/* logout button */}
              <LogoutButton />
            </ul>
          </div>

          {/* nav bar right side buttons end */}
        </div>
      </nav>
    </div>
  );
};

export default Header;
