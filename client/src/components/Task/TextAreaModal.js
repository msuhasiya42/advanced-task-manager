import React from "react";
import { useState } from "react";
import { createTask } from "../../ApiCalls";

const TextAreaModal = ({ status }) => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [taskName, setTaskName] = useState("");

  const handleClick = () => {
    setShowTextArea(true);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform any necessary actions with the task name

    createTask(taskName, status)
      .then((response) => {
        // Handle the API response
        console.log(response.data);
      })
      .catch((error) => {
        // Handle errors
        // handling internal server err
        // is remaining : status code : 500
        console.error(error);
      });

    console.log("Task Name:", taskName);
    // Reset the state and hide the text area
    setTaskName("");
    setShowTextArea(false);
  };

  const handleChange = (event) => {
    setTaskName(event.target.value);
  };
  return (
    <div>
      <div>
        <button
          onClick={handleClick}
          //   data-modal-target="task-modal"
          //   data-modal-toggle="task-modal"
          className="mb-3 w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        >
          +
        </button>
      </div>

      {showTextArea && (
        <form onSubmit={handleSubmit}>
          <div className="w-full mb-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            {/* <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600"></div> */}
            <div className="px-4  bg-white rounded-b-lg dark:bg-gray-800">
              <textarea
                onChange={handleChange}
                id="editor"
                rows="3"
                className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write about task..."
                required
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="mb-5 inline-flex items-center px-5 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
};

export default TextAreaModal;
