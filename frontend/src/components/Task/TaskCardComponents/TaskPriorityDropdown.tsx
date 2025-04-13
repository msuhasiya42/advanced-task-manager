import React from "react";
import { Button, Dropdown, MenuProps } from "antd";
import { getPriorityIcon } from "../utils";

interface TaskPriorityDropdownProps {
    priority: string;
    items: MenuProps["items"];
    priorityDropdownOpen: boolean;
    setPriorityDropdownOpen: (value: boolean) => void;
    handlePriority: MenuProps["onClick"];
    editAccessToCurrentUser: boolean;
}

/**
 * Component for displaying and editing task priority
 */
const TaskPriorityDropdown: React.FC<TaskPriorityDropdownProps> = ({
    priority,
    items,
    priorityDropdownOpen,
    setPriorityDropdownOpen,
    handlePriority,
    editAccessToCurrentUser,
}) => {
    const priorityOptions = {
        items,
        onClick: handlePriority,
        selectedKeys: [priority],
    };

    return (
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
    );
};

export default TaskPriorityDropdown; 