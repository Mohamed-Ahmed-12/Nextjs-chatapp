"use client";

import { useState, useEffect } from "react";

interface UserInfo {
  username: string;
  uid: string;
  access?: string;
  refresh?: string;
}

export function useUserData(): UserInfo {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    uid: "",
    access: "",
    refresh: "",
  });

  const loadUserData = () => {
    if (typeof window === "undefined") return;

    const access = localStorage.getItem("access") || "";
    const refresh = localStorage.getItem("refresh") || "";
    const uid = localStorage.getItem("uid") || "";
    const username = localStorage.getItem("username") || "";

    setUserInfo({ access, refresh, uid, username });
  };

  useEffect(() => {
    loadUserData(); // load on mount

    // Re-run when storage changes (e.g., after login)
    const handleStorageChange = () => loadUserData();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return userInfo;
}
