import React, { useState, useRef } from "react";
import LogoutButton from "../SmallComp/Logout/LogoutButton";
import LoadingPage from "../Loading/LoadingPage";
import useAuthStore from "../../Store/authStore";
import { userAPI } from "../../Api";
import ImageCompressor from "image-compressor.js";
import ChooseAvatarModal from "./ChooseAvatarModal";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteAccountDesc, deleteAccountText } from "../../utils/strings";
import { useQueryClient, useMutation } from "react-query";

const UserProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [userPhoto, setUserPhoto] = useState(user?.picture); // default image
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const fileToBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Expected a string from FileReader"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const updatePhotoMutation = useMutation(
    async (photoData: string) => {
      await userAPI.updatePhoto(user?._id ?? "", photoData);
    },
    {
      onSuccess: (data: any, photoData: string) => {
        updateUser({ picture: photoData });
        setUserPhoto(photoData);
        console.log("User photo updated successfully:", data);
        queryClient.invalidateQueries(['user']);
      },
      onError: () => {
        console.error("Failed to update user photo.");
      }
    }
  );

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      new ImageCompressor(file, {
        quality: 0.6,
        maxWidth: 1920,
        maxHeight: 1920,
        success: async (compressedResult) => {
          try {
            if (compressedResult.size <= 500 * 1024) {
              const photoData = await fileToBase64(compressedResult);
              updatePhotoMutation.mutate(photoData);
            } else {
              console.error("Failed to compress the image under 500KB");
            }
          } catch (error) {
            console.error("Failed to update user photo.", error);
          }
        },
        error: (err) => {
          console.error("Image compression error:", err.message);
        },
      });
    }
  };

  const deleteUserMutation = useMutation(
    async () => {
      await userAPI.deleteUser(user?._id ?? "");
    },
    {
      onSuccess: () => {
        updateUser({});
        logout();
        queryClient.invalidateQueries(['user']);
      },
      onError: () => {
        console.error("Failed to delete user.");
      }
    }
  );

  if (!user) {
    return (
      <div>
        <LoadingPage message="Loading User Profile..." />
      </div>
    );
  }

  const userName = user.name.charAt(0).toUpperCase() + user.name.slice(1);
  const { logout } = useAuthStore();

  const handleDeleteUser = () => {
    deleteUserMutation.mutate();
  };

  return (
    <div>
      <div className="w-full h-[250px]">
        <img
          src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
          className="w-full h-full rounded-tl-lg rounded-tr-lg"
          alt="demo"
        />
      </div>
      <div className="flex flex-col items-center -mt-20">
        <img
          src={
            userPhoto == undefined
              ? "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Images.png"
              : user.picture
          }
          alt="User Profile"
          onClick={handleImageClick}
          style={{ cursor: "pointer" }}
          className="w-36 h-36 rounded-lg"
        />
        <ChooseAvatarModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setUserPhoto={setUserPhoto}
        />

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className="flex items-center space-x-2 mt-2">
          <p className="text-2xl">{userName}</p>
          <span className="bg-blue-500 rounded-full p-1" title="Verified">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-100 h-2.5 w-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </span>{" "}
          <br />
        </div>
        <div>
          <span className="text-xl">Email : </span>
          <span className="text-lg">{user.email}</span>
        </div>
        <div>
          <Popconfirm
            title={deleteAccountText}
            description={deleteAccountDesc}
            okText="Yes"
            cancelText="No"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDeleteUser();
            }}
            onCancel={(e) => {
              e?.stopPropagation();
            }}
            okButtonProps={{ type: "primary", danger: true }}
          >
            <Button
              className="mt-6"
              icon={<DeleteOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              type="primary"
              danger
            >
              Delete Account
            </Button>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
