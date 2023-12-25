import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  svgPath: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  description,
  onConfirm,
  svgPath,
}) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          className="pr-2"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark: hover:text-gray-900 dark:hover:text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={svgPath}
            ></path>
          </svg>
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
        <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <AlertDialog.Title className="text-black text-mauve12 m-0 text-[17px] font-medium">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="text-gray-600 text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-end gap-[25px]">
            <AlertDialog.Cancel asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="text-mauve11 text-gray-500 bg-gray-200 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium "
              >
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm();
                }}
                className="text-red-600 bg-red-200 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
              >
                Yes, delete
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
