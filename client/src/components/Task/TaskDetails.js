import React from "react";

const TaskDetails = ({ items }) => {
  return (
    <div>
      <ul>
        {items.map((item, index) => {
          return (
            <li key={index} className="mt-2">
              {/* task info card */}
              <div className="w-full bg-white border h-full  border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                {/* <img
    className="rounded-t-lg h-10 w-full"
    src="https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?q=10&h=200"
    alt=""
  /> */}
                <div className="p-2">
                  <a href="#">
                    <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">
                      {item.title}
                    </h5>
                  </a>
                  <p className="h-full mb-3 text-xs font-normal text-gray-700 dark:text-gray-400">
                    {item.description}
                  </p>

                  {/* here profile pic of users will come  */}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TaskDetails;
