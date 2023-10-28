import React, { useState } from "react";
import { updateUserApi } from "../../ApiCalls";
import useAuthStore from "../../Zustand/authStore";
import useTagStore from "../../Zustand/tagStore";
import { Toast } from "../SmallComp/ToastMessage/ToastMessage";

const AddTags = () => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [tag, setTag] = useState("");
  const [notification, setNotification] = useState({ type: "", message: "" });

  // using add task from store
  const userId = useAuthStore((state) => state?.user?.userId);
  const { addTag, checkTagExists } = useTagStore();

  const handleToggle = () => {
    setShowTextArea((prev) => !prev);
  };

  const disAppearToast = () => {
    setNotification({ type: "", message: "" });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (checkTagExists(tag)) {
      setNotification({ type: "error", message: "Tag already exists" });
    } else {
      try {
        await updateUserApi(userId, "add", tag);
        addTag(tag);
        setNotification({ type: "success", message: "Tag Added" });
        setTag("");
        setShowTextArea(false);
      } catch (error) {
        console.error(error);
        setNotification({ type: "error", message: "Tag Not added" });
      } finally {
        setTimeout(disAppearToast, 3000);
      }
    }
  };

  return (
    <div className="flex flex-col">
      {notification.type && <Toast type="success" message="Tag Added" />}

      {showTextArea ? (
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
                onClick={handleToggle}
                className="ml-8 text-gray-900 bg-white border px-5 py-2 border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm  mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <button
            onClick={handleToggle}
            className="px-5 py-1 ml-8  w-32 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
          >
            Add Tag
          </button>
        </div>
      )}
    </div>
  );
};

export default AddTags;
