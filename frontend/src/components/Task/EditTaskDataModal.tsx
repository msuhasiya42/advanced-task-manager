import React, { useState } from "react";
import { TaskType } from "./Types/types";
import { Input, Modal, message } from "antd";
import useTagStore from "../../Zustand/tagStore";
import { taskAPI } from "../../ApiCalls";
import useTaskStore from "../../Zustand/taskStore";
import DatePicker from "react-datepicker";
import { taskPriorities } from "./utils";
interface TaskEditDataModalProps {
  task: TaskType;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskEditDataModal = (props: TaskEditDataModalProps) => {
  const { task, setShowModal, showModal } = props;

  const [modalData, setModalData] = useState<TaskType>(task);

  const tags = useTagStore((state) => state.tags);
  const updateTaskOrigStore = useTaskStore(
    (state) => state.updateTaskOrigStore
  );
  const updateTaskCopiedStore = useTaskStore(
    (state) => state.updateTaskCopiedStore
  );

  const handleInputChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setModalData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDate = (date: Date) => {
    setModalData({ ...modalData, dueDate: date.toString() });
  };

  const handleFormSubmit = () => {
    // Trim title and description before updating
    const trimmedTitle = modalData.title?.trim();
    const trimmedDescription = modalData.description?.trim();

    if (trimmedTitle === "") {
      void message.error("Title cannot be empty", 1.5);
      return;
    }

    // Create a new object with trimmed title and description
    const updatedModalData = {
      ...modalData,
      title: trimmedTitle,
      description: trimmedDescription,
    };

    setModalData(updatedModalData);

    taskAPI
      .updateTask(updatedModalData._id, updatedModalData)
      .then(() => {
        void message.success("Task updated successfully", 1.5);
        const { status, _id } = updatedModalData;
        updateTaskOrigStore(status, _id, updatedModalData);
        updateTaskCopiedStore(status, _id, updatedModalData);
        setShowModal(false);
      })
      .catch((err) => void message.error("Error in updating task:", err));
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>{"Edit Task"}</div>}
      centered
      open={showModal}
      onCancel={() => setShowModal(false)}
      onOk={() => {
        handleFormSubmit();
      }}
      okText="Save"
      okButtonProps={{ style: { backgroundColor: "#1890ff", color: "#fff" } }}
    >
      <div className="w-full">
        <Input
          required
          addonBefore="Title"
          name="title"
          defaultValue={modalData.title}
          value={modalData.title}
          onChange={handleInputChange}
        />
      </div>

      <div className="w-full mt-4">
        <label className="block mb-3 font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          className="block w-full h-20 max-h-48 rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none resize-vertical"
          aria-label="Textarea"
          placeholder="Add description about your task"
          value={modalData.description}
          onChange={handleInputChange}
        />
      </div>

      {/* select tag */}
      <div className="w-full mt-4">
        <label className="block mb-3 font-medium text-gray-700">Tag</label>
        <select
          id="tag"
          name="tag"
          className="block w-full xt-select rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
          aria-label="Select"
          value={modalData.tag ?? ""}
          onChange={handleInputChange}
        >
          <option value="" className="bg-red-400">
            -- No tag --
          </option>

          {tags.map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full mt-4">
        <label className="block mb-3 font-medium text-gray-700">Status</label>
        <select
          id="status"
          name="status"
          className="block w-full xt-select rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
          aria-label="Select"
          value={modalData.status}
          onChange={handleInputChange}
        >
          <option value="todo">Todo</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="w-full mt-4">
        <label className="block mb-3 font-medium text-gray-700">Priority</label>
        <select
          id="priority"
          name="priority"
          className="block w-full xt-select rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
          aria-label="Select"
          value={modalData.priority}
          onChange={handleInputChange}
        >
          {taskPriorities.map((priority, index) => (
            <option key={index} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>

      {/* Date picker */}
      <div className="pt-3">
        <label className="block mb-3 font-medium text-gray-700">Due Date</label>
        <DatePicker
          className="block w-full rounded-md py-2.5 px-3.5 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
          selected={
            modalData.dueDate == "" ? new Date() : new Date(modalData.dueDate)
          }
          onChange={handleDate}
        />
      </div>
    </Modal>
  );
};

export default TaskEditDataModal;
