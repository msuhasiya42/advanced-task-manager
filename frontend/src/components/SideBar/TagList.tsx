import React, { useState } from 'react';
import { Menu, Dropdown, Popconfirm, message } from 'antd';
import { EllipsisOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useTaskStore, { Tag } from '../../Store/taskStore';
import { taskTypes } from './SideBar';
import useAuthStore from '../../Store/authStore';
import { tagAPI, userAPI } from '../../Api';
import { deleteTagStr, deleteTagTitle } from '../../utils/strings';
import AddTags from '../AddUpdateTag/AddUpdateTag';
import { useMutation } from 'react-query';

interface TagListProps {
    setActiveTab: (tab: string) => void;
    activeTab: string;
    onChildPopupInteraction: (visible: boolean) => void;
}

const TagList = ({ setActiveTab, activeTab, onChildPopupInteraction }: TagListProps) => {
    const [visibleTag, setVisibleTag] = useState<string | null>(null);
    const [editTag, setEditTag] = useState<Tag | null>(null);
    const [showModal, setShowModal] = useState(false);

    const {
        tags,
        updateTags,
        copyTasks,
        filterTasksByTag,
        removeTagFromAllTasks,
        updateTagsInTasks
    } = useTaskStore();

    const filterTaskByTagName = (tagId: string) => {
        copyTasks();
        taskTypes.forEach((category) => filterTasksByTag(category, tagId));
    };

    const userId = useAuthStore((state) => state?.user?._id);

    const deleteTagMutation = useMutation(
        (tag: Tag) => tagAPI.deleteTag(userId as string, tag._id as string),
        {
            onSuccess: (res, variables) => {
                const { _id } = variables;

                const updatedTags = tags.filter((t: Tag) => t._id !== _id); // Ensure to filter by _id
                message.success("Tag Deleted", 1.5);
                updateTags(updatedTags);
                removeTagFromAllTasks(_id);
            },
            onError: () => {
                message.error("Error: Tag Not deleted", 2);
            }
        }
    );
    const handleDeleteTag = (tag: Tag) => {
        deleteTagMutation.mutate(tag);
    };

    const handleEditTag = (tag: Tag) => {
        setEditTag(tag);
        setShowModal(true); // Set the tag being edited
    };

    const menuItems = (tag: Tag) => [
        {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
            onClick: () => {
                // Handle edit action
                handleEditTag(tag); // Set the tag for editing
            }
        },
        {
            key: "delete",
            label: 'Delete',
            icon: <DeleteOutlined
                onPointerEnterCapture={() => { }}
                onPointerLeaveCapture={() => { }}
            />,
            onClick: () => {
                setVisibleTag(tag.name)
            }
        }];

    const updateTagMutation = useMutation(
        ({ tagId, userId, tagName, tagColor }: { tagId: string; userId: string; tagName: string; tagColor: string }) => tagAPI.updateTag(tagId, userId, tagName, tagColor),
        {
            onSuccess: (res, { tagId, tagName, tagColor }) => {
                message.success("Tag Updated Successfully");
                const updatedTags = tags.map((tag) => {
                    if (tag._id === tagId) {
                        return {
                            ...tag,
                            name: tagName,
                            color: tagColor,
                        };
                    }
                    return tag;
                });

                updateTags(updatedTags);
                updateTagsInTasks(editTag?._id ?? "", res.data);
                setEditTag(null);
            },
            onError: (error, { tagName }) => {
                console.error("Error updating tag:", error);
                message.error(`Failed to update tag ${tagName}}`, 1.5);
            },
            onSettled: () => {
                setShowModal(false);
            }
        }
    );

    const handleUpdateTag = (tagId: string, tagName: string, tagColor: string) => {
        if (userId) {
            updateTagMutation.mutate({ tagId, userId, tagName, tagColor });
        }
    };

    return (
        <div className="border border-gray-500 max-h-[500px] bg-gray-800 rounded-lg overflow-y-auto">
            {tags?.map((tag, index) => (
                <div className="flex flex-row items-center justify-between mx-2 my-1" key={index}>
                    <div
                        onClick={() => {
                            filterTaskByTagName(tag._id);
                            setActiveTab(`${index}-${tag}`);
                        }}
                        className={`flex items-center h-10 cursor-pointer ${activeTab === `${index}-${tag}` ? "text-blue-500" : "text-gray-300"} transition duration-75 rounded-lg group hover:text-white`}
                    >
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
                    </div>
                    <div>
                        <Dropdown menu={{ items: menuItems(tag) }} trigger={['click']}>
                            <EllipsisOutlined className="text-white hover:text-gray-500 cursor-pointer" onClick={(e) => e.stopPropagation()} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                        </Dropdown>
                    </div>
                    {visibleTag === tag.name && (
                        <Popconfirm
                            placement="top"
                            title={deleteTagTitle}
                            description={deleteTagStr}
                            okText={<span className="bg-blue-500 rounded-sm w-12">Yes</span>}
                            onConfirm={(e) => {
                                onChildPopupInteraction(false);
                                handleDeleteTag(tag);
                                e?.stopPropagation();
                            }}
                            onCancel={(e) => {
                                onChildPopupInteraction(false);
                                e?.stopPropagation();
                            }}
                            cancelText="No"
                            style={{ height: "200px" }}
                            overlayStyle={{ width: "250px" }}
                            open={true}
                            onOpenChange={(visible) => !visible && setVisibleTag(null)}
                        />
                    )}
                </div>
            ))}
            {/* Render AddTags component for editing */}
            {editTag && (
                <AddTags
                    showModal={showModal}
                    setShowModal={setShowModal}
                    onChildPopupInteraction={() => setEditTag(null)} // Close AddTags component when editing is done
                    tagId={editTag._id}
                    initialTagName={editTag.name} // Pass initial tag name for editing
                    initialTagColor={editTag.color} // Pass initial tag color for editing
                    onUpdateTag={(_id, tagName, tagColor) => {
                        handleUpdateTag(_id, tagName, tagColor);
                        setEditTag(null);
                    }}
                />
            )}
        </div>
    );
};

export default TagList;
