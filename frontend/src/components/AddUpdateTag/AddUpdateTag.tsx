import React, { useState } from "react";
import { Modal, Input, message, Button } from "antd";
import { CompactPicker } from "react-color";
import Title from "antd/es/typography/Title";
import { TagOutlined, PlusOutlined } from "@ant-design/icons";
import { tagAPI } from "../../Api";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { updateTags } from "../../Store/reducers/taskSlice";

interface AddTagsProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onChildPopupInteraction: (active: boolean) => void;
  tagId?: string;
  initialTagName?: string;
  initialTagColor?: string;
  onUpdateTag?: (_id: string, tagName: string, tagColor: string) => void;
}

const AddUpdateTag = ({ tagId, showModal, setShowModal, onChildPopupInteraction, initialTagName, initialTagColor, onUpdateTag }: AddTagsProps) => {
  const [tagName, setTagName] = useState(initialTagName ?? "");
  const [tagColor, setTagColor] = useState(initialTagColor ?? "#2196F3");

  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const { tags } = useSelector((state: RootState) => state.tasks);

  const isEditMode = !!initialTagName; // Check if component is in edit mode

  const handleToggle = () => {
    onChildPopupInteraction(!showModal);
    setShowModal((prev) => !prev);
  };

  const addTagMutation = useMutation(
    ({ userId, tagName, tagColor }: { userId: string; tagName: string; tagColor: string }) => tagAPI.addTag(userId, tagName, tagColor),
    {
      onSuccess: (res) => {
        const newTag = res.data;
        message.success("Tag Added.", 1.5);
        updateTags([...tags, newTag]);
      },
      onError: (error) => {
        message.error("Error adding tag.", 1.5);
        console.error("Error adding tag:", error);
      },
    }
  );

  const checkTagExists = (tagName: string) => {
    return tags.some((tag) => tag.name === tagName);
  }

  const handleSubmit = async () => {
    if (checkTagExists(tagName) && !isEditMode) {
      message.error("Tag already exists.", 2);
    } else {
      try {
        if (tagName.trim() === "") {
          message.error("Empty Tag.", 1.5);
          setShowModal(false);
          return;
        }

        if (isEditMode && onUpdateTag) {
          onUpdateTag(tagId ?? "", tagName, tagColor); // Call update callback in edit mode
        }

        else {
          addTagMutation.mutate({ userId: userId as string, tagName, tagColor });
        }
        setTagName("");
        setTagColor("#2196F3");
        setShowModal(false);
      } catch (error) {
        console.error(error);
        message.error("Tag Not added.");
      } finally {
        onChildPopupInteraction(false);
      }
    }
  };


  return (
    <>
      {!isEditMode &&
        <button
          onClick={handleToggle}
          className="flex items-center justify-center px-4 py-2 gap-2 w-full text-sm font-medium text-gray-300 transition-all duration-200 bg-gray-700/50 hover:bg-indigo-600/80 rounded-lg shadow-sm hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-opacity-50"
        >
          <PlusOutlined className="text-xs" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
          <span>Add New Tag</span>
        </button>
      }
      <Modal
        open={showModal}
        title={
          <div className="flex items-center text-lg text-gray-100 bg-gray-800 py-1 px-1 -mt-4 -mx-6 rounded-t-lg border-b border-gray-700">
            <TagOutlined className="mr-2 text-indigo-400" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            <span>{isEditMode ? "Update Tag" : "Add Tag"}</span>
          </div>
        }
        centered
        onCancel={handleToggle}
        width={350}
        className="tag-modal"
        style={{ top: 20 }}
        bodyStyle={{ backgroundColor: '#1f2937', padding: '20px' }}
        footer={[
          <Button
            key="cancel"
            className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600 hover:text-white hover:border-gray-500"
            onClick={handleToggle}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            className="bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-500 hover:border-indigo-600 shadow-sm"
            onClick={handleSubmit}
          >
            {isEditMode ? "Update" : "Add"}
          </Button>,
        ]}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      >
        <div className="text-gray-200">
          <Title level={5} className="text-gray-300 mb-2">Tag name</Title>
          <Input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            id="tagName"
            type="text"
            className="mb-5 bg-gray-700 border-gray-600 text-gray-200 focus:border-indigo-500"
            placeholder="Enter tag name"
            required
          />
          <Title level={5} className="text-gray-300 mb-2">Tag color</Title>
          <div className="flex justify-center bg-gray-800 p-3 rounded-lg shadow-inner">
            <CompactPicker
              color={tagColor}
              onChangeComplete={(color) => setTagColor(color.hex)}
            />
          </div>
          <div className="mt-4 flex items-center">
            <div className="flex-1 border-t border-gray-700"></div>
            <div
              className="mx-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: tagColor }}
            >
              <TagOutlined className="text-white" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
            </div>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddUpdateTag;
