import React from "react";
import { FaReact } from "react-icons/fa";
const AboutUs = () => (
  <div className="h-full flex flex-col bg-gray-900 text-white">
    <main className="flex-grow flex flex-col items-center justify-center">
      <span className="font-light text-4xl text-center animate-bounce">
        Hey, I'm Mayur, Working as a Frontend Developer
        <FaReact className="inline ml-2 text-blue-400" />
      </span>
      <div className="flex justify-center items-center">
        <h3 className="mt-5 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl animate-gradientMove">
          My Expertise lies in React Js
        </h3>
        <span className="mt-5 ml-2 text-2xl">🚀</span>
      </div>
    </main>
  </div>
);

export default AboutUs;
