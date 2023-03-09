"use client";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

const Navbar = () => {
  const [isLoginHidden, setIsLoginHidden] = useState(true);
  const [isSignUpHidden, setIsSignUpHidden] = useState(true);
  const { loading, data } = useContext(AuthenticationContext);
  const { signOut } = useAuth();

  const switchModel = () => {
    setIsLoginHidden(!isLoginHidden);
    setIsSignUpHidden(!isSignUpHidden);
  };

  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      <div>
        {loading ? null : (
          <div className="flex">
            {data ? (
              <button
                onClick={signOut}
                className="block p-1 mr-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
              >
                Sign Out
              </button>
            ) : (
              <>
                <LoginModal
                  isLoginHidden={isLoginHidden}
                  setIsLoginHidden={setIsLoginHidden}
                  switchModel={switchModel}
                />
                <SignUpModal
                  isSignUpHidden={isSignUpHidden}
                  setIsSignUpHidden={setIsSignUpHidden}
                  switchModel={switchModel}
                />
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
