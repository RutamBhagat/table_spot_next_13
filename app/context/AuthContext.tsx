"use client";
import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  email: string;
  phone: string;
};

interface State {
  loading: boolean;
  data: User | null;
  error: string | null;
}

interface AuthenticationContextType extends State {
  setAuthState: React.Dispatch<React.SetStateAction<State>>;
}

export const AuthenticationContext = createContext<AuthenticationContextType>({
  loading: false,
  data: null,
  error: null,
  setAuthState: () => {},
});

export default function AuthContext({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<State>({
    loading: true,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    setAuthState({
      loading: true,
      data: null,
      error: null,
    });
    try {
      const jwt = getCookie("jwt");
      if (!jwt) {
        setAuthState({
          loading: false,
          data: null,
          error: null,
        });
        return;
      }

      const response = await axios.get("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      setAuthState({
        loading: false,
        data: response.data,
        error: null,
      });
    } catch (error: any) {
      setAuthState({
        loading: false,
        data: null,
        error: error.response.data.errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = { ...authState, setAuthState };
  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>;
}
