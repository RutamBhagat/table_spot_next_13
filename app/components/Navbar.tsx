"use client";
import Link from "next/link";
import React, { useState } from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

const Navbar = () => {
  const [isLoginHidden, setIsLoginHidden] = useState(true);
  const [isSignUpHidden, setIsSignUpHidden] = useState(true);

  const showLoginModal = () => {
    setIsLoginHidden(!isLoginHidden);
  };

  const showSignUpModal = () => {
    setIsSignUpHidden(!isSignUpHidden);
  };

  const switchModel = () => {
    setIsLoginHidden(!isLoginHidden);
    setIsSignUpHidden(!isSignUpHidden);
  }

  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      <div>
        <div className="flex">
          {/* <button className="bg-blue-400 text-white border p-1 px-4 rounded mr-3">Sign in</button> */}
          <LoginModal isLoginHidden={isLoginHidden} setIsLoginHidden={setIsLoginHidden} switchModel={switchModel} />
          {/* <button className="border p-1 px-4 rounded">Sign up</button> */}
          <SignUpModal isSignUpHidden={isSignUpHidden} setIsSignUpHidden={setIsSignUpHidden} switchModel={switchModel} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
