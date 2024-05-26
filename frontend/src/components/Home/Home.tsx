import React from "react";
import { Navigate, Link } from "react-router-dom";
import useAuthStore from "../../Store/authStore";

const Home = () => {
  const { user } = useAuthStore();
  if (user) {
    return <Navigate to="/user-dashboard" replace />;
  }

  const features = [
    {
      title: "Add Tasks",
      desc: "Create new tasks with titles, descriptions, and due dates.",
      bgColor: "bg-red-500",
    },
    {
      title: "Set Priorities",
      desc: "Assign priorities to your tasks to know what to tackle first.",
      bgColor: "bg-blue-500",
    },
    {
      title: "Tagging System",
      desc: "Categorize your tasks with tags for more efficient management.",
      bgColor: "bg-yellow-500",
    },
    {
      title: "Progress Tracking",
      desc: "Move tasks from 'todo' to 'in progress' to 'completed' as you work through them.",
      bgColor: "bg-green-500",
    },
    {
      title: "Beautiful Notes",
      desc: "Write detailed descriptions for each task to capture all necessary information.",
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <div className="flex justify-center items-center h-full bg-gray-900">
      <div className="text-center p-5">
        <h1 className="text-white text-4xl font-bold mb-4">
          Welcome to Your Advance Task Manager
        </h1>
        <p className="text-lg mb-8 text-gray-400">
          Organize your tasks efficiently and increase your productivity.
        </p>

        <div className="flex justify-center flex-wrap">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`flex-shrink m-4 p-4 rounded shadow-md max-w-sm ${feature.bgColor} text-white`}
            >
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/signup"
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-500"
          >
            Get Started
          </Link>
          <p className="mt-8 text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
