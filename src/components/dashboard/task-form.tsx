"use client";

import { FormEvent } from "react";
import { TaskFormValues } from "@/types";

type TaskFormProps = {
  error: string | null;
  form: TaskFormValues;
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onChange: <K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function TaskForm({
  error,
  form,
  isEditing,
  isSubmitting,
  onCancel,
  onChange,
  onSubmit
}: TaskFormProps) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-card backdrop-blur">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            {isEditing ? "Update task" : "Create task"}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink">
            {isEditing ? "Edit an existing task" : "Add a new task"}
          </h2>
        </div>
        {isEditing ? (
          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="title">
            Title
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-accent"
            id="title"
            maxLength={80}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="Prepare weekly product update"
            required
            value={form.title}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="description">
            Description
          </label>
          <textarea
            className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-accent"
            id="description"
            maxLength={250}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Add any details or notes for this task."
            value={form.description}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="status">
            Status
          </label>
          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-accent"
            id="status"
            onChange={(event) => onChange("status", event.target.value as TaskFormValues["status"])}
            value={form.status}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="priority">
            Priority
          </label>
          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-accent"
            id="priority"
            onChange={(event) => onChange("priority", event.target.value as TaskFormValues["priority"])}
            value={form.priority}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="dueDate">
            Due Date
          </label>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-accent"
            id="dueDate"
            onChange={(event) => onChange("dueDate", event.target.value)}
            type="date"
            value={form.dueDate}
          />
        </div>

        {error ? (
          <div className="md:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update Task" : "Create Task"}
          </button>
          {isEditing ? (
            <button
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={onCancel}
              type="button"
            >
              Reset Form
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
