import React from "react";

const TaskDetails = ({ items }) => {
  return (
    <div>
      <ul>
        {items.map((item, index) => {
          return (
            <button key={index} href="/task-details" className="w-full">
              <li className="mt-2">
                {/* task info card */}
                <div className="w-full bg-white border h-full  border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  {/* <img
                  className="rounded-t-lg h-10 w-full"
                  src="https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?q=10&h=200"
                  alt=""
                /> */}
                  <div className="p-2">
                    <h5 className="mb-2 text-sm text-left font-bold tracking-tight text-gray-900 dark:text-white">
                      {item.title}
                    </h5>

                    <p className="h-full mb-3 text-xs text-left font-normal text-gray-700 dark:text-gray-400">
                      {item.desc}
                    </p>

                    {/* here profile pic of users will come  */}
                    <div className="flex flex-row justify-center">
                      <div className="mt-2 ">
                        {/* due date badge */}
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                          <svg
                            aria-hidden="true"
                            className="w-3 h-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          {item.dueDate}
                        </span>
                      </div>

                      {/* links badge */}
                      <div className="flex flex-row mt-2">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="w-4 h-4 mt-1  ml-3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                          ></path>
                        </svg>
                        <span
                          className=" mr-3 text-left whitespace-nowrap"
                          // sidebar-toggle-item
                        >
                          2
                        </span>
                      </div>

                      {/* members profile icons */}
                      <div className="flex -space-x-4 justify-end mt-1">
                        <img
                          className="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800"
                          src="https://cdn.pixabay.com/photo/2021/02/12/07/03/icon-6007530_640.png"
                          alt=""
                        />
                        <img
                          className="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800"
                          src="https://cdn.icon-icons.com/icons2/2643/PNG/512/female_woman_person_people_avatar_icon_159366.png"
                          alt=""
                        />
                        <img
                          className="w-7 h-7 border-2 border-white rounded-full dark:border-gray-800"
                          src="https://cdn-icons-png.flaticon.com/512/147/147144.png?w=360"
                          alt=""
                        />
                        <a
                          className="flex items-center justify-center w-7 h-7 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                          href="/show-member"
                        >
                          +2
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </button>
          );
        })}
      </ul>
    </div>
  );
};

export default TaskDetails;
