import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 border-t border-indigo-500/30 shadow-inner shadow-indigo-500/10">
      {/* Simplified Footer Content */}
      <div className="container mx-auto px-3 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Connect Section */}
          <div className="flex items-center">
            <div className="text-sm mr-4">
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

            <div className="flex space-x-4">
              <a
                href="https://github.com/msuhasiya42"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
              >
                <FaGithub size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/mayur-suhasiya/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="mailto:mayursuhasiya136@gmail.com"
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
              >
                <FaEnvelope size={18} />
              </a>
            </div>
          </div>

          <div className="text-xs mt-2 md:mt-0">
            © {currentYear} Advanced Task Manager
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
