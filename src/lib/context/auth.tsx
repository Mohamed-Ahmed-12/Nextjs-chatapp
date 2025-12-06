"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { axiosInstance, setLogoutCallback } from "../network";
import { AuthContextType, User } from "@/src/types/types";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Load user from localStorage
  const loadUserData = () => {
    if (typeof window === "undefined") return;

    const user = localStorage.getItem("user");

    if (user) {
      setUser(JSON.parse(user));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  };


  const signup = async (data: FormData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post("auth/signup/", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed");
      throw new Error(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  const login = async (data: User): Promise<User> => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.post("auth/login/", data);
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      setIsAuthenticated(true);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = React.useCallback((): void => {
    setUser(null);
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    router.push("/");
  }, [router]);

  useEffect(() => {
    loadUserData();

    // 1. Register the local logout function with the global interceptor
    // This allows the interceptor in the 'network' file to call logout()
    setLogoutCallback(logout);

    const handleStorageChange = () => loadUserData();
    window.addEventListener("storage", handleStorageChange);

    setLoading(false);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      // clear the callback on unmount
      setLogoutCallback(() => { });
    };
  }, [logout]);

  const value: AuthContextType = React.useMemo(() => ({
    user,
    isAuthenticated,
    login,
    logout,
    signup,
    loading,
    error,
  }), [user, isAuthenticated, loading, error]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
