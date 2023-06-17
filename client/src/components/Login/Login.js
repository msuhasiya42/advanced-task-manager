import React, { useState } from "react";
import NavBar from "../NavBar/NavBarHomePage";
import { login } from "../../ApiCalls";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("Invalid Credentials");
  const [showErrMsg, setShowErrMsg] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // login api call
    login(email, password)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        navigate("/user-dashboard");
      })
      .catch((err) => {
        console.error("Login error:", err);
        if (err.code === "ERR_NETWORK") {
          setErrMsg("There was a ");
        } else if (err.code === "ERR_BAD_RESPONSE") {
          setErrMsg("Internal Server Error");
        } else {
          setErrMsg("An Error Occurred");
        }
        setShowErrMsg(true);
        console.log(err);
      });
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
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <form
              onSubmit={handleSubmit}
              className=" space-y-4 shadow-lg border rounded px-10 pt-12 pb-10 "
            >
              {showErrMsg === true ? (
                <div
                  className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                  role="alert"
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 inline w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>{errMsg}</div>
                </div>
              ) : (
                ""
              )}
              <div className="mb-4">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="username"
                >
                  Email
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="email"
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                  type="submit"
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
              <p className="text-center text-gray-500 text-xs">
                &copy;2023 M & R Corp. All rights reserved.
              </p>
            </form>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
