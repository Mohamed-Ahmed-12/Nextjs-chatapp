
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../lib/context/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/"); // send to login page
    }
  }, [loading, isAuthenticated, router]);

  if (!isAuthenticated) return null; // or loading spinner

  return <>{children}</>;
}
