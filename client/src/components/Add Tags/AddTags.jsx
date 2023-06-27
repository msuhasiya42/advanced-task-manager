import React, { useState } from "react";
import { updateUserApi } from "../../ApiCalls";
import useAuthStore from "../../Zustand/authStore";
import useTagStore from "../../Zustand/tagStore";

const AddTags = () => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [tag, setTag] = useState("");
  const [tagCreated, setTagCreated] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // using add task from store
  const userId = useAuthStore((state) => state.user.id);
  const addTag = useTagStore((state) => state.addTag);
  const checkTagExists = useTagStore((state) => state.checkTagExists);

  const handleClick = () => {
    setShowTextArea(!showTextArea);
    setShowButton(!showButton);
  };

  // toast msg remove
  // @todo
  const disAppearToast = () => {
    setTagCreated(false);
  };

  // handle submit
  const handleSubmit = (event) => {
    if (checkTagExists(tag)) {
      setErrMsg("Tag already exists");
      setErr(true);
    } else {
      setShowButton(true);
      event.preventDefault();

      // update user to add tag api
      const type = "add";
      updateUserApi(userId, type, tag)
        .then((response) => {
          // @Remember
          // add tag in store
          setTagCreated(true);
          addTag(tag);
          console.log(response);
          setTimeout(disAppearToast, 3000);
        })
        .catch((error) => {
          // @Todo
          // Handle errors
          // handling internal server err
          // is remaining : status code : 500
          console.error(error);
          setErrMsg("Tag Not added");
          setErr(true);
          setTimeout(disAppearToast, 3000);
        });

      // Reset the state and hide the text area
      setTag("");
      setShowTextArea(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* toast msgs */}
      {/* task Added msg */}
      {tagCreated && (
        <div className="toast bg-transparent">
          <div className=" bg-transparent">
            <div className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-700">
              <div className="flex items-center justify-center w-12 bg-emerald-500">
                <svg
                  className="w-6 h-6 text-white fill-current"
                  viewBox="0 0 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                </svg>
              </div>

              <div className="px-4 py-2 -mx-3">
                <div className="mx-3">
                  <span className="font-semibold text-emerald-500 dark:text-emerald-400">
                    Tag Added
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-200"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* server issue: task not added */}
      {err && (
        <div className="toast">
          <div className=" ">
            <span>
              <div className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex items-center justify-center w-12 bg-red-500">
                  <svg
                    className="w-6 h-6 text-white fill-current"
                    viewBox="0 0 40 40"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                  </svg>
                </div>

                <div className="px-4 py-2 -mx-3">
                  <div className="mx-3">
                    <span className="font-semibold text-red-500 dark:text-red-400">
                      Error
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-200">
                      {errMsg}
                    </p>
                  </div>
                </div>
              </div>
            </span>
          </div>
        </div>
      )}

      {/* Add tag button with text area  */}
      {showButton && (
        <div>
          <button
            onClick={handleClick}
            className="px-6 py-2 w-full font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
          >
            Add Tag
          </button>
        </div>
      )}
      {showTextArea && (
        <div>
          <form onSubmit={handleSubmit}>
            <div className="w-48 mb-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              {/* <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600"></div> */}
              <div className="px-4  bg-white rounded-lg dark:bg-gray-800">
                <input
                  onChange={(e) => setTag(e.target.value)}
                  id="tag"
                  type="text"
                  className="block w-full px-2 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="Tag name"
                  required
                ></input>
              </div>
            </div>
            <div className="flex flex-row">
              <button
                type="submit"
                onClick={handleSubmit}
                className=" text-gray-900 bg-white border px-5 py-2 border-blue-300 focus:outline-none hover:bg-blue-400 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm  mr-2 mb-2 dark:bg-blue-500 dark:text-white dark:border-blue-600 dark:hover:bg-blue-700 dark:hover:border-blue-600 dark:focus:ring-blue-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={handleClick}
                className="ml-8 text-gray-900 bg-white border px-5 py-2 border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm  mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddTags;
