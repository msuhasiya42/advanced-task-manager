import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

const ErrorPage: React.FC = () => {
    return (
        <div className="flex w-full h-full justify-center items-center">
            <div className="bg-white rounded-lg shadow-md p-6">
                <FaExclamationCircle className="text-red-500 text-4xl mb-4" />
                <div className="text-red-500 text-xl font-semibold mb-4">
                    Error loading user data
                </div>
                <div className="text-gray-600">
                    There was an error while loading user data. Please try again later.
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
