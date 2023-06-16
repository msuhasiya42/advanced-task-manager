import React from "react";

const TaskDetails = () => {
  return (
    <div>
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
              Task heading
            </h5>
          </a>
          <p className="h-20 mb-3 text-xs font-normal text-gray-700 dark:text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
            laboriosam sunt odio doloremque animi at unde ad possimus,
            accusantium dolorem molestiae non, facilis cumque rem praesentium
            fuga. Voluptatem, facilis minus!
          </p>

          {/* here profile pic of users will come  */}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
