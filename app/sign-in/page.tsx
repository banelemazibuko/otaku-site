"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { isLoading, user, openAuthModal } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (user) {
      router.replace("/");
      return;
    }

    openAuthModal("signin");
    router.replace("/");
  }, [isLoading, user, openAuthModal, router]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="h-8 w-8 animate-pulse rounded-full bg-otaku-violet/30" />
    </div>
  );
}
