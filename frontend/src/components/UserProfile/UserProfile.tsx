import React, { useState, useRef } from "react";
import LogoutButton from "../SmallComp/Logout/LogoutButton";
import LoadingPage from "../Loading/LoadingPage";
import useAuthStore from "../../Zustand/authStore";
import { updateUserApi } from "../../ApiCalls";
import ImageCompressor from "image-compressor.js";

const UserProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [userPhoto, setUserPhoto] = useState(user?.picture); // default image
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      new ImageCompressor(file, {
        quality: 0.6,
        maxWidth: 1920,
        maxHeight: 1920,
        success: async (compressedResult) => {
          try {
            // Ensure the compressed image is under 500KB
            if (compressedResult.size <= 500 * 1024) {
              const photoData = await fileToBase64(compressedResult);
              setUserPhoto(photoData);

              // Assuming you have userId available in this scope or as a prop
              await updateUserApi(user?.id, "", "", photoData);
              updateUser({ picture: photoData });
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

  if (!user) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }
  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/user-dashboard" className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Task-Manager
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-dropdown"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-dropdown"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div
            className="hidden w-full md:block md:w-auto"
            id="navbar-dropdown"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <LogoutButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>

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

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className="flex items-center space-x-2 mt-2">
          <p className="text-2xl">{user.name}</p>
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
          </span>
        </div>
        <p className="text-sm text-gray-500">New York, USA</p>
      </div>
    </div>
  );
};

export default UserProfile;
