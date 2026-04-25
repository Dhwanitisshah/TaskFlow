"use client";

import { TaskItem } from "@/types";

type TaskListProps = {
  deletingId: string | null;
  onDelete: (taskId: string) => void;
  onEdit: (task: TaskItem) => void;
  tasks: TaskItem[];
};

function getStatusClasses(status: TaskItem["status"]) {
  if (status === "done") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "in-progress") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-slate-100 text-slate-700";
}

function getPriorityClasses(priority: TaskItem["priority"]) {
  if (priority === "high") {
    return "bg-rose-100 text-rose-700";
  }

  if (priority === "medium") {
    return "bg-sky-100 text-sky-700";
  }

  return "bg-emerald-100 text-emerald-700";
}

function formatDate(dateString: string | null) {
  if (!dateString) {
    return "No deadline";
  }

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function formatLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function TaskList({ deletingId, onDelete, onEdit, tasks }: TaskListProps) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-card backdrop-blur">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Your tasks</p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Track work with clarity</h2>
        </div>
        <div className="rounded-full bg-mist px-4 py-2 text-sm font-medium text-slate-700">{tasks.length} task(s)</div>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-600">
          No tasks found. Create your first task to populate the dashboard.
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <article
              className="rounded-3xl border border-slate-100 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
              key={task.id}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-ink">{task.title}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(task.status)}`}>
                      {formatLabel(task.status)}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(task.priority)}`}>
                      {formatLabel(task.priority)} Priority
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {task.description || "No description added for this task yet."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    <span>Due: {formatDate(task.dueDate)}</span>
                    <span>Updated: {formatDate(task.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    onClick={() => onEdit(task)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={deletingId === task.id}
                    onClick={() => onDelete(task.id)}
                    type="button"
                  >
                    {deletingId === task.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
