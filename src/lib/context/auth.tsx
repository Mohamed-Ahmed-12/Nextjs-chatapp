"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { axiosInstance } from "../network";
import { AuthContextType, User } from "@/src/types/types";
import { useUserData } from "@/src/hooks/useUser";
import { useRouter, usePathname } from "next/navigation";

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
  const pathname = usePathname();

  const { username, uid, access, refresh } = useUserData();

  useEffect(() => {
    if (access && refresh && username && uid) {
      setUser({ username, uid, refresh, access });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [username, uid, access, refresh]);

  useEffect(() => {
    if (!isAuthenticated && !loading && pathname !== "/") {
      router.push("/");
    }
  }, [isAuthenticated, loading, pathname, router]);

  const login = async (username: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post("auth/login/", { username, password });
      const { refresh, access, uid } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("uid", uid);
        localStorage.setItem("username", username);
      }

      setUser({ username, uid, refresh, access });
      setIsAuthenticated(true);

      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    router.push("/");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
    error,
  };

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