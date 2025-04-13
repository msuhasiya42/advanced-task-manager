import React, { useEffect } from "react";
import { TasksProps } from "./Types/types";
import {
  MenuProps,
} from "antd";
import EditTaskModal from "./EditTaskModal";
import {
  CheckCircleFilled,
} from "@ant-design/icons";
import { getPriorityIcon, taskPriorities } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { motion } from "framer-motion";
import useTaskCard from "./hooks/useTaskCard";
import TaskActionButtons from "./TaskCardComponents/TaskActionButtons";
import TaskDatePicker from "./TaskCardComponents/TaskDatePicker";
import TaskDescription from "./TaskCardComponents/TaskDescription";
import TaskPriorityDropdown from "./TaskCardComponents/TaskPriorityDropdown";
import TaskTags from "./TaskCardComponents/TaskTags";
import { getCardClasses } from "./utils/taskCardUtils";

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
  } = task;

  const dispatch = useDispatch();
  const { view } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);

  // Custom hook to manage task card state and handlers
  const {
    showModal,
    setShowModal,
    isHovered,
    setIsHovered,
    showDatePicker,
    setShowDatePicker,
    priorityDropdownOpen,
    setPriorityDropdownOpen,
    toggleTaskDone,
    handlePriority,
    handleDateChange,
    handleDeleteFun,
    isPastDue,
    isToday,
    indianTime,
    getDateColor,
    editAccessToCurrentUser
  } = useTaskCard(task, handleDelete);

  // Priority dropdown menu items
  const items: MenuProps["items"] = taskPriorities.map((priorityItem) => ({
    label: priorityItem,
    key: priorityItem,
    icon: getPriorityIcon(priorityItem),
  }));

  // Card style classes
  const { cardBackgroundClass, priorityBorderClass } = getCardClasses(priority, status, done);

  // Clean up any open popovers, dropdowns when component unmounts
  useEffect(() => {
    return () => {
      const datePickerDropdown = document.querySelector('.ant-picker-dropdown');
      if (datePickerDropdown) {
        datePickerDropdown.remove();
      }
    };
  }, []);

  // Prevent double-clicks from triggering edit modal twice
  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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
        className={`cursor-pointer relative overflow-hidden rounded-lg shadow-md ${cardBackgroundClass} hover:shadow-lg transition-all duration-300 ${priorityBorderClass} border-l-4`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Priority indicator at top right */}
        <TaskPriorityDropdown
          priority={priority}
          items={items}
          priorityDropdownOpen={priorityDropdownOpen}
          setPriorityDropdownOpen={setPriorityDropdownOpen}
          handlePriority={handlePriority}
          editAccessToCurrentUser={editAccessToCurrentUser}
        />

        {/* Task content */}
        <div className="p-3">
          {/* Tags */}
          {view === "cardView" && tags && tags.length > 0 && (
            <TaskTags tags={tags} />
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
            <TaskDescription description={description} />
          )}

          {/* Footer with metadata */}
          {view === "cardView" && (
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700">
              {/* Due date with DatePicker */}
              <TaskDatePicker
                dueDate={dueDate}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                getDateColor={getDateColor}
                indianTime={indianTime}
                done={done}
                isPastDue={isPastDue}
                handleDateChange={handleDateChange}
                editAccessToCurrentUser={editAccessToCurrentUser}
              />

              {/* Action buttons */}
              <TaskActionButtons
                attachments={attachments}
                done={done}
                isHovered={isHovered}
                toggleTaskDone={toggleTaskDone}
                setShowModal={setShowModal}
                handleDeleteFun={handleDeleteFun}
                editAccessToCurrentUser={editAccessToCurrentUser}
              />
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
