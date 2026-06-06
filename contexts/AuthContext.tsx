"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { User } from "@/lib/types";
import { validateSignIn, validateSignUp } from "@/lib/validation";

const AUTH_STORAGE_KEY = "otaku_auth";
const USERS_STORAGE_KEY = "otaku_users";

type AuthModalTab = "signin" | "signup";

interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: AuthModalTab;
  openAuthModal: (tab?: AuthModalTab) => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => AuthResult;
  signUp: (email: string, password: string, confirmPassword: string, name?: string) => AuthResult;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function createUserId(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
}

function createAvatarUrl(name: string): string {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

function getStoredUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function toSessionUser(stored: StoredUser): User {
  return {
    id: stored.id,
    name: stored.name,
    email: stored.email,
    avatarUrl: createAvatarUrl(stored.name),
  };
}

function persistSession(user: User): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>("signin");
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as User);
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openAuthModal = useCallback((tab: AuthModalTab = "signin") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen((open) => {
      if (!open) {
        triggerRef.current = document.activeElement as HTMLElement | null;
      }
      return true;
    });
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
      triggerRef.current = null;
    });
  }, []);

  const signUp = useCallback(
    (email: string, password: string, confirmPassword: string, name?: string): AuthResult => {
      const fieldErrors = validateSignUp({
        email,
        password,
        confirmPassword,
        name,
      });

      if (Object.keys(fieldErrors).length > 0) {
        return { success: false, error: Object.values(fieldErrors)[0] };
      }

      const trimmedEmail = email.trim().toLowerCase();
      const displayName = name?.trim() || trimmedEmail.split("@")[0];
      const users = getStoredUsers();

      if (users.some((u) => u.email === trimmedEmail)) {
        return { success: false, error: "An account with this email already exists" };
      }

      const newStoredUser: StoredUser = {
        id: createUserId(trimmedEmail),
        email: trimmedEmail,
        name: displayName,
        password,
      };

      saveStoredUsers([...users, newStoredUser]);

      const sessionUser = toSessionUser(newStoredUser);
      persistSession(sessionUser);
      setUser(sessionUser);

      return { success: true };
    },
    []
  );

  const signIn = useCallback(
    (email: string, password: string): AuthResult => {
      const fieldErrors = validateSignIn({ email, password });

      if (Object.keys(fieldErrors).length > 0) {
        return { success: false, error: Object.values(fieldErrors)[0] };
      }

      const trimmedEmail = email.trim().toLowerCase();
      const users = getStoredUsers();
      const match = users.find((u) => u.email === trimmedEmail);

      if (!match) {
        return { success: false, error: "No account found with this email" };
      }

      if (match.password !== password) {
        return { success: false, error: "Incorrect password" };
      }

      const sessionUser = toSessionUser(match);
      persistSession(sessionUser);
      setUser(sessionUser);

      return { success: true };
    },
    []
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
      signIn,
      signUp,
      signOut,
    }),
    [
      user,
      isLoading,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
      signIn,
      signUp,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
