import React from "react";
import { Card, Popover } from "antd";
import { AlignLeftOutlined } from "@ant-design/icons";

interface TaskDescriptionProps {
    description: string;
}

/**
 * Component to display task description with a hover popover
 */
const TaskDescription: React.FC<TaskDescriptionProps> = ({ description }) => {
    const content = (
        <Card onClick={(e) => e.stopPropagation()} className="max-w-md">
            <div
                dangerouslySetInnerHTML={{ __html: description }}
                className="text-black prose prose-sm"
            />
        </Card>
    );

    return (
        <div className="mb-2 text-xs text-gray-400" onClick={(e) => e.stopPropagation()}>
            <Popover content={content} trigger="hover" placement="right">
                <div className="flex items-center cursor-pointer hover:text-gray-200">
                    <AlignLeftOutlined className="mr-1" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <span>View description</span>
                </div>
            </Popover>
        </div>
    );
};

export default TaskDescription; 