// import TaskModal from "./TaskModal";
import { useEffect } from "react";
import TaskDetails from "./TaskDetails";
import TextAreaModal from "./TextAreaModal";
import { todos, inprogress, completed } from "../../utils/data/static";
// import { fetchTask } from "../../ApiCalls";

const TaskCard = () => {
  const user = localStorage.getItem("userId");
  // const [fetchedTasks, setFetchedTasks] = useState([]);

  // const [todos, setTodos] = useState([]);
  // const [inprogress, setInprogress] = useState([]);
  // const [completed, setCompleted] = useState([]);

  useEffect(() => {
    // fetchTask(user)
    //   .then((response) => {
    //     const fetchedTasks = response.data.tasks;
    //     // Filter tasks into different categories
    //     // @Remember
    //     const todos = fetchedTasks.filter((task) => task.status === "Todo");
    //     const inprogress = fetchedTasks.filter(
    //       (task) => task.status === "In Progress"
    //     );
    //     const completed = fetchedTasks.filter(
    //       (task) => task.status === "Completed"
    //     );
    //     setTodos(todos);
    //     setInprogress(inprogress);
    //     setCompleted(completed);
    //     // setFetchedTasks(data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, [user]);

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
                  {/* <TaskModal /> */}
                  <TextAreaModal status={"Todo"} />
                  <TaskDetails items={todos} />
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
                {/* task modal */}
                <div>
                  <TextAreaModal status={"In Progress"} />
                  <TaskDetails items={inprogress} />
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
                {/* task modal */}
                <div>
                  <TextAreaModal status={"Completed"} />
                  <TaskDetails items={completed} />
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

export default TaskCard;
