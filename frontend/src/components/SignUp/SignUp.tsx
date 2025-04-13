import React, { useState } from "react";
import { userAPI } from "../../Api";
import { getAvatarUrl, fetchImageAsBase64 } from "../UserProfile/avatarCategories";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;

const SignUp = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    conPassword: "",
    errMsg: "",
    showErrMsg: false,
    success: false,
    isSubscribed: false,
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  const isValidForm = () => {
    if (!userData.email.match(EMAIL_REGEX)) {
      updateErrorMessage("Invalid Email!");
      return false;
    }

    if (!userData.password.match(PASSWORD_REGEX)) {
      updateErrorMessage(
        "Password must contain eight characters, one capital letter, one small letter, one number, and one special character."
      );
      return false;
    }

    if (userData.password !== userData.conPassword) {
      updateErrorMessage("Password not matched");
      return false;
    }

    return true;
  };

  const updateErrorMessage = (msg: string) => {
    setUserData((prevState) => ({
      ...prevState,
      errMsg: msg,
      showErrMsg: true,
      success: false,
    }));
  };

  const handleApiError = (err: any) => {
    let message = "An unknown error occurred.";
    if (err.code === "ERR_NETWORK") {
      message =
        "There was a problem connecting to the server. Please check your internet connection and try again.";
    } else if (err.code === "ERR_BAD_RESPONSE") {
      message = "Internal Server Error";
    } else {
      message = "Email Already Registered";
    }
    updateErrorMessage(message);
    console.error(err);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!isValidForm()) return;

    try {
      // Get a random avatar URL
      const avatarUrl = getAvatarUrl("public") + "?r=" + Math.floor(Math.random() * 1000);

      // Fetch the actual image data as base64
      const picture = await fetchImageAsBase64(avatarUrl);

      userAPI
        .createUser(userData.name, userData.email, userData.password, picture)
        .then((response) => {
          if (response.status === 200) {
            void message.success("User created successfully", 1.5);
            navigate("/login");
            setUserData((prevState) => ({
              ...prevState,
              success: true,
              showErrMsg: false,
            }));
          }
        })
        .catch(handleApiError);
    } catch (error) {
      console.error("Error fetching avatar image:", error);
      handleApiError(error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckbox = () => setIsSubscribed((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-12 w-full">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        </div>

        <div className="bg-gray-800 shadow-2xl rounded-xl overflow-hidden border border-gray-700 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div className="p-8 space-y-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {userData.showErrMsg && (
                <div
                  className="flex p-4 text-sm border rounded-lg bg-red-500/10 text-red-400 border-red-800 animate-fadeIn"
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
                  <span className="sr-only">Error</span>
                  <div>
                    <span className="font-medium">Error: </span>
                    {userData.errMsg}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="John Doe"
                    required
                    value={userData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    placeholder="you@example.com"
                    required
                    value={userData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Must contain 8+ characters with uppercase, lowercase, number and special character.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="conPassword"
                    id="confirm-password"
                    value={userData.conPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start p-1">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border rounded bg-gray-700 border-gray-600 focus:ring-blue-500 ring-offset-gray-800 focus:ring-offset-gray-800"
                    required
                    onChange={handleCheckbox}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-300"
                  >
                    I accept the <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">Terms and Conditions</a>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  onClick={(e) => handleSubmit(e)}
                  disabled={
                    userData.email.length === 0 ||
                    userData.password.length === 0 ||
                    userData.conPassword.length === 0 ||
                    !isSubscribed
                  }
                >
                  Create Account
                  <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Sign in
                  </a>
                </p>
              </div>

              <div className="mt-6">
                <p className="text-center text-xs text-gray-500">
                  &copy;2023 Mayur Corp. All rights reserved.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
