import Link from "next/link";
import AuthForm from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[1fr,0.95fr] lg:items-center">
        <section className="hidden lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">TaskFlow</p>
          <h1 className="mt-5 max-w-xl text-5xl font-bold leading-tight text-ink">Log in to manage your tasks with a clean, reliable workflow.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Pick up where you left off and keep your work organized in one focused dashboard.
          </p>
          <Link className="mt-8 inline-flex text-sm font-semibold text-accent hover:text-accentDark" href="/">
            Back to home
          </Link>
        </section>

        <AuthForm mode="login" />
      </div>
    </main>
  );
}
