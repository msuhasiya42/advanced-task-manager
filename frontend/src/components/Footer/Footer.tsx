import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 border-t border-indigo-500/30 shadow-inner shadow-indigo-500/10">
      {/* Main Footer Content */}
      <div className="container mx-auto px-3 py-8">
        <div className="flex flex-col md:flex-row justify-between">

          {/* About/Description Section */}
          <div className="mb-6 md:mb-0 md:w-1/3">
            <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Advanced Task Manager</h2>
            <p className="text-sm">
              A personal project designed to help you organize tasks, boost productivity,
              and manage your time effectively with a beautiful and intuitive interface.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-6 md:mb-0 md:w-1/4">
            <h3 className="text-md font-semibold mb-4 text-blue-400">Quick Links</h3>
            <ul className="text-sm">
              <li className="mb-2">
                <a href="/" className="hover:text-blue-400 transition-colors duration-300">Home</a>
              </li>
              <li className="mb-2">
                <a href="/about" className="hover:text-blue-400 transition-colors duration-300">About</a>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div className="md:w-1/4 md:text-right">
            <h3 className="text-md font-semibold mb-4 text-blue-400">Connect</h3>
            <div className="flex md:justify-end space-x-4">
              <a
                href="https://github.com/msuhasiya42"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/mayur-suhasiya/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="mailto:mayursuhasiya136@gmail.com"
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
              >
                <FaEnvelope size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-gray-900/50 border-t border-gray-700/40 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm">
            © {currentYear} Advanced Task Manager. All Rights Reserved.
          </div>
          <div className="mt-4 md:mt-0 text-sm">
            <span>Designed & Developed by </span>
            <a
              href="https://www.linkedin.com/in/mayur-suhasiya/"
              className="text-blue-400 hover:text-indigo-400 hover:underline transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mayur Suhasiya
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
