import { TaskCategory } from "../Types/types";

/**
 * Returns CSS classes for card styling based on priority, status, and completion state
 */
export const getCardClasses = (
    priority: string,
    status: TaskCategory,
    done: boolean
) => {
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

    return {
        priorityBorderClass: getPriorityBorderColor(),
        cardBackgroundClass: getCardBackground(),
    };
}; 