import axios from "axios";
import { useContext } from "react";
import { AuthenticationContext } from "@/app/context/AuthContext";
import { deleteCookie } from "cookies-next";

const useAuth = () => {
  const { setAuthState } = useContext(AuthenticationContext);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    setAuthState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const response = await axios.post("/api/auth/signin", {
        email,
        password,
      });
      setAuthState({
        loading: false,
        data: response.data,
        error: null,
      });
      return response.data;
    } catch (error: any) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
      console.log('error.response.data.errorMessage', error.response.data.errorMessage)
      throw new Error("Error signing in");
    }
  };

  const signUp = async ({
    firstName,
    lastName,
    email,
    password,
    phone,
    city,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    city: string;
  }) => {
    setAuthState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const response = await axios.post("/api/auth/signup", {
        firstName,
        lastName,
        email,
        password,
        phone,
        city,
      });
      setAuthState({
        loading: false,
        data: response.data,
        error: null,
      });
      return response.data;
    } catch (error: any) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
      throw new Error("Error signing up");
    }
  };

  const signOut = async () => {
    deleteCookie("jwt");
    setAuthState({
      loading: false,
      data: null,
      error: null,
    });
  }

  return {
    signIn,
    signUp,
    signOut
  };
};

export default useAuth;
