"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { AuthModal } from "@/components/AuthModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WatchlistProvider>
        {children}
        <AuthModal />
      </WatchlistProvider>
    </AuthProvider>
  );
}
