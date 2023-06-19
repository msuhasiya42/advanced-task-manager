import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import { fetchTask } from "../../ApiCalls";
import { updateTask } from "../../ApiCalls";
// import { todos, inprogress, completed } from "../../utils/data/static";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);

  const user = localStorage.getItem("userId");

  useEffect(() => {
    fetchTaskFun(user);
  }, [user]);

  // Fetch Task function
  const fetchTaskFun = async (user) => {
    fetchTask(user)
      .then((response) => {
        const fetchedTasks = response.data.tasks;
        // Filter tasks into different categories
        // @Remember
        setTasks(fetchedTasks);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // update task function
  const updateTaskFun = async (taskId, updatedTask) => {
    console.log(taskId);
    console.log(updatedTask);
    updateTask(taskId, updatedTask)
      .then((res) => {
        console.log(res);
        console.log("Task updated");
      })
      .catch((err) => {
        console.log("Error in updating task:", err);
      });
  };

  const getTasksByCategory = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div>
      {/* task cards */}
      <div className="p-4  sm:ml-64 ">
        <div className="p-4  border-gray-800 border-dashed rounded-lg ">
          <div className="grid grid-cols-3 gap-12 mb-4">
            {/* to do card */}
            <div className=" bg-gray-900 flex-col items-center  rounded ">
              <div className="m-3">
                <p className="m-2 text-center text-lg mt-1 text-white ">
                  To-do
                </p>
                {/* task modal */}
                <div>
                  <TaskList
                    tasks={getTasksByCategory("Todo")}
                    status={"Todo"}
                    updateTaskFun={updateTaskFun}
                  />
                </div>
                {/* task modal end */}
              </div>
            </div>
            {/* to do card end */}

            {/* in-progress card */}
            <div className=" bg-gray-900 flex-col items-center  rounded ">
              <div className="m-3">
                <p className="m-2 text-center text-lg mt-1 text-white ">
                  In-Progress
                </p>
                <div>
                  <TaskList
                    tasks={getTasksByCategory("In Progress")}
                    status={"In Progress"}
                    updateTaskFun={updateTaskFun}
                  />
                </div>
                {/* task modal end */}
              </div>
            </div>
            {/* in-progress card end*/}

            {/* completed card */}
            <div className=" bg-gray-900 flex-col items-center  rounded ">
              <div className="m-3">
                <p className="m-2 text-center text-lg mt-1 text-white ">
                  Completed
                </p>
                <div>
                  <TaskList
                    tasks={getTasksByCategory("Completed")}
                    status={"Completed"}
                    updateTaskFun={updateTaskFun}
                  />
                </div>
                {/* task modal end */}
              </div>
            </div>
            {/* completed card end*/}
          </div>
        </div>
      </div>
      {/* task cards ends here */}
    </div>
  );
};

export default TaskManager;
