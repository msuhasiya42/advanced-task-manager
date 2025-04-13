import { useState } from "react";
import { TaskType } from "../Types/types";
import { convertToIndianTime } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Store/store";
import { updateTaskInStore } from "../../../Store/reducers/taskSlice";
import { message } from "antd";
import { taskAPI } from "../../../Api";
import { MenuProps } from "antd";
import dayjs from "dayjs";

/**
 * Custom hook to manage TaskCard state and behaviors
 * Follows optimistic update pattern:
 * 1. First update the Redux store immediately for a responsive UI
 * 2. Then make the API call to persist changes
 * 3. If API call succeeds, update the local task object for future operations
 * 4. If API call fails, revert the Redux store to the original state
 */
const useTaskCard = (task: TaskType, handleDelete: (task: TaskType) => void) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    // State
    const [showModal, setShowModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);

    const { _id, status, dueDate, done } = task;

    // Date calculations
    const taskDate = new Date(dueDate);
    const currentDate = new Date();
    const isPastDue = taskDate < currentDate && !done;
    const indianTime = convertToIndianTime(dueDate);

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

    // Check if current user has edit access
    const editAccessToCurrentUser = task.collaborators?.find(
        (collaborator) => String(collaborator.user?._id) === String(user?._id)
    )?.permissionType === "read" ? false : true;

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
        if (newPriority === task.priority) {
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
            });
    };

    // Handle delete function
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
                });
        }
    };

    return {
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
    };
};

export default useTaskCard; 