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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-12 w-full">
      {loginMutation.isLoading || googleLoginMutation.isLoading ? (
        <LoadingPage message="Logging In..." />
      ) : (
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          <div className="bg-gray-800 shadow-2xl rounded-xl overflow-hidden border border-gray-700 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
              {showErrMsg && (
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
                  <div>{errMsg}</div>
                </div>
              )}

              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-gray-300"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="block text-sm font-medium text-gray-300"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <a
                    className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    href="/forgotpassword"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-300 focus:outline-none"
                      onClick={handleShowPasswordToggle}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <button
                  className="w-full flex justify-center items-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-150 transform hover:scale-[1.02] active:scale-[0.98]"
                  type="submit"
                >
                  Sign In
                  <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center">
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

              <div className="text-center mt-4">
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Sign up now
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
      )}
    </div>
  );
};

export default Login;
