import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import { fetchTask, updateTask, deleteTask } from "../../ApiCalls";
import TaskAreaModal from "./TextAreaModal";
import LoadingPage from "../Loading/LoadingPage";
// import { todos, inprogress, completed } from "../../utils/data/static";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [todos, setTodos] = useState([]);
  const [inprogress, setInprogress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = localStorage.getItem("userId");

  useEffect(() => {
    fetchTaskFun(user);
    setLoading(false);
  }, [user, tasks]);

  // Fetch Task function
  const fetchTaskFun = async (user) => {
    setLoading(true);
    fetchTask(user)
      .then((response) => {
        const fetchedTasks = response.data.tasks;
        setTasks(fetchedTasks);
        // @Remember
        // Filter tasks into different categories
        // necessary because when we add task we need to refresh individual comp not all
        // so add we add task in particular cat. it will refresh only that comp
        setTodos(fetchedTasks.filter((task) => task.status === "Todo"));
        setInprogress(
          fetchedTasks.filter((task) => task.status === "In Progress")
        );
        setCompleted(
          fetchedTasks.filter((task) => task.status === "Completed")
        );

        // @Remember
        // setTasks(fetchedTasks);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addTask = (taskType, newTask) => {
    taskType === "Todo"
      ? setTodos([...todos, newTask])
      : taskType === "In Progress"
      ? setInprogress([...inprogress, newTask])
      : setCompleted([...completed, newTask]);

    console.log(todos);
  };

  // update task function
  const updateTaskFun = (taskId, updatedTask) => {
    updateTask(taskId, updatedTask)
      .then((res) => {
        console.log("Task updated", res);
      })
      .catch((err) => {
        console.log("Error in updating task:", err);
      });
  };

  // delete task
  const handleDelete = (id) => {
    deleteTask(id)
      .then((res) => {
        console.log("Task Deleted:", res);
      })
      .catch((err) => {
        console.log("Error in deletion:", err);
      });
  };

  return (
    <div>
      <div className="p-4  sm:ml-64 ">
        <div className="p-4  border-gray-800 border-dashed rounded-lg ">
          {loading ? (
            <LoadingPage />
          ) : (
            <div className="grid grid-cols-3 gap-12 mb-4">
              {/* to do card */}

              <div className=" bg-gray-900 flex-col items-center  rounded ">
                <div className="m-3">
                  <p className="m-2 text-center text-lg mt-1 text-white ">
                    To-do
                  </p>
                  {/* task modal */}
                  <div>
                    <TaskAreaModal status={"Todo"} addTask={addTask} />
                    <TaskList
                      tasks={todos}
                      status={"Todo"}
                      updateTaskFun={updateTaskFun}
                      handleDelete={handleDelete}
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
                    <TaskAreaModal status={"In Progress"} addTask={addTask} />
                    <TaskList
                      tasks={inprogress}
                      status={"In Progress"}
                      updateTaskFun={updateTaskFun}
                      handleDelete={handleDelete}
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
                    <TaskAreaModal status={"Completed"} addTask={addTask} />

                    <TaskList
                      tasks={completed}
                      status={"Completed"}
                      updateTaskFun={updateTaskFun}
                      handleDelete={handleDelete}
                    />
                  </div>
                  {/* task modal end */}
                </div>
              </div>
              {/* completed card end*/}
            </div>
          )}
        </div>
      </div>

      {/* task cards */}

      {/* task cards ends here */}
    </div>
  );
};

export default TaskManager;
