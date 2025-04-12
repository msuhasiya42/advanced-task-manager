import React, { useState } from 'react';
import { Dropdown, Popconfirm, message } from 'antd';
import { EllipsisOutlined, DeleteOutlined, EditOutlined, TagOutlined } from '@ant-design/icons';
import { taskTypes } from './SideBar';
import { tagAPI } from '../../Api';
import { deleteTagStr, deleteTagTitle } from '../../utils/strings';
import AddTags from '../AddUpdateTag/AddUpdateTag';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store/store';
import { Tag, filterTasksByTag, updateTags, removeTagFromAllTasks, updateTagsInTasks, setFilteredTasks } from '../../Store/reducers/taskSlice';

interface TagListProps {
    setActiveTab: (tab: string) => void;
    activeTab: string;
    onChildPopupInteraction: (visible: boolean) => void;
}

const TagList = ({ setActiveTab, activeTab, onChildPopupInteraction }: TagListProps) => {
    const [visibleTag, setVisibleTag] = useState<string | null>(null);
    const [editTag, setEditTag] = useState<Tag | null>(null);
    const [showModal, setShowModal] = useState(false);

    const { tags } = useSelector((state: RootState) => state.tasks);
    const dispatch = useDispatch();

    const filterTaskByTagName = (tagId: string) => {
        dispatch(setFilteredTasks());
        taskTypes.forEach((category) => dispatch(filterTasksByTag({ category, tagId })));
    };

    const userId = useSelector((state: any) => state.auth.user?._id);

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
                dispatch(updateTagsInTasks({ tagId: editTag?._id ?? "", updatedTag: res.data }));
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
        <div className="overflow-y-auto max-h-[240px] pr-1 custom-scrollbar">
            {tags && tags.length > 0 ? (
                tags.map((tag, index) => (
                    <div key={index} className="group mb-1.5 tag-item">
                        <button
                            onClick={() => {
                                filterTaskByTagName(tag._id);
                                setActiveTab(`${index}-${tag}`);
                            }}
                            className={`flex items-center w-full p-2.5 transition-all duration-200 rounded-lg group
                                ${activeTab === `${index}-${tag}`
                                    ? "bg-opacity-20 text-white shadow-sm"
                                    : "text-gray-300 hover:bg-gray-700/50 hover:text-white"}
                                focus:outline-none focus:ring-1 focus:ring-opacity-30 relative overflow-hidden`}
                            style={{
                                backgroundColor: activeTab === `${index}-${tag}` ? `${tag.color}20` : '',
                                boxShadow: activeTab === `${index}-${tag}` ? `0 1px 3px 0 ${tag.color}30` : ''
                            }}
                        >
                            <div className="flex items-center w-full">
                                <div
                                    className={`w-3 h-3 rounded-full mr-2.5 transition-transform ${activeTab === `${index}-${tag}` ? 'scale-110 active-tag-dot' : ''}`}
                                    style={{ backgroundColor: tag.color }}
                                ></div>
                                <span className="text-sm font-medium truncate">{tag.name}</span>
                            </div>

                            <div className={`absolute right-2 ${activeTab === `${index}-${tag}` ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}>
                                <Dropdown menu={{ items: menuItems(tag) }} trigger={['click']} placement="bottomRight">
                                    <button
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1 rounded-full hover:bg-gray-700/70 transition-colors"
                                    >
                                        <EllipsisOutlined className="text-gray-400 hover:text-white" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                                    </button>
                                </Dropdown>
                            </div>
                        </button>

                        {visibleTag === tag.name && (
                            <Popconfirm
                                placement="topRight"
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
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-4 text-gray-500 text-sm">
                    <TagOutlined className="text-xl mb-2" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                    <p>No tags created yet</p>
                </div>
            )}

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
