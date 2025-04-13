import React, { useState, useEffect } from "react";
import { TaskType, TasksProps } from "./Types/types";
import { taskAPI } from "../../Api";
import {
  Avatar,
  Badge,
  Button,
  Calendar,
  Card,
  DatePicker,
  Dropdown,
  MenuProps,
  Popconfirm,
  Popover,
  Space,
  Tag,
  Tooltip,
  message,
} from "antd";
import EditTaskModal from "./EditTaskModal";
import {
  AlignLeftOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { convertToIndianTime, getPriorityIcon, taskPriorities } from "./utils";
import { deleteDesc, deleteText } from "../../utils/strings";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { updateTaskInStore } from "../../Store/reducers/taskSlice";
import { motion } from "framer-motion";
import dayjs from "dayjs";

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
  const [isHovered, setIsHovered] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);

  const taskDate = new Date(dueDate);
  const currentDate = new Date();

  const taskDueDay = taskDate.getDay();
  const currentDay = currentDate.getDay();
  const isPastDue = taskDate < currentDate && !done;

  // Calculate if the due date is today
  const isToday =
    taskDate.getDate() === currentDate.getDate() &&
    taskDate.getMonth() === currentDate.getMonth() &&
    taskDate.getFullYear() === currentDate.getFullYear();

  // Function to get the appropriate color for date badge
  const getDateColor = () => {
    if (done) return "success";
    if (isPastDue) return "error";
    if (isToday) return "warning";
    return "processing";
  };

  const { view } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch();

  /**
   * IMPORTANT NOTE ON STATE MANAGEMENT:
   * 
   * We're using an "optimistic update" pattern for all task modifications:
   * 1. First update the Redux store immediately for a responsive UI
   * 2. Then make the API call to persist changes
   * 3. If API call succeeds, update the local task object for future operations
   * 4. If API call fails, revert the Redux store to the original state
   * 
   * This approach gives users immediate feedback while ensuring data consistency.
   * Even if the API call fails, the database might still have been updated,
   * which will be reflected on the next page refresh.
   */

  // Toggle task completion status
  const toggleTaskDone = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const newDoneState = !done;
    const originalDoneState = task.done;

    // Create a copy of the task with the updated status
    const updatedTask = { ...task, done: newDoneState };

    // Update UI immediately (optimistic update)
    dispatch(updateTaskInStore({ category: status, taskId: _id, updatedTask: { ...updatedTask } }));

    taskAPI
      .updateTask(_id, updatedTask)
      .then(() => {
        // Update the local task object
        task.done = newDoneState;
        void message.success(newDoneState ? "Task marked as done" : "Task marked as incomplete");
      })
      .catch((err) => {
        console.error("Error updating task status:", err);

        // Revert the UI state
        dispatch(updateTaskInStore({
          category: status,
          taskId: _id,
          updatedTask: { ...task, done: originalDoneState }
        }));

        void message.error("Failed to update task status on server, but will try again");
      });
  };

  // Handle priority change from dropdown
  const handlePriority: MenuProps["onClick"] = (e) => {
    // Stop propagation to prevent opening the edit modal
    e.domEvent.stopPropagation();

    // Close the dropdown first for better UX
    setPriorityDropdownOpen(false);

    const newPriority = e.key as string;

    // Don't update if it's the same priority
    if (newPriority === priority) {
      return;
    }

    // Update the UI optimistically first
    const originalPriority = task.priority;
    const updatedTask = { ...task, priority: newPriority };

    // Update state in UI immediately (optimistic update)
    dispatch(updateTaskInStore({ category: status, taskId: _id, updatedTask: { ...updatedTask } }));

    // Show loading message
    const hideLoading = message.loading(`Setting priority to ${newPriority}...`, 0);

    taskAPI
      .updateTask(_id, updatedTask)
      .then(() => {
        // Clear loading message
        hideLoading();

        // Update the local task object (for future operations)
        task.priority = newPriority;
        void message.success(`Priority set to ${newPriority}`);
      })
      .catch((err) => {
        // Clear loading message
        hideLoading();

        console.error("Error updating priority:", err);

        // Revert the UI state on error
        dispatch(updateTaskInStore({
          category: status,
          taskId: _id,
          updatedTask: { ...task, priority: originalPriority }
        }));

        void message.error("Failed to update priority on server, but will try again");

        // Even though API call failed, the database might have been updated
        // The next refresh will show the correct state
      });
  };

  const items: MenuProps["items"] = taskPriorities.map((priorityItem) => ({
    label: priorityItem,
    key: priorityItem,
    icon: getPriorityIcon(priorityItem),
  }));

  const priorityOptions = {
    items,
    onClick: handlePriority,
    selectedKeys: [priority],
  };

  const handleDeleteFun = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handleDelete(task);
  };

  // Handle date change from date picker
  const handleDateChange = (date: dayjs.Dayjs | null, dateString: string) => {
    if (date) {
      // Close the date picker immediately
      setShowDatePicker(false);

      const newDate = date.toISOString();
      const originalDate = task.dueDate;

      // Create a copy of the task with the updated due date
      const updatedTask = { ...task, dueDate: newDate };

      // Update UI immediately (optimistic update)
      dispatch(updateTaskInStore({ category: status, taskId: _id, updatedTask: { ...updatedTask } }));

      // Show loading message
      const hideLoading = message.loading("Updating due date...", 0);

      taskAPI
        .updateTask(_id, updatedTask)
        .then(() => {
          // Clear loading message
          hideLoading();

          // Update the local task reference (for future operations)
          task.dueDate = newDate;
          void message.success("Due date updated successfully");
        })
        .catch((err) => {
          // Clear loading message
          hideLoading();

          console.error("Error updating due date:", err);

          // Revert the UI state
          dispatch(updateTaskInStore({
            category: status,
            taskId: _id,
            updatedTask: { ...task, dueDate: originalDate }
          }));

          void message.error("Failed to update due date on server, but will try again");

          // Even though API call failed, the database might have been updated
          // The next refresh will show the correct state
        });
    }
  };

  const indianTime = convertToIndianTime(dueDate);

  const content = (
    <Card onClick={(e) => e.stopPropagation()} className="max-w-md">
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className="text-black prose prose-sm"
      />
    </Card>
  );

  const datePickerContent = (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      style={{ padding: '12px', backgroundColor: '#1f2937', borderRadius: '8px' }}
    >
      <DatePicker
        onChange={handleDateChange}
        defaultValue={dayjs(dueDate)}
        allowClear={false}
        format="YYYY-MM-DD"
        className="dark-datepicker"
        style={{
          backgroundColor: '#374151',
          color: 'white',
          borderColor: '#4B5563',
          borderRadius: '6px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}
        popupStyle={{
          backgroundColor: '#1f2937',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
        }}
        autoFocus
      />
    </div>
  );

  const editAccessToCurrentUser = task.collaborators?.find(
    (collaborator) => String(collaborator.user?._id) === String(user?._id)
  )?.permissionType === "read" ? false : true;

  // Get border color based on priority
  const getPriorityBorderColor = () => {
    switch (priority) {
      case "Urgent":
        return "border-rose-500";
      case "High":
        return "border-amber-500";
      case "Medium":
        return "border-blue-500";
      default:
        return "border-emerald-500";
    }
  };

  // Get background gradient based on status and completion
  const getCardBackground = () => {
    if (done) return "bg-gradient-to-br from-slate-800 to-slate-900";

    switch (status) {
      case "todo":
        return "bg-gradient-to-br from-slate-800 to-slate-900";
      case "inProgress":
        return "bg-gradient-to-br from-slate-800 to-slate-900";
      case "completed":
        return "bg-gradient-to-br from-slate-800 to-slate-900";
      default:
        return "bg-gradient-to-br from-slate-800 to-slate-900";
    }
  };

  // Add useEffect to clean up when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any open popovers, dropdowns, etc when component unmounts
      const datePickerDropdown = document.querySelector('.ant-picker-dropdown');
      if (datePickerDropdown) {
        datePickerDropdown.remove();
      }
    };
  }, []);

  // Prevent double-clicks from triggering edit modal twice
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Add this to be extra safe
    if (!showModal) {
      setShowModal(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <div
        className={`cursor-pointer relative overflow-hidden rounded-lg shadow-md ${getCardBackground()} hover:shadow-lg transition-all duration-300 ${getPriorityBorderColor()} border-l-4`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Priority indicator at top right */}
        <div
          className="absolute top-2 right-2 z-10"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Dropdown
            menu={priorityOptions}
            disabled={!editAccessToCurrentUser}
            trigger={['click']}
            open={priorityDropdownOpen}
            onOpenChange={(visible) => {
              if (editAccessToCurrentUser) {
                setPriorityDropdownOpen(visible);
              }
            }}
          >
            <Button
              type="text"
              size="small"
              className="flex items-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                if (editAccessToCurrentUser) {
                  setPriorityDropdownOpen(!priorityDropdownOpen);
                }
              }}
            >
              {getPriorityIcon(priority)}
            </Button>
          </Dropdown>
        </div>

        {/* Task content */}
        <div className="p-3">
          {/* Tags */}
          {view === "cardView" && tags && tags.length > 0 && (
            <div className="mb-2 flex flex-wrap">
              {tags.map((tag) => (
                <Tag
                  key={tag.name}
                  color={tag.color}
                  className="mr-1 mb-1 text-xs rounded-full px-2 py-0"
                >
                  {tag.name}
                </Tag>
              ))}
            </div>
          )}

          {/* Task Title - with done indicator */}
          <div className="flex items-start mb-2">
            {done && (
              <CheckCircleFilled
                className="text-green-500 mt-1 mr-2 text-sm"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            )}
            <h3 className={`text-sm font-medium ${done ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
              {title}
            </h3>
          </div>

          {/* Description indicator */}
          {view === "cardView" && description && description.replace(/<[^>]*>/g, "") !== "" && (
            <div className="mb-2 text-xs text-gray-400" onClick={(e) => e.stopPropagation()}>
              <Popover content={content} trigger="hover" placement="right">
                <div className="flex items-center cursor-pointer hover:text-gray-200">
                  <AlignLeftOutlined className="mr-1" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                  <span>View details</span>
                </div>
              </Popover>
            </div>
          )}

          {/* Footer with metadata */}
          {view === "cardView" && (
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700">
              {/* Due date with DatePicker */}
              <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Popover
                  content={datePickerContent}
                  trigger="click"
                  open={showDatePicker}
                  onOpenChange={(visible) => {
                    setShowDatePicker(visible);
                    // Reset event handlers when popover closes
                    if (!visible) {
                      setTimeout(() => {
                        const datePickerDropdown = document.querySelector('.ant-picker-dropdown');
                        if (datePickerDropdown) {
                          datePickerDropdown.remove();
                        }
                      }, 100);
                    }
                  }}
                  overlayStyle={{ zIndex: 1050 }}
                  destroyTooltipOnHide
                >
                  <Badge
                    status={getDateColor()}
                    text={
                      <button
                        className={`text-xs flex items-center ${done ? 'text-green-400' : isPastDue ? 'text-red-400' : 'text-gray-400'} hover:text-white transition-colors disabled:opacity-50`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (editAccessToCurrentUser) {
                            setShowDatePicker(true);
                          }
                        }}
                        disabled={!editAccessToCurrentUser}
                      >
                        <CalendarOutlined className="mr-1" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        {indianTime}
                      </button>
                    }
                  />
                </Popover>
              </div>

              {/* Action buttons that appear on hover */}
              <Space>
                {/* Attachments indicator */}
                {attachments?.length > 0 && (
                  <Tooltip title={`${attachments.length} attachment${attachments.length > 1 ? 's' : ''}`}>
                    <span onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                      <Badge count={attachments.length} size="small">
                        <LinkOutlined className="text-gray-400" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                      </Badge>
                    </span>
                  </Tooltip>
                )}

                {/* Mark as done button */}
                {editAccessToCurrentUser && (
                  <Tooltip title={done ? "Mark as incomplete" : "Mark as complete"}>
                    <Button
                      type="text"
                      size="small"
                      icon={done ?
                        <ClockCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> :
                        <CheckCircleOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                      }
                      className={`text-gray-400 hover:text-green-400 hover:bg-gray-700 transition-all ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                      onClick={toggleTaskDone}
                    />
                  </Tooltip>
                )}

                {/* Edit button */}
                <Tooltip title="Edit task">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    className={`text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-all ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(true);
                    }}
                  />
                </Tooltip>

                {/* Delete button */}
                {editAccessToCurrentUser && (
                  <Popconfirm
                    placement="bottomLeft"
                    title={deleteText}
                    description={deleteDesc}
                    okText={<span className="bg-blue-500 px-3 rounded-sm">Yes</span>}
                    onConfirm={handleDeleteFun}
                    onCancel={(e) => {
                      if (e) e.stopPropagation();
                    }}
                    cancelText="No"
                  >
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                      className={`hover:text-red-500 hover:bg-gray-700 transition-all ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>
                )}
              </Space>
            </div>
          )}
        </div>
      </div>
      <EditTaskModal
        task={task}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </motion.div>
  );
};

export default TaskCard;
