"use client";
import useAuth from "@/hooks/useAuth";
import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../context/AuthContext";

const defaultFormFields = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  city: "",
};

const SignUpModal = ({
  isSignUpHidden,
  setIsSignUpHidden,
  switchModel,
}: {
  isSignUpHidden: boolean;
  setIsSignUpHidden: (value: boolean) => void;
  switchModel: () => void;
}) => {
  const [input, setInput] = useState(defaultFormFields);
  const [isDisabled, setIsDisabled] = useState(true);
  const [showError, setShowError] = useState(false);
  const { signUp } = useAuth();
  const { loading, data, error } = useContext(AuthenticationContext);

  useEffect(() => {
    if (input.firstName && input.lastName && input.email && input.password && input.phone && input.city) {
      return setIsDisabled(false);
    }
    setIsDisabled(true);
  }, [input]);

  const handleClick = (event: any) => {
    if (event.target === event.currentTarget) {
      setIsSignUpHidden(!isSignUpHidden);
    }
  };

  const resetFormFields = () => {
    setInput(defaultFormFields);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setInput({ ...input, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await signUp(input);
      resetFormFields();
      setIsSignUpHidden(!isSignUpHidden);
    } catch (error) {
      setShowError(true);
      console.log("error", error);
    }
  };

  return (
    <>
      {/* <!-- Modal toggle --> */}
      <button
        onClick={() => {
          setIsSignUpHidden(!isSignUpHidden);
        }}
        className="block border text-white hover:text-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-1 px-5 py-2.5 text-center"
        type="button"
      >
        Sign Up
      </button>

      {/* <!-- Main modal --> */}
      <div
        onClick={handleClick}
        id="authentication-modal"
        className={`${
          isSignUpHidden ? "hidden" : ""
        } fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center`}
      >
        <div className="relative w-full h-full max-w-md md:h-auto">
          {/* <!-- Modal content --> */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 min-h-[65vh]">
            {loading ? (
              <div className="absolute inset-0 w-full h-full flex justify-center items-center" role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsSignUpHidden(!isSignUpHidden);
                  }}
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                  data-modal-hide="authentication-modal"
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
                <div className="px-6 py-6 lg:px-8">
                  <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Sign up on OpenTable</h3>
                  <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                    {data?.firstName} {data?.lastName}
                  </h3>
                  {error && (
                    <div
                      id="alert-2"
                      className={`flex p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 ${
                        showError ? "" : "hidden"
                      }`}
                      role="alert"
                    >
                      <svg
                        aria-hidden="true"
                        className="flex-shrink-0 w-5 h-5"
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
                      <div className="ml-3 text-sm font-medium">{error}</div>
                      <button
                        onClick={() => {
                          setShowError(false);
                        }}
                        type="button"
                        className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                        aria-label="Close"
                      >
                        <span className="sr-only">Close</span>
                        <svg
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
                      </button>
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        id="signup_email"
                        value={input.email}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label
                        htmlFor="email"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Email address
                      </label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        id="signup_password"
                        value={input.password}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                      />
                      <label
                        htmlFor="password"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Password
                      </label>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                      <div className="relative z-0 w-full mb-6 group">
                        <input
                          onChange={handleChange}
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={input.firstName}
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          required
                        />
                        <label
                          htmlFor="firstName"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          First name
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-6 group">
                        <input
                          onChange={handleChange}
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={input.lastName}
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          required
                        />
                        <label
                          htmlFor="lastName"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Last name
                        </label>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 md:gap-6">
                      <div className="relative z-0 w-full mb-6 group">
                        <input
                          onChange={handleChange}
                          type="tel"
                          pattern="[0-9]{10}"
                          name="phone"
                          id="phone"
                          value={input.phone}
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          required
                        />
                        <label
                          htmlFor="phone"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Phone (10-digit)
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-6 group">
                        <input
                          onChange={handleChange}
                          type="text"
                          name="city"
                          id="city"
                          value={input.city}
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          required
                        />
                        <label
                          htmlFor="city"
                          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          City
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isDisabled}
                      className={`${
                        isDisabled ? "bg-blue-400" : "bg-blue-600"
                      } w-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
                    >
                      Register your account
                    </button>
                    <div className="text-sm font-medium mt-5 text-gray-500 dark:text-gray-300">
                      Already have an account?{" "}
                      <button
                        onClick={() => {
                          resetFormFields();
                          switchModel();
                        }}
                        className="text-blue-700 hover:underline dark:text-blue-500"
                      >
                        Log In
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpModal;
