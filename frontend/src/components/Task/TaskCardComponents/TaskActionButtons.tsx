import React from "react";
import { Badge, Button, Popconfirm, Space, Tooltip } from "antd";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    LinkOutlined
} from "@ant-design/icons";
import { deleteDesc, deleteText } from "../../../utils/strings";

interface TaskActionButtonsProps {
    attachments?: string[];
    done: boolean;
    isHovered: boolean;
    toggleTaskDone: (e?: React.MouseEvent) => void;
    setShowModal: (value: boolean) => void;
    handleDeleteFun: (e?: React.MouseEvent) => void;
    editAccessToCurrentUser: boolean;
}

/**
 * Component for task action buttons (mark as done, edit, delete)
 */
const TaskActionButtons: React.FC<TaskActionButtonsProps> = ({
    attachments = [],
    done,
    isHovered,
    toggleTaskDone,
    setShowModal,
    handleDeleteFun,
    editAccessToCurrentUser,
}) => {
    const attachmentCount = attachments?.length || 0;

    return (
        <Space>
            {/* Attachments indicator */}
            {attachmentCount > 0 && (
                <Tooltip title={`${attachmentCount} attachment${attachmentCount > 1 ? 's' : ''}`}>
                    <span onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <Badge count={attachmentCount} size="small">
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
    );
};

export default TaskActionButtons; 