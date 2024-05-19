import React, { useEffect, useState } from "react";
import { Modal, Input, message, Button } from "antd";
import { CompactPicker, TwitterPicker } from "react-color";
import { userAPI } from "../../Api";
import useAuthStore from "../../Store/authStore";
import useTaskStore, { Tag } from "../../Store/taskStore";
import Title from "antd/es/typography/Title";
import { TagOutlined } from "@ant-design/icons";

const AddTags = ({ onChildPopupInteraction }: { onChildPopupInteraction: (active: boolean) => void }) => {
  const [showModal, setShowModal] = useState(false);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#2196F3");

  const userId = useAuthStore((state) => state?.user?._id);
  const { addTag, checkTagExists, tags } = useTaskStore((state) => ({
    addTag: state.addTag,
    checkTagExists: state.checkTagExists,
    tags: state.tags,
  }));

  const handleToggle = () => {
    onChildPopupInteraction(!showModal);
    setShowModal((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (checkTagExists(tagName)) {
      message.error("Tag already exists.", 2);
    } else {
      try {
        if (tagName.trim() === "") {
          message.error("Empty Tag.", 1.5);
          setShowModal(false);
          return;
        }
        const newTag: Tag = { name: tagName, color: tagColor };
        const updatedTags = [...tags, newTag];
        await userAPI.updateUserTag(userId ?? "", updatedTags);
        addTag(newTag);
        message.success("Tag Added.", 1.5);
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
      <button
        onClick={handleToggle}
        className="px-5 py-1 ml-8 w-32 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
      >
        Add Tag
      </button>
      <Modal
        open={showModal}
        title={<div className="flex text-lg justify-start"><TagOutlined className="mr-2" />Add Tag</div>}
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
            className="text-gray-900 bg-white border ml-2 px-5 py-1 border-blue-300 focus:outline-none hover:bg-blue-400 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm mr-2 mb-2 dark:bg-blue-500 dark:text-white dark:border-blue-600 dark:hover:bg-blue-700 dark:hover:border-blue-600 dark:focus:ring-blue-700"
            onClick={handleSubmit}
          >
            Add
          </button>,
        ]}
      >
        <div className="">
          <Title level={5}>Tag name</Title>
          <Input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            id="tagName"
            type="text"
            className="block w-full text-gray-800 bg-white mb-4 focus:ring-0"
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

export default AddTags;
