"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { user, isLoading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn(email, name || undefined);
    router.push("/");
  }

  if (isLoading || user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-otaku-violet/30" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12 sm:px-6">
      <div className="w-full rounded-2xl border border-otaku-violet/20 bg-otaku-grey p-8 shadow-xl shadow-black/40">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-otaku-violet/20">
            <LogIn className="h-7 w-7 text-otaku-violet" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in with any email to start building your watchlist
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-otaku-violet/20 bg-otaku-black px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-otaku-violet/50 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-300"
            >
              Display name{" "}
              <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-otaku-violet/20 bg-otaku-black px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-otaku-violet/50 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-otaku-violet py-3 text-sm font-semibold text-white transition-colors hover:bg-otaku-violet-light"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
