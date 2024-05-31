/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import useLogin from "../../hooks/useLogin";
import LoadingPage from "../Loading/LoadingPage";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("Invalid Credentials");
  const [showErrMsg, setShowErrMsg] = useState(false);

  const { loginMutation, googleLoginMutation } = useLogin()

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };
  const handleLoginError = (err: any) => {
    console.error("Login error:", err);
    let message = "An Error Occurred";

    if (err.response?.status === 401) {
      message = "Invalid Credentials";
    } else if (err.message === "Network Error") {
      message =
        "There was a problem connecting to the server. Please check your internet connection and try again.";
    } else if (err.response?.status >= 500) {
      message = "Internal Server Error";
    }

    setErrMsg(message);
    setShowErrMsg(true);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onError: handleLoginError,
      }
    );
  };

  const loginGoogle = (response: any) => {
    const { credential } = response;
    googleLoginMutation.mutate(
      { credential },
      {
        onError: handleLoginError,
      }
    );
  };

  return (
    <div className="flex h-full justify-center items-center bg-gray-900 flex-col">
      <div className="flex justify-center items-center bg-gray-900 " >
        {loginMutation.isLoading || googleLoginMutation.isLoading ? <LoadingPage message="Logging In..." /> : <div className="w-full max-w-xs">
          <a
            href="/login"
            className="flex justify-center items-center mb-6 text-2xl font-semibold text-white"
          >
            Log In
          </a>
          <div className="w-full flex justify-center items-center rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
            <form
              // onSubmit={handleSubmit}
              className=" space-y-4 shadow-lg  rounded px-10 pt-12 pb-10 "
            >
              {showErrMsg === true ? (
                <div
                  className="flex p-4 mb-4 text-sm border rounded-lg bg-gray-800 text-red-400 border-red-800"
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
                  className="block mb-2 text-sm font-medium  text-white"
                  htmlFor="username"
                >
                  Email
                </label>
                <input
                  className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  id="email"
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label
                  className="block mb-2 text-sm font-medium text-white"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="mt-3">
                  <input
                    type="checkbox"
                    id="showPasswordCheckbox"
                    checked={showPassword}
                    onChange={handleShowPasswordToggle}
                  />
                  <label className="ml-2" htmlFor="showPasswordCheckbox">
                    Show Password
                  </label>
                </div>
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
              <p className="mt-6 text-sm font-light text-gray-400">
                Don't have account?{" "}
                <a
                  href="/signup"
                  className="font-medium hover:underline text-primary-500"
                >
                  Sign Up here
                </a>
              </p>
              <p className="text-center text-gray-500 text-xs">
                &copy;2023 Mayur Corp. All rights reserved.
              </p>
              <div className="">
                <GoogleLogin
                  onSuccess={(googleToken) => {
                    loginGoogle(googleToken);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                  useOneTap
                />
              </div>
            </form>
          </div>
        </div>}
      </div >
      {/* <Footer /> */}
    </div >
  );
};

export default Login;
