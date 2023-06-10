import React, { useState } from "react";
import NavBar from "./NavBarHomePage";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//import Footer from "./Footer";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrMsg, setShowErrMsg] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // process.env.REACT_APP_LOGIN_URL
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data);
      navigate("/user-dashboard");

      // Perform any additional actions upon successful sign-up
    } catch (error) {
      console.error("Login error:", error);
      setShowErrMsg(true);
      // Handle sign-up error
    }
  };
  return (
    <div>
      <NavBar />
      <div className="h-screen flex  justify-center items-center bg-gray-900 ">
        <div className="w-full max-w-xs">
          <a
            href="/login"
            className="flex ml-24 items-center mb-6 text-2xl font-semibold text-black dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            Log In
          </a>
          <form className="bg-white shadow-lg border rounded px-8 pt-6 pb-8 mb-4">
            {showErrMsg === true ? (
              <div
                class="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                role="alert"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 inline w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Info</span>
                <div>Invalid Credentials!</div>
              </div>
            ) : (
              ""
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleSubmit}
              >
                Sign In
              </button>
              <a
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="/forgotpassword"
              >
                Forgot Password?
              </a>
            </div>

            <p className="mt-6 text-sm font-light text-gray-500 dark:text-gray-400">
              Don't have account?{" "}
              <a
                href="/signup"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign Up here
              </a>
            </p>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2023 M & R Corp. All rights reserved.
          </p>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
