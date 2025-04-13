import React, { useState } from "react";
import { Collaborator, TaskType } from "./Types/types";
import { Input, Modal, Select, SelectProps, message, Tabs, Space } from "antd";
import {
  CalendarOutlined,
  TagsOutlined,
  FieldTimeOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  CommentOutlined,
  EditOutlined,
  CheckSquareOutlined,
  FlagOutlined
} from '@ant-design/icons';
import { taskAPI } from "../../Api";
import DatePicker from "react-datepicker";
import { taskPriorities } from "./utils";
import Editor from "./Editor";
import DOMPurify from "dompurify";
import Comments from "./Comments";
import CollaboratorsSelector from "./CollaboratorsSelector";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { updateTaskInStore } from "../../Store/reducers/taskSlice";


interface EditTaskModalProps {
  task: TaskType;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditTaskModal = (props: EditTaskModalProps) => {
  const { task, setShowModal, showModal } = props;
  const dispatch = useDispatch();

  const sanitizedTask = {
    ...task,
    description: DOMPurify.sanitize(task.description),
  };

  const [taskData, setTaskData] = useState<TaskType>(sanitizedTask);
  const { tags } = useSelector((state: RootState) => state.tasks);
  const { user, allUsers } = useSelector((state: RootState) => state.auth);

  const handleInputChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTagsChange = (selectedTags: string[]) => {
    const newTags = tags.filter((tag) => selectedTags.includes(tag.name));
    setTaskData((prevData) => ({ ...prevData, tags: newTags }));
  };

  const handleDescChange = (value: string) => {
    setTaskData((prevData) => ({
      ...prevData,
      description: value,
    }));
  };

  const handleDate = (date: Date) => {
    setTaskData((prevData) => ({ ...prevData, dueDate: date.toString() }));
  };

  const handleFormSubmit = () => {
    const trimmedTitle = taskData.title?.trim();
    const trimmedDescription = taskData.description?.trim();

    if (trimmedTitle === "") {
      void message.error("Title cannot be empty", 1.5);
      return;
    }

    const updatedTaskData = {
      ...taskData,
      title: trimmedTitle,
      description: trimmedDescription,
      updatedAt: new Date().toString(),
    };

    setTaskData(updatedTaskData);

    taskAPI
      .updateTask(task._id, updatedTaskData)
      .then(() => {
        void message.success("Task updated successfully", 1.5);
        const { status, _id } = updatedTaskData;
        dispatch(updateTaskInStore({ category: status, taskId: _id, updatedTask: updatedTaskData }));
        setShowModal(false);
      })
      .catch((err) => void message.error("Error in updating task:", err));
  };

  const indianTimeOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  // user can edit task 
  // 1. user is owner of task
  // 2. collab user with 'edit' access
  const canEditTask = user?._id === task?.user
    || (task.collaborators && task.collaborators.some(collab => collab.user._id === user?._id && collab.permissionType === "edit"));

  // need to fix this 
  const updatedAt = new Date(task.updatedAt).toLocaleString("en-IN", indianTimeOptions);
  const createdAt = new Date(task.createdAt).toLocaleString("en-IN", indianTimeOptions);
  const createdBy = allUsers?.find((user) => user._id === task.user)?.name || "N/A";
  const updatedBy = allUsers?.find((user) => String(user._id) === String(task.updatedBy))?.name || "N/A";

  const tagOptions: SelectProps["options"] = tags
    ?.map((tag) => ({
      label: (
        <span>
          <span
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              backgroundColor: tag.color,
              marginRight: "8px",
            }}
          />
          {tag.name}
        </span>
      ),
      value: tag.name,
    }))
    .sort((a, b) => a.label.props.children[1].localeCompare(b.label.props.children[1]));

  return (
    <Modal
      centered
      title={<div className="text-xl font-bold text-center mb-4 text-gray-800">Edit Task</div>}
      open={showModal}
      onCancel={() => {
        setShowModal(false);
        setTaskData(task);
      }}
      onOk={handleFormSubmit}
      okText="Save Changes"
      width={800}
      okButtonProps={{
        style: {
          backgroundColor: "#4f46e5",
          color: "#fff",
          borderRadius: "6px",
          fontSize: "14px",
          padding: "6px 16px",
          height: "auto",
          fontWeight: 500,
          boxShadow: "0 2px 5px rgba(79, 70, 229, 0.3)"
        },
        disabled: !canEditTask
      }}
      cancelButtonProps={{
        style: {
          borderRadius: "6px",
          fontSize: "14px",
          padding: "6px 16px",
          height: "auto"
        }
      }}
      style={{ backgroundColor: "white" }}
      bodyStyle={{ padding: "24px", backgroundColor: "white" }}
      className="task-edit-modal"
    >
      <div className="mb-6">
        <div className="w-full">
          <label className="block mb-2 font-bold text-gray-700 flex items-center">
            <span className="mr-2">✏️</span>
            Task Title
          </label>
          <Input
            required
            name="title"
            value={taskData.title}
            onChange={handleInputChange}
            placeholder="Enter title"
            disabled={!canEditTask}
            className="py-2 rounded-md"
            style={{ fontSize: "15px" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 font-bold text-gray-700 flex items-center">
            <span className="mr-2">✅</span>
            Status
          </label>
          <select
            id="status"
            name="status"
            className="block w-full rounded-md py-2.5 px-3.5 text-gray-900 border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
            aria-label="Select"
            value={taskData.status}
            onChange={handleInputChange}
            disabled={!canEditTask}
          >
            <option value="todo">To do</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-bold text-gray-700 flex items-center">
            <span className="mr-2">🚩</span>
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="block w-full rounded-md py-2.5 px-3.5 text-gray-900 border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
            aria-label="Select"
            value={taskData.priority}
            onChange={handleInputChange}
            disabled={!canEditTask}
          >
            {taskPriorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabs
        defaultActiveKey="details"
        items={[
          {
            key: 'details',
            label: (
              <span className="font-medium flex items-center">
                <span className="mr-1">📋</span>
                Details & Description
              </span>
            ),
            children: (
              <div className="mb-6">
                <label className="block mb-3 font-bold text-gray-700 flex items-center">
                  <span className="mr-2">📝</span>
                  Description
                </label>
                <div className="border border-gray-200 rounded-md overflow-hidden bg-white p-1 mb-6">
                  <Editor canEdit={canEditTask} description={taskData.description} handleDescChange={handleDescChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <div className="mb-6">
                      <label className="block mb-2 font-bold text-gray-700 flex items-center">
                        <span className="mr-2">📅</span>
                        Due Date
                      </label>
                      <DatePicker
                        disabled={!canEditTask}
                        selected={new Date(taskData.dueDate)}
                        onChange={(date: Date) => handleDate(date)}
                        className="block w-full rounded-md py-2.5 px-3.5 text-gray-900 border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2 font-bold text-gray-700 flex items-center">
                        <span className="mr-2">🏷️</span>
                        Tags
                      </label>
                      <Select
                        mode="multiple"
                        allowClear
                        placeholder="Select tags"
                        value={taskData.tags.map((tag) => tag.name)}
                        onChange={handleTagsChange}
                        style={{ width: "100%" }}
                        options={tagOptions}
                        disabled={!canEditTask}
                        className="rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="p-4 bg-gray-50 rounded-lg mb-4">
                      <h4 className="font-semibold text-gray-600 mb-2 text-sm uppercase tracking-wide flex items-center">
                        <span className="mr-2">ℹ️</span>
                        Task Information
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-start">
                          <span className="font-medium text-gray-600 min-w-[100px]">Created:</span>
                          <span className="text-gray-600">{createdAt}
                            {createdBy && <span>, by <span className="text-indigo-600 font-medium">{createdBy}</span></span>}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-gray-600 min-w-[100px]">Updated:</span>
                          <span className="text-gray-600">{updatedAt}
                            {updatedBy && <span>, by <span className="text-indigo-600 font-medium">{updatedBy}</span></span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: 'collaborators',
            label: (
              <span className="font-medium flex items-center">
                <span className="mr-1">👥</span>
                Collaborators
              </span>
            ),
            children: (
              <div className="border border-gray-100 rounded-md p-4 bg-white">
                <CollaboratorsSelector
                  collaborators={taskData.collaborators}
                  setCollaborators={(newCollaborators: Collaborator[]) =>
                    setTaskData(prevData => ({ ...prevData, collaborators: newCollaborators }))
                  }
                  canEdit={canEditTask}
                />
              </div>
            ),
          },
          {
            key: 'comments',
            label: (
              <span className="font-medium flex items-center">
                <span className="mr-1">💬</span>
                Comments
              </span>
            ),
            children: (
              <div className="border border-gray-100 rounded-md p-4 bg-white">
                <Comments taskId={task._id} userId={user?._id ?? ""} />
              </div>
            ),
          },
        ]}
        className="mt-2"
      />
    </Modal >
  );
};

export default EditTaskModal;
