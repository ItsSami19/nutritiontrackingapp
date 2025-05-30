"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export function useRequireAuth() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) router.push("/login");
  }, [user, router]);

  return user;
}
