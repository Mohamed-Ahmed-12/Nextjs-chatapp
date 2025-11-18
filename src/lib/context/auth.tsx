"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { axiosInstance } from "../network";
import { AuthContextType, User } from "@/src/types/types";
import { useUserData } from "@/src/hooks/useUser";
import { useRouter } from "next/navigation";
// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Use custom hook to fetch local user data
  const { username, uid, access, refresh } = useUserData();

  // ✅ On mount, check if tokens exist to auto-authenticate user
  useEffect(() => {
    if (access && refresh && username && uid) {
      setUser({ username, uid, refresh, access });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
      router.push('/')
    }
    setLoading(false);
  }, [username, uid, access, refresh]);

  // ✅ Login
  const login = async (username: string, password: string): Promise<User> => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("auth/login/", {
        username,
        password,
      });
      const { refresh, access, uid } = response.data;

      // Store credentials
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("uid", uid);
      localStorage.setItem("username", username);

      // Update state
      setUser({ username, uid, refresh, access });
      setIsAuthenticated(true);

      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("uid");
    localStorage.removeItem("username");
    window.location.href = "/";
  };
  
  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook for consuming auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
