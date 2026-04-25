"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
};

const initialForm = {
  name: "",
  email: "",
  password: ""
};

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (isSignup && form.name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const payload = isSignup
        ? {
            name: form.name,
            email: form.email,
            password: form.password
          }
        : {
            email: form.email,
            password: form.password
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-8 shadow-card backdrop-blur">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">TaskFlow</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {isSignup
            ? "Sign up to manage your personal tasks with a clean dashboard."
            : "Log in to access your personal dashboard and task list."}
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {isSignup ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-ink" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Alex Johnson"
              required
              value={form.name}
            />
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="alex@example.com"
            required
            type="email"
            value={form.email}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Minimum 6 characters"
            required
            type="password"
            value={form.password}
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}

        <button
          className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Please wait..." : isSignup ? "Create Account" : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        {isSignup ? "Already have an account?" : "New here?"}{" "}
        <Link className="font-semibold text-accent hover:text-accentDark" href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
