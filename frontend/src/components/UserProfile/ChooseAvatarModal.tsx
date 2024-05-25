import { Avatar, Modal, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { avatarStyles, getAvatar, getCategory } from "./avatarCategories";
import { userAPI } from "../../Api";
import useAuthStore from "../../Store/authStore";

interface AvatarModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUserPhoto: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const ChooseAvatarModal = ({
  isModalOpen,
  setIsModalOpen,
  setUserPhoto,
}: AvatarModalProps) => {
  const avatarCount = 10;

  const [selectedCategory, setSelectedCategory] = useState("");
  const { user, updateUser } = useAuthStore();

  useEffect(() => {
    setSelectedCategory("lorelei");
  }, []);

  // Generate an array of dynamic avatars using DiceBear
  const avatars = Array.from({ length: avatarCount }).map(() => {
    const currCategory = getCategory(selectedCategory);
    return getAvatar(currCategory);
  });

  const handleAvatarSelection = (selectedAvatar: string) => {
    setUserPhoto(selectedAvatar);

    // Assuming you have userId available in this scope or as a prop
    userAPI.updatePhoto(user?._id ?? "", selectedAvatar);
    updateUser({ picture: selectedAvatar });

    // Close the modal after selecting an avatar
    setIsModalOpen(false);
  };

  const items = avatarStyles.map((style) => ({
    label: style.slice(0, 1).toUpperCase() + style.slice(1),
    key: style,
    children: (
      <div>
        {avatars.map((avatar, index) => (
          <Avatar
            key={index}
            src={avatar}
            size={60}
            alt={`Avatar ${index + 1}`}
            shape="square"
            style={{
              cursor: "pointer",
              border: "1px solid gray",
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.6)",
              margin: "22px",
            }}
            onClick={() => {
              handleAvatarSelection(avatar);
            }}
          />
        ))}
      </div>
    ),
  }));

  const handleTabClick = (category: string) => {
    setSelectedCategory(category);
  };
  return (
    <Modal
      style={{ textAlign: "center" }}
      title={
        <div
          style={{
            textAlign: "center",
            marginLeft: "130px",
          }}
        >
          <span>Choose Avatar</span>
        </div>
      }
      open={isModalOpen}
      centered
      footer={null}
      closable={true}
      onCancel={() => {
        setIsModalOpen(false);
      }}
      width={600}
    >
      <Tabs
        style={{ height: "400px" }}
        tabPosition={"left"}
        items={items}
        onTabClick={handleTabClick}
      />
    </Modal>
  );
};

export default ChooseAvatarModal;
