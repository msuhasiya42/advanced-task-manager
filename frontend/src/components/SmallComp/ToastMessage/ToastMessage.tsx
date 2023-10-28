import React from "react";

/* eslint-disable react/react-in-jsx-scope */
interface ToastProps {
  type: "success" | "error";
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ type, message }: ToastProps) => (
  <div className="toast bg-transparent">
    <div className=" bg-transparent">
      <div className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-700">
        <div className="px-4 py-2 -mx-3">
          <div className="mx-3">
            <span
              className={`font-semibold ${
                type === "success"
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {message}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
