import React, { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { RootState } from "../../Store/store";
import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    setHeaderVisible(true);
  }, []);

  if (user) {
    return <Navigate to="/user-dashboard" replace />;
  }

  const features = [
    {
      title: "Add Tasks",
      desc: "Create new tasks with titles, descriptions, and due dates.",
      bgColor: "from-rose-400 to-pink-300",
      icon: "📝",
    },
    {
      title: "Set Priorities",
      desc: "Assign priorities to your tasks to know what to tackle first.",
      bgColor: "from-sky-400 to-blue-300",
      icon: "🔝",
    },
    {
      title: "Tagging System",
      desc: "Categorize your tasks with tags for more efficient management.",
      bgColor: "from-amber-400 to-yellow-300",
      icon: "🏷️",
    },
    {
      title: "Progress Tracking",
      desc: "Move tasks from 'todo' to 'in progress' to 'completed' as you work through them.",
      bgColor: "from-emerald-400 to-teal-300",
      icon: "📊",
    },
    {
      title: "Beautiful Notes",
      desc: "Write detailed descriptions for each task to capture all necessary information.",
      bgColor: "from-violet-400 to-purple-300",
      icon: "📓",
    },
  ];

  // For staggered animation of feature cards
  const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return (
      <div
        ref={ref}
        className={`flex-shrink m-4 p-6 rounded-lg shadow-lg max-w-sm bg-gradient-to-br ${feature.bgColor} text-gray-800 transform transition-all duration-500 hover:scale-105 
                 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transitionDelay: `${index * 150}ms` }}
      >
        <div className="text-4xl mb-3">{feature.icon}</div>
        <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
        <p className="text-gray-700">{feature.desc}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-black py-10 w-full">
      <div className="max-w-5xl w-full mx-auto text-center px-5">
        <div className={`transition-all duration-1000 ease-out transform ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h1 className="text-white text-5xl font-bold mb-2 leading-tight">
            Welcome to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Advanced Task Manager</span>
          </h1>
          <h1 className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
            Organize your tasks efficiently and boost your productivity with our powerful yet intuitive task management system.
          </h1>
        </div>

        <div className="flex justify-center flex-wrap mt-8 w-full">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} index={idx} />
          ))}
        </div>

        <div className={`mt-12 transition-all duration-1000 delay-500 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link
            to="/signup"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-full hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
          >
            Get Started
          </Link>

          <div className="mt-8 flex items-center justify-center">
            <hr className="w-24 border-gray-700" />
            <p className="mx-4 text-gray-400">
              Already have an account?
            </p>
            <hr className="w-24 border-gray-700" />
          </div>

          <Link
            to="/login"
            className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
          >
            Login to your account →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
