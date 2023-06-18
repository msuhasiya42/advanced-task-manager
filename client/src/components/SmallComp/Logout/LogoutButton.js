import React from "react";
import { logout } from "../../../utils/functions";

const LogoutButton = () => {
  return (
    <div>
      <li>
        <a
          href="/login"
          onClick={logout}
          className=" mt-2 block  text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
        >
          <button
            type="button"
            className="text-white bg-purple-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Logout
          </button>
        </a>
      </li>
    </div>
  );
};

export default LogoutButton;
