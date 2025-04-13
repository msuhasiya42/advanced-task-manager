import React from "react";
import { Tag as AntTag } from "antd";
import { Tag } from "../../../Store/reducers/taskSlice";

interface TaskTagsProps {
    tags: Tag[];
}

/**
 * Component to display task tags
 */
const TaskTags: React.FC<TaskTagsProps> = ({ tags }) => {
    return (
        <div className="mb-2 flex flex-wrap">
            {tags.map((tag) => (
                <AntTag
                    key={tag.name}
                    color={tag.color}
                    className="mr-1 mb-1 text-xs rounded-full px-2 py-0"
                >
                    {tag.name}
                </AntTag>
            ))}
        </div>
    );
};

export default TaskTags; 