import React from "react";

const Filter = () => {
  const categories = ["Apple", "Samsung", "Lenovo", "Nothing", "OnePlus"];
  const tags = ["work", "personal", "jobhunt", "learning"];
  return (
    <div>
      {/* filter button */}
      <li>
        <div className="flex items-center justify-center p-2">
          <button
            id="dropdownDefault"
            data-dropdown-toggle="dropdown"
            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            type="button"
          >
            Filter
            <svg
              className="w-4 h-4 ml-2"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {/* <!-- Dropdown menu --> */}
          <div
            id="dropdown"
            className="z-10 hidden w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
          >
            <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
              Members
            </h6>
            <ul
              className="space-y-2 text-sm mb-3"
              aria-labelledby="dropdownDefault"
            >
              {categories.map((category, index) => (
                <li key={index} className="flex items-center">
                  <input
                    id="apple"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />

                  <label
                    htmlFor="apple"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {category}
                  </label>
                </li>
              ))}
            </ul>

            {/* filter: by due date */}
            <hr />
            <h6 className="mb-2 mt-1 text-sm font-medium text-gray-900 dark:text-white">
              Due Date
            </h6>
            <ul
              className="space-y-2 text-sm mb-4"
              aria-labelledby="dropdownDefault"
            >
              {categories.map((category, index) => (
                <li key={index} className="flex items-center">
                  <input
                    id="apple"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />

                  <label
                    htmlFor="apple"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {category}
                  </label>
                </li>
              ))}
            </ul>

            {/* filter : tags */}
            <hr />
            <h6 className="mt-1 mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Tags
            </h6>
            <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
              {tags.map((tag, index) => (
                <li key={index} className="flex items-center">
                  <input
                    id="apple"
                    type="checkbox"
                    value=""
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />

                  <label
                    htmlFor="apple"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {tag}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </li>
    </div>
  );
};

export default Filter;
