import React, { useEffect, useState } from "react";
import { userAPI } from "../../ApiCalls";
import useAuthStore from "../../Zustand/authStore";
import { Input, InputRef, message } from "antd";
import useTaskStore from "../../Zustand/taskStore";

const AddTags = () => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [tag, setTag] = useState("");
  const tagRef = React.useRef<InputRef>(null);

  // using add task from store
  const userId = useAuthStore((state) => state?.user?.userId);
  const { addTag, checkTagExists, tags } = useTaskStore();

  const handleToggle = () => {
    setShowTextArea((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const inputElement = tagRef.current?.input;
    if (
      inputElement &&
      !inputElement.contains(event.target as Node) &&
      (event.target as HTMLInputElement).type !== "submit"
    ) {
      setShowTextArea(false);
    }
  };

  useEffect(() => {
    if (showTextArea && tagRef.current != null) {
      tagRef.current.focus();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTextArea]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (checkTagExists(tag)) {
      void message.error("Tag already exists.", 2);
    } else {
      try {
        if (tag.trim() === "") {
          void message.error("Empty Tag.", 1.5);
          setShowTextArea(false);
          return;
        }
        const updatedTags = tags.filter((t: string) => t !== tag);
        await userAPI.updateUserTag(userId, updatedTags);
        addTag(tag);
        void message.success("Tag Added.", 1.5);
        setTag("");
        setShowTextArea(false);
      } catch (error) {
        console.error(error);
        void message.error("Tag Not added.");
      }
    }
  };

  return (
    <div className="flex flex-col">
      {showTextArea ? (
        <div>
          <form onSubmit={handleSubmit}>
            <div className="w-48 mb-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              {/* <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600"></div> */}
              <div className="px-4  bg-white rounded-lg dark:bg-gray-800">
                <Input
                  ref={tagRef}
                  onChange={(e) => setTag(e.target.value)}
                  id="tag"
                  type="text"
                  className="block w-full px-2 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="Tag name"
                  required
                />
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
