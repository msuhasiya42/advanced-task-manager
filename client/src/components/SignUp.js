import { useEffect, useState } from "react";
import React from "react";
import NavBar from "./NavBar";
import axios from "axios";
// import axios from "axios";
//import Footer from "./Footer";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showErrMsg, setShowErrMsg] = useState(false);

  useEffect(() => {}, []);
  // regex for password and email
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // process.env.REACT_APP_SIGNUP_URL
    try {
      const response = await axios.post("http://localhost:5000/signup", {
        email,
        password,
      });

      console.log("Sign-up successful:", response.data);
      // Perform any additional actions upon successful sign-up
    } catch (error) {
      console.error("Sign-up error:", error);
      // Handle sign-up error
    }

    // number 2
    // validation should be after user clicks on submit
    // regular expressions to validate password
    // if (password.length !== 0 && !password.match(passRegex)) {
    //   setErrMsg(
    //     "Password must contain eight characters, at least one letter, one number and one special character:"
    //   );
    //   setShowErrMsg(true);
    // } else if (password !== conPassword) {
    //   setErrMsg("Password does not match!!");
    //   setShowErrMsg(true);
    // }
    // setErrMsg("");
    // setShowErrMsg(false);

    // api call for sign up
    // const response = await fetch(url, "/signup", {
    //   email: email,
    //   password: password,
    // });

    // // Handle the response
    // if (response.ok) {
    //   // Display success message or redirect to a success page
    //   console.log("Sign-up successful");
    // } else {
    //   // Display error message or handle the specific error
    //   console.error("Sign-up failed");
    // }
  };

  document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("successButton").click();
  });
  return (
    <div>
      <NavBar />
      <section className="bg-gray-900">
        {/* <form onSubmit={handleSubmit}> */}
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="/signup"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            Sign Up
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <p className="text-red-400">
                  {showErrMsg === true ? errMsg : ""}
                </p>
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
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
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                {/* {password.length !== 0 && showErrMsg ? (
                  <div className="text-red-500 "> {passErrorMessage} </div>
                ) : (
                  ""
                )} */}

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    value={conPassword}
                    onChange={(e) => {
                      setConPassword(e.target.value);
                    }}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                {/* {conPassword.length !== 0 && showErrMsg ? (
                  <div className="text-red-500 "> {conErrorMessage} </div>
                ) : (
                  ""
                )} */}

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      {/* <a
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        href="#"
                      >
                        Terms and Conditions
                      </a> */}
                      <p className="font-medium text-primary-600 ">
                        Terms and Conditions
                      </p>
                    </label>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    id="successButton"
                    data-modal-toggle="successModal"
                    className="w-full text-white bg-cyan-600 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled: bg-cyan-400"
                    onClick={(e) => handleSubmit(e)}
                    disabled={
                      email.length === 0 ||
                      password.length === 0 ||
                      conPassword.length === 0
                    }
                  >
                    Create an account
                  </button>
                </div>

                {/* modal for success message */}
                <div
                  id="successModal"
                  tabIndex="-1"
                  aria-hidden="true"
                  className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full"
                >
                  <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                    <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                      <button
                        type="button"
                        className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-toggle="successModal"
                      >
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
                        <svg
                          aria-hidden="true"
                          className="w-8 h-8 text-green-500 dark:text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="sr-only">Success</span>
                      </div>
                      <p className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Successfully removed product.
                      </p>
                      <button
                        data-modal-toggle="successModal"
                        type="button"
                        className="py-2 px-3 text-sm font-medium text-center text-white rounded-lg bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-900"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
                {/* modal end */}

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
