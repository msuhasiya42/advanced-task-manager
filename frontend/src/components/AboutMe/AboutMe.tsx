import React from "react";
import { FaReact, FaPython, FaJava, FaNodeJs, FaJs } from "react-icons/fa";
import { SiScala, SiSpringboot, SiPostgresql, SiTypescript, SiMongodb, SiOpenai } from "react-icons/si";

const AboutMe = () => (
  <div className="flex items-center justify-center bg-gray-900 text-white min-h-screen w-full">
    <main className="container mx-auto p-8 flex flex-col items-center justify-center text-center w-full">
      {/* Profile Header */}
      <div className="mb-12 w-full text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Hi, I'm Mayur
        </h1>
        <h2 className="text-3xl font-medium text-gray-300">
          Full Stack Developer
        </h2>
      </div>

      {/* Tech Stack Section */}
      <div className="mb-16 w-full">
        <h3 className="text-2xl font-semibold mb-8 text-blue-400">My Tech Stack</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Frontend */}
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
            <FaJs className="text-4xl text-yellow-400 mb-2" />
            <span>JavaScript</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
            <SiTypescript className="text-4xl text-blue-500 mb-2" />
            <span>TypeScript</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
            <FaReact className="text-4xl text-blue-400 mb-2" />
            <span>React.js</span>
          </div>

          {/* Backend */}
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
            <FaNodeJs className="text-4xl text-green-600 mb-2" />
            <span>Node.js</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
            <SiSpringboot className="text-4xl text-green-500 mb-2" />
            <span>Spring Boot</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
            <FaPython className="text-4xl text-yellow-500 mb-2" />
            <span>Python</span>
          </div>

          {/* Programming Languages */}
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
            <SiScala className="text-4xl text-red-500 mb-2" />
            <span>Scala</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
            <FaJava className="text-4xl text-orange-500 mb-2" />
            <span>Java</span>
          </div>

          {/* Databases */}
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
            <SiPostgresql className="text-4xl text-blue-300 mb-2" />
            <span>PostgreSQL</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
            <SiMongodb className="text-4xl text-green-500 mb-2" />
            <span>MongoDB</span>
          </div>

          {/* AI */}
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
            <SiOpenai className="text-4xl text-teal-500 mb-2" />
            <span>ChatGPT</span>
          </div>
        </div>
      </div>

      {/* Brief Description */}
      <div className="mb-12 w-full">
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Passionate full-stack developer with expertise in building modern web applications.
          Experienced in front-end technologies like React.js, JavaScript, and TypeScript,
          back-end frameworks including Node.js, Spring Boot, and Python,
          and working with both SQL and NoSQL databases such as PostgreSQL and MongoDB.
          Also proficient in leveraging AI technologies like ChatGPT for innovative solutions.
        </p>
      </div>

      {/* Portfolio Button */}
      <div className="mt-6">
        <a
          href="https://mayursuhasiya.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-block px-10 py-5 overflow-hidden border-2 border-blue-400 rounded-full transition-all duration-500 hover:scale-105"
        >
          {/* Background Animation */}
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"></span>

          {/* Button Text */}
          <span className="relative flex items-center justify-center text-xl font-semibold text-white z-10">
            Checkout My Portfolio
            <svg
              className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
        </a>
      </div>
    </main>
  </div>
);

export default AboutMe;
