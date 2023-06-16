import React from "react";
import TaskModal from "./TaskModal";

const TaskCard = () => {
  return (
    <div>
      {/* task cards */}
      <div className="p-4 sm:ml-64 ">
        <div className="p-4  border-gray-800 border-dashed rounded-lg ">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* to do card */}
            <div className=" bg-gray-900 flex-col items-center  h-75 rounded ">
              <div className="m-3">
                <p className="m-2 text-center text-lg mt-1 text-white ">
                  To-do
                </p>
                {/* task modal */}
                <div>
                  <TaskModal />
                </div>
                {/* task modal end */}
              </div>
            </div>
            {/* to do card end */}
          </div>
        </div>
      </div>
      {/* task cards ends here */}
    </div>
  );
};

export default TaskCard;
