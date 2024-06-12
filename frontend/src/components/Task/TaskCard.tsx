import React, { useState } from "react";
import { TaskType, TasksProps } from "./Types/types";
import { taskAPI } from "../../Api";
import useTaskStore from "../../Store/taskStore";
import {
  Button,
  Card,
  Dropdown,
  MenuProps,
  Popconfirm,
  Popover,
  Tooltip,
  message,
} from "antd";
import EditTaskModal from "./EditTaskModal";
import {
  AlignLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { convertToIndianTime, getPriorityIcon, taskPriorities } from "./utils";
import { deleteDesc, deleteText } from "../../utils/strings";
import useAuthStore from "../../Store/authStore";

const TaskCard = ({ task, handleDelete }: TasksProps) => {
  const {
    title,
    description,
    attachments,
    status,
    done,
    dueDate,
    priority,
    _id,
    tags,
    // startDate,
    // collaborators,
    // user,
  } = task;

  const [showModal, setShowModal] = useState(false);

  const taskDate = new Date(dueDate);
  const currentDate = new Date();

  const taskDueDay = taskDate.getDay();
  const currentDay = currentDate.getDay();

  const redOrYellow = () => (taskDueDay < currentDay ? "red" : "yellow");
  const dateColor = task.done ? "green" : redOrYellow();
  const classNameDueDate = `text-xs ml-1 w-18 text-black font-medium inline-flex items-center px-2.5 py-0.5 rounded bg-${dateColor}-400 text-white border border-white-600  `;

  const { view, updateTaskDataStore, updateTaskFilteredTasksStore } = useTaskStore();
  const { user } = useAuthStore()

  const toggleTaskDone = () => {
    task.done = !done;
    updateTask(_id, task);
  };

  const handlePriority: MenuProps["onClick"] = (e) => {
    task.priority = e.key;
    taskAPI
      .updateTask(_id, task)
      .then(() => {
        updateTaskDataStore(status, _id, task);
        updateTaskFilteredTasksStore(status, _id, task);
      })
      .catch((err) => {
        void message.error("Err in changing priority: ", err);
      });
  };

  const items: MenuProps["items"] = taskPriorities.map((priority) => ({
    label: priority,
    key: priority,
    icon: getPriorityIcon(priority),
  }));

  const priorityOptions = {
    items,
    onClick: handlePriority,
    selectable: true,
    defaultSelectedKeys: [priority],
  };

  const updateTask = (id: string, updatedTask: TaskType) => {
    taskAPI
      .updateTask(id, updatedTask)
      .then(() => {
        updatedTask.done
          ? void message.success("Task set to done.")
          : void message.warning("Task set to undone.");
        updateTaskDataStore(status, id, updatedTask);
        updateTaskFilteredTasksStore(status, id, updatedTask);
      })
      .catch((err) => {
        console.log("err in updating to done:", err);
      });
  };

  const handleDeleteFun = () => {
    handleDelete(task);
  };

  const indianTime = convertToIndianTime(dueDate);

  const content = (
    <Card onClick={(e) => e.stopPropagation()}>
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className="text-black"
      />
    </Card>
  );

  const editAccessToCurrentUser = task.collaborators?.find(
    (collaborator) => String(collaborator.user?._id) === String(user?._id)
  )?.permissionType === "read" ? false : true;

  return (
    <div>
      <div
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation(), setShowModal(true);
        }}
      >
        <div className="p-1 font-thin w-full mb-2 overflow-hidden rounded-lg shadow-lg bg-gray-800 border hover:border-cyan-400 border-solid border-transparent transition duration-300 ease-in-out ">
          {/* <img
            className="w-full h-48 mt-2"
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=320&q=80"
            alt="NIKE AIR"
          /> */}
          <div className="ml-2">
            <div className="flex justify-between">
              <div className="w-30">
                {view === "cardView" && <div className="mb-3 flex flex-wrap">
                  {tags &&
                    tags?.length !== 0 &&
                    tags?.map((tag) => (
                      <span
                        key={tag.name}
                        className="text-xxs font-thin text-center px-2 py-1 mt-2 mr-1 rounded-xl text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag?.name}
                      </span>
                    ))}
                </div>}
                {/* task title */}
                <h1 className="text-sm font-extralight text-gray-300">
                  {title}
                </h1>
              </div>
              {view === "cardView" && <div onClick={(e) => e.stopPropagation()}>
                <Dropdown menu={priorityOptions} disabled={!editAccessToCurrentUser}>
                  <Button style={{ border: "none" }}>
                    {getPriorityIcon(priority)}
                  </Button>
                </Dropdown>
              </div>}
            </div>

            {view === "cardView" && <div className="mt-1 text-sm text-gray-400">
              {description && description?.replace(/<[^>]*>/g, "") !== "" && (
                <Popover content={content} trigger="hover">
                  <AlignLeftOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </Popover>
              )}
            </div>}
          </div>

          {view === "cardView" && <div className="flex items-center justify-between ml-1 py-2 bg-transparent">
            {/* Due Date */}
            <Tooltip title={!editAccessToCurrentUser ? "Read Only: You don't have access to edit" : ""}>
              <button
                onClick={(e) => {
                  e.stopPropagation(), toggleTaskDone();
                }}
                disabled={!editAccessToCurrentUser}
              >
                <span className={classNameDueDate}>
                  {dateColor === "green" ? (
                    <CheckCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                  ) : (
                    <ClockCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                  )}
                  <p className="ml-1">{indianTime}</p>
                </span>
              </button>
            </Tooltip>

            {/* links badge */}
            <div className="flex flex-row ml-2">
              {attachments?.length > 0 && (
                <>
                  <LinkOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                  <span
                    className=" mr-3 ml-2 text-left whitespace-nowrap"
                  // sidebar-toggle-item
                  >
                    {attachments?.length}
                  </span>
                </>
              )}
            </div>

            <Popconfirm
              placement="bottomLeft"
              title={deleteText}
              description={deleteDesc}
              okText={<span className="bg-blue-500 px-3 rounded-sm ">Yes</span>}
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDeleteFun();
              }}
              onCancel={(e) => {
                e?.stopPropagation();
              }}
              cancelText="No"
            >
              {editAccessToCurrentUser && <DeleteOutlined
                className="mr-4"
                onClick={(e) => e.stopPropagation()} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            </Popconfirm>
          </div>}
        </div>
      </div>
      <EditTaskModal
        task={task}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
};

export default TaskCard;
