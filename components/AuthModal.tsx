"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { LogIn, UserPlus, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { FieldErrors, validateSignIn, validateSignUp } from "@/lib/validation";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    openAuthModal,
    signIn,
    signUp,
  } = useAuth();

  const dialogRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setFieldErrors({});
    setGeneralError("");
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    if (!isAuthModalOpen) {
      resetForm();
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAuthModal();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      const firstInput = dialogRef.current?.querySelector<HTMLElement>("input");
      firstInput?.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      clearTimeout(timer);
    };
  }, [isAuthModalOpen, closeAuthModal, resetForm]);

  function switchTab(tab: "signin" | "signup") {
    openAuthModal(tab);
    setFieldErrors({});
    setGeneralError("");
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGeneralError("");

    const errors = validateSignIn({ email, password });
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    const result = signIn(email, password);
    setIsSubmitting(false);

    if (result.success) {
      closeAuthModal();
    } else {
      setGeneralError(result.error ?? "Sign in failed");
    }
  }

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGeneralError("");

    const errors = validateSignUp({ email, password, confirmPassword, name });
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    const result = signUp(email, password, confirmPassword, name || undefined);
    setIsSubmitting(false);

    if (result.success) {
      closeAuthModal();
    } else {
      setGeneralError(result.error ?? "Sign up failed");
    }
  }

  if (!isAuthModalOpen) return null;

  const isSignIn = authModalTab === "signin";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={closeAuthModal}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-otaku-violet/20 bg-otaku-grey p-6 shadow-2xl shadow-black/50 sm:p-8"
      >
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-otaku-black hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-otaku-violet/20">
            {isSignIn ? (
              <LogIn className="h-7 w-7 text-otaku-violet" />
            ) : (
              <UserPlus className="h-7 w-7 text-otaku-violet" />
            )}
          </div>
          <h2 id="auth-modal-title" className="text-2xl font-bold text-white">
            {isSignIn ? "Welcome back" : "Create account"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isSignIn
              ? "Sign in to manage your watchlist"
              : "Join OtakuStream and save your favorites"}
          </p>
        </div>

        <div
          className="mb-6 flex rounded-lg border border-otaku-violet/20 bg-otaku-black p-1"
          role="tablist"
          aria-label="Authentication mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={isSignIn}
            onClick={() => switchTab("signin")}
            className={`flex-1 rounded-md py-2.5 text-sm font-medium transition-colors ${
              isSignIn
                ? "bg-otaku-violet text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isSignIn}
            onClick={() => switchTab("signup")}
            className={`flex-1 rounded-md py-2.5 text-sm font-medium transition-colors ${
              !isSignIn
                ? "bg-otaku-violet text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {generalError && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {generalError}
          </div>
        )}

        {isSignIn ? (
          <form onSubmit={handleSignIn} className="space-y-4" noValidate>
            <div>
              <label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "auth-email-error" : undefined}
                className="w-full rounded-lg border border-otaku-violet/20 bg-otaku-black px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-otaku-violet/50 focus:outline-none"
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p id="auth-email-error" className="mt-1.5 text-xs text-red-400" role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="auth-password" className="mb-1.5 block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? "auth-password-error" : undefined}
                className="w-full rounded-lg border border-otaku-violet/20 bg-otaku-black px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-otaku-violet/50 focus:outline-none"
                placeholder="••••••••"
              />
              {fieldErrors.password && (
                <p id="auth-password-error" className="mt-1.5 text-xs text-red-400" role="alert">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-otaku-violet py-3 text-sm font-semibold text-white transition-colors hover:bg-otaku-violet-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4" noValidate>
            <div>
              <label htmlFor="auth-name" className="mb-1.5 block text-sm font-medium text-gray-300">
                Display name{" "}
                <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-otaku-violet/20 bg-otaku-black px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-otaku-violet/50 focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="auth-signup-email" className="mb-1.5 block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="auth-signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "auth-signup-email-error" : undefined}
                className="w-full rounded-lg border border-otaku-violet/20 bg-otaku-black px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-otaku-violet/50 focus:outline-none"
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p id="auth-signup-email-error" className="mt-1.5 text-xs text-red-400" role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="auth-signup-password" className="mb-1.5 block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="auth-signup-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? "auth-signup-password-error" : undefined}
                className="w-full rounded-lg border border-otaku-violet/20 bg-otaku-black px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-otaku-violet/50 focus:outline-none"
                placeholder="••••••••"
              />
              {fieldErrors.password && (
                <p id="auth-signup-password-error" className="mt-1.5 text-xs text-red-400" role="alert">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="auth-confirm-password" className="mb-1.5 block text-sm font-medium text-gray-300">
                Confirm password
              </label>
              <input
                id="auth-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={!!fieldErrors.confirmPassword}
                aria-describedby={fieldErrors.confirmPassword ? "auth-confirm-password-error" : undefined}
                className="w-full rounded-lg border border-otaku-violet/20 bg-otaku-black px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-otaku-violet/50 focus:outline-none"
                placeholder="••••••••"
              />
              {fieldErrors.confirmPassword && (
                <p id="auth-confirm-password-error" className="mt-1.5 text-xs text-red-400" role="alert">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-otaku-violet py-3 text-sm font-semibold text-white transition-colors hover:bg-otaku-violet-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
