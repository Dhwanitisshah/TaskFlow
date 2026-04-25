import Link from "next/link";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "TaskFlow";

const workspaceCards = [
  "Secure Authentication (JWT)",
  "Smart Task Filters",
  "Personal Productivity Dashboard",
  "SQLite Powered Local Storage"
];

const stats = [
  "99.9% Reliable",
  "Fast CRUD Operations",
  "Secure by Design"
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(circle_at_top_left,_rgba(217,121,65,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(30,91,79,0.18),_transparent_26%)]" />
      <div className="absolute left-[-6rem] top-40 -z-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute right-[-4rem] top-28 -z-10 h-72 w-72 rounded-full bg-pine/10 blur-3xl" />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">{appName}</p>
            <p className="mt-1 text-sm text-slate-600">Personal task management made simple</p>
          </div>

          <div className="flex gap-3">
            <Link
              className="rounded-full border border-slate-200/80 bg-white/75 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              href="/signup"
            >
              Get Started
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-14 py-10 lg:grid-cols-[1.05fr,0.95fr] lg:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent shadow-sm backdrop-blur">
              <span>✨</span>
              <span>Personal Productivity Platform</span>
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.02] text-ink md:text-6xl lg:text-7xl">
              Stay organized. Get things done. Without the chaos.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Manage tasks, track priorities, and stay productive with a secure workspace built for focused
              personal work.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                className="rounded-2xl bg-ink px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                href="/signup"
              >
                Get Started Free
              </Link>
              <Link
                className="rounded-2xl border border-slate-200/90 bg-white/85 px-6 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
                href="#workspace-preview"
              >
                View Dashboard Demo
              </Link>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  className="rounded-2xl border border-white/80 bg-white/72 px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur"
                  key={stat}
                >
                  {stat}
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative rounded-[2rem] border border-white/80 bg-white/82 p-6 shadow-card backdrop-blur md:p-8"
            id="workspace-preview"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Focused workspace</p>
                <h2 className="mt-2 text-2xl font-bold text-ink">A calmer way to manage daily work</h2>
              </div>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Live setup
              </div>
            </div>

            <div className="mt-8 rounded-[1.6rem] border border-slate-200 bg-slate-50/80 p-4 md:p-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </div>

              <div className="mt-5 grid gap-4">
                {workspaceCards.map((feature, index) => (
                  <div
                    className="rounded-[1.4rem] border border-white bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    key={feature}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-ink">{feature}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {index === 0
                            ? "Protected login and signup flows that keep personal workspaces secure."
                            : index === 1
                              ? "Quickly sort active work by status, keyword, and personal priority."
                              : index === 2
                                ? "Track what matters with a clean overview built for everyday planning."
                                : "Run locally with dependable storage and no external database setup."}
                        </p>
                      </div>
                      <div className="rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        0{index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-ink px-4 py-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky">Workspace</p>
                <p className="mt-2 text-2xl font-bold">Personal</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Response time</p>
                <p className="mt-2 text-2xl font-bold text-ink">Fast</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Storage mode</p>
                <p className="mt-2 text-2xl font-bold text-ink">Local SQL</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
