import { List } from "antd";
import React from "react";
import useTaskStore from "../../../Zustand/taskStore";
import { TaskType } from "../../Task/Types/types";
import { CheckCircleTwoTone, ClockCircleTwoTone } from "@ant-design/icons";
// import TaskEditDataModal from "../../Task/TaskEditDataModal";

const SearchResultTasks = ({ searchedString }: { searchedString: string }) => {
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

  return (
    <>
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
    </>
  );
};

export default SearchResultTasks;
