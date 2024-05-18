import { List } from "antd";
import React, { useEffect, useRef } from "react";
import useTaskStore from "../../../Store/taskStore";
import { TaskType } from "../../Task/Types/types";
import { CheckCircleTwoTone, ClockCircleTwoTone } from "@ant-design/icons";
// import TaskEditDataModal from "../../Task/TaskEditDataModal";

const SearchResultTasks = ({
  searchedString,
  setShowResult,
}: {
  searchedString: string;
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // const [showModal, setShowModal] = useState(false);

  const tasks = useTaskStore((state) => state.allTasks);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchedString.toLowerCase())
  );

  const maxLength = 45;

  const renderListItem = (item: TaskType) => (
    <List.Item>
      <List.Item.Meta
        avatar={
          item.done ? (
            <CheckCircleTwoTone className="text-lg mt-2 ml-3" />
          ) : (
            <ClockCircleTwoTone className="text-lg mt-2 ml-3" />
          )
        }
        title={
          <button
            onClick={() => {
              // setShowModal(true);
            }}
          >
            {item.title}
          </button>
        }
        description={
          item.description && item.description !== ""
            ? item.description.length > maxLength
              ? item.description.slice(0, maxLength) + "..."
              : item.description
            : "No Description"
        }
      />
      {/* <TaskEditDataModal
        task={item}
        showModal={showModal}
        setShowModal={setShowModal}
      /> */}
    </List.Item>
  );

  const searchResultRef = useRef<HTMLDivElement>(null); // Ref for the filter card

  useEffect(() => {
    // Function to handle click outside of the filter card
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultRef.current &&
        !searchResultRef.current.contains(event.target as Node)
      ) {
        // Clicked outside of filter card, hide the filter
        setShowResult(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchResultRef]);

  return (
    <div ref={searchResultRef}>
      <List
        style={{
          position: "absolute",
          zIndex: 1,
          minHeight: "100px",
          maxHeight: "400px",
          width: "250px",
          overflow: "scroll",
          marginTop: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
        itemLayout="horizontal"
        dataSource={filteredTasks}
        renderItem={renderListItem}
      />
    </div>
  );
};

export default SearchResultTasks;
