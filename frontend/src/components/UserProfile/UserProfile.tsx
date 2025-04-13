import React, { useState, useRef } from "react";
import LoadingPage from "../Loading/LoadingPage";
import { userAPI } from "../../Api";
import ImageCompressor from "image-compressor.js";
import ChooseAvatarModal from "./ChooseAvatarModal";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteAccountDesc, deleteAccountText } from "../../utils/strings";
import { useQueryClient, useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "../../Store/reducers/authSlice";
import { RootState } from "../../Store/store";

const UserProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [userPhoto, setUserPhoto] = useState(user?.picture);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

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
        dispatch(updateUser({ picture: photoData }));
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
        dispatch(updateUser({}));
        dispatch(logout());
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

  const handleDeleteUser = () => {
    deleteUserMutation.mutate();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-12 w-full">
      <div className="w-full max-w-3xl mx-auto bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:shadow-blue-500/10">
        <div className="relative">
          {/* Banner image */}
          <div className="w-full h-[200px] overflow-hidden">
            <img
              src="https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg"
              className="w-full h-full object-cover rounded-t-xl"
              alt="Profile banner"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70"></div>
          </div>

          {/* Profile picture - centered over the banner */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
              <img
                src={
                  !user.picture
                    ? "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Images.png"
                    : user.picture
                }
                alt="User Profile"
                className="w-32 h-32 rounded-full border-4 border-gray-800 shadow-lg object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm">Change Photo</span>
              </div>
            </div>
          </div>
        </div>

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

        {/* User info section */}
        <div className="flex flex-col items-center pt-20 pb-10 px-6">
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-3xl font-bold text-white">{userName}</h1>
            <span className="bg-blue-500 rounded-full p-1" title="Verified">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-100 h-3 w-3"
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
            </span>
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-gray-300">{user.email}</span>
          </div>

          {/* Account management section */}
          <div className="w-md max-w-xs">
            <div className="border-t border-gray-700 pt-6 mt-2">
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
                  className="w-full flex items-center justify-center space-x-2"
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
      </div>
    </div>
  );
};

export default UserProfile;
