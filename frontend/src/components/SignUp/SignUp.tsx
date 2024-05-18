import React, { useState } from "react";
import NavBar from "../NavBar/NavBarHomePage";
import { userAPI } from "../../Api";
import { getAvatar } from "../UserProfile/avatarCategories";
import { lorelei } from "@dicebear/collection";
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

    const picture = getAvatar(lorelei);
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
    <div className="bg-gray-900 flex h-screen flex-col overflow-y-hidden overflow-x-hidden">
      <NavBar />
      <section>
        {/* <form onSubmit={handleSubmit}> */}
        <div className="flex flex-col items-center mt-20 mx-auto  lg:py-0">
          <a
            href="/signup"
            className="flex items-center mb-6 text-xl font-semibold text-gray-900 dark:text-white"
          >
            Sign Up
          </a>
          <div className=" bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-5 space-y-5 md:space-y-5 sm:p-5">
              <form className="space-y-4 md:space-y-6" action="#">
                {/*error message */}
                {userData.showErrMsg === true ? (
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
                    <div>
                      <span className="font-medium">Error: </span>
                      {userData.errMsg}
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="tom Cruise"
                    required
                    value={userData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                    value={userData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="conPassword"
                    id="confirm-password"
                    value={userData.conPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                      // value={isSubscribed}
                      onChange={handleCheckbox}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the Terms and Conditions
                    </label>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    id="successButton"
                    data-modal-toggle="successModal"
                    className="w-80 text-white hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled: bg-cyan-400"
                    onClick={(e) => handleSubmit(e)}
                    disabled={
                      userData.email.length === 0 ||
                      userData.password.length === 0 ||
                      userData.conPassword.length === 0 ||
                      !isSubscribed
                    }
                  >
                    Create an account
                  </button>
                </div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
        {/* </form> */}
      </section>
      {/* <Footer /> */}
    </div>
  );
};

export default SignUp;
