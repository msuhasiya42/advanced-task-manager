import { Avatar, Modal, Tabs, Spin, Button } from "antd";
import React, { useEffect, useState } from "react";
import { avatarStyles, getAvatarUrls, fetchImageAsBase64 } from "./avatarCategories";
import { userAPI } from "../../Api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { updateUser } from "../../Store/reducers/authSlice";

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
  const avatarCount = 12;

  const [selectedCategory, setSelectedCategory] = useState("");
  const [avatarUrls, setAvatarUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedCategory("public");
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      // Generate new avatars when category changes
      refreshAvatars();
    }
  }, [selectedCategory]);

  const handleAvatarSelection = async (selectedAvatarUrl: string) => {
    try {
      setIsLoading(true);

      // Fetch the actual image data as base64
      const base64Image = await fetchImageAsBase64(selectedAvatarUrl);

      // Save the base64 image data instead of the URL
      setUserPhoto(base64Image);

      // Update the user's avatar in the database with the base64 image data
      userAPI.updatePhoto(user?._id ?? "", base64Image);
      dispatch(updateUser({ picture: base64Image }));

      // Close the modal after selecting an avatar
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error fetching avatar image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a new set of avatar URLs for the current category
  const refreshAvatars = () => {
    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      setAvatarUrls(getAvatarUrls(selectedCategory, avatarCount));
      setIsLoading(false);
    }, 600);
  };

  const items = avatarStyles.map((style) => {
    let label: string;
    switch (style) {
      case "boy":
        label = "Male";
        break;
      case "girl":
        label = "Female";
        break;
      case "public":
      default:
        label = "Random";
    }

    return {
      label,
      key: style,
      children: (
        <div>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            minHeight: "300px", // Add min height to prevent layout shift
            position: "relative"
          }}>
            {isLoading ? (
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}>
                <Spin size="large" tip="Loading avatars..." />
              </div>
            ) : (
              avatarUrls.map((avatarUrl, index) => (
                <Avatar
                  key={index}
                  src={avatarUrl}
                  size={70}
                  alt={`Avatar ${index + 1}`}
                  style={{
                    cursor: "pointer",
                    border: "1px solid #e8e8e8",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    margin: "10px",
                    borderRadius: "50%"
                  }}
                  onClick={() => {
                    handleAvatarSelection(avatarUrl);
                  }}
                />
              ))
            )}
          </div>
        </div>
      ),
    };
  });

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
      footer={
        <div className="flex justify-center">
          <button
            onClick={refreshAvatars}
            disabled={isLoading}
            style={{
              padding: "5px 10px",
              borderRadius: "4px",
              backgroundColor: "#1890ff",
              color: "white",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? "Loading..." : "Refresh Avatars"}
          </button>
        </div>
      }
      closable={true}
      onCancel={() => {
        setIsModalOpen(false);
      }}
      width={600}
    >
      <Tabs
        style={{ height: "450px" }}
        tabPosition={"left"}
        items={items}
        onTabClick={handleTabClick}
      />
    </Modal>
  );
};

export default ChooseAvatarModal;
