import React, { useState } from "react";
import { Modal, Input, message, Button } from "antd";
import { CompactPicker } from "react-color";
import Title from "antd/es/typography/Title";
import { PlusOutlined, TagOutlined } from "@ant-design/icons";
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
        title={<div className="flex text-lg justify-start"><TagOutlined className="mr-2" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />{isEditMode ? "Update Tag" : "Add Tag"}</div>}
        centered
        onCancel={handleToggle}
        width={330}
        footer={[
          <Button
            key="cancel"
            className="font-medium"
            onClick={handleToggle}
          >
            Cancel
          </Button>,
          <button
            key="add"
            className="text-gray-900 border ml-2 px-5 py-1 border-blue-300 focus:outline-none hover:bg-blue-400 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm mr-2 mb-2 bg-blue-500 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-600 focus:ring-blue-700"
            onClick={handleSubmit}
          >
            {isEditMode ? "Update" : "Add"} {/* Change button label based on mode */}
          </button>,
        ]}
        style={{ backgroundColor: "white" }}
        bodyStyle={{ padding: "24px", backgroundColor: "white" }}
      >
        <div className="">
          <Title level={5}>Tag name</Title>
          <Input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            id="tagName"
            type="text"
            className="block w-full text-gray-800 mb-4 focus:ring-0"
            required
          />
          <Title level={5}>Tag color</Title>
          <div className="flex justify-center">
            <CompactPicker
              className="justify-center"
              color={tagColor}
              onChangeComplete={(color) => setTagColor(color.hex)}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddUpdateTag;
