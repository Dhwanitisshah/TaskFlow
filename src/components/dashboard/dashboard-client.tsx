"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import TaskForm from "@/components/dashboard/task-form";
import TaskList from "@/components/dashboard/task-list";
import { TaskFormValues, TaskItem, TaskStatus } from "@/types";

type DashboardClientProps = {
  initialTasks: TaskItem[];
  userName: string;
};

const emptyForm: TaskFormValues = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: ""
};

function getTaskValidationError(form: TaskFormValues) {
  if (form.title.trim().length < 2) {
    return "Title must be at least 2 characters.";
  }

  if (form.description.trim().length > 250) {
    return "Description must be 250 characters or less.";
  }

  return null;
}

export default function DashboardClient({ initialTasks, userName }: DashboardClientProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [form, setForm] = useState<TaskFormValues>(emptyForm);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [formError, setFormError] = useState<string | null>(null);
  const [pageMessage, setPageMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const completedCount = tasks.filter((task) => task.status === "done").length;
  const inProgressCount = tasks.filter((task) => task.status === "in-progress").length;
  const todoCount = tasks.filter((task) => task.status === "todo").length;

  function updateField<K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingTaskId(null);
    setFormError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPageMessage(null);
    const validationError = getTaskValidationError(form);

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const endpoint = editingTaskId ? `/api/tasks/${editingTaskId}` : "/api/tasks";
      const method = editingTaskId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save task.");
      }

      const savedTask = data.task as TaskItem;

      if (editingTaskId) {
        setTasks((current) => current.map((task) => (task.id === editingTaskId ? savedTask : task)));
        setPageMessage("Task updated successfully.");
      } else {
        setTasks((current) => [savedTask, ...current]);
        setPageMessage("Task created successfully.");
      }

      resetForm();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to save task.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(task: TaskItem) {
    setEditingTaskId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ""
    });
    setFormError(null);
    setPageMessage("Editing selected task.");
  }

  async function handleDelete(taskId: string) {
    const shouldDelete = window.confirm("Delete this task permanently?");

    if (!shouldDelete) {
      return;
    }

    setDeletingId(taskId);
    setPageMessage(null);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to delete task.");
      }

      setTasks((current) => current.filter((task) => task.id !== taskId));

      if (editingTaskId === taskId) {
        resetForm();
      }

      setPageMessage("Task deleted successfully.");
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Unable to delete task.";
      setPageMessage(message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-gradient-to-r from-ink via-slate-900 to-pine p-8 text-white shadow-card">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky">Dashboard</p>
            <h1 className="mt-3 text-4xl font-bold">Hello, {userName}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
              Manage your personal tasks in one place. Create, update, and track progress with a clean workflow
              built for everyday planning and focus.
            </p>
          </div>

          <button
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isLoggingOut}
            onClick={handleLogout}
            type="button"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">To Do</p>
          <p className="mt-4 text-4xl font-bold text-ink">{todoCount}</p>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">In Progress</p>
          <p className="mt-4 text-4xl font-bold text-ink">{inProgressCount}</p>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Completed</p>
          <p className="mt-4 text-4xl font-bold text-ink">{completedCount}</p>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.1fr,1.4fr]">
        <TaskForm
          error={formError}
          form={form}
          isEditing={Boolean(editingTaskId)}
          isSubmitting={isSubmitting}
          onCancel={resetForm}
          onChange={updateField}
          onSubmit={handleSubmit}
        />

        <div className="space-y-4">
          <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-card">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Filter tasks</p>
                <h2 className="mt-2 text-2xl font-bold text-ink">Search and focus</h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-accent"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by title or description"
                  value={searchTerm}
                />
                <select
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-accent"
                  onChange={(event) => setStatusFilter(event.target.value as "all" | TaskStatus)}
                  value={statusFilter}
                >
                  <option value="all">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          </section>

          {pageMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {pageMessage}
            </div>
          ) : null}

          <TaskList deletingId={deletingId} onDelete={handleDelete} onEdit={handleEdit} tasks={filteredTasks} />
        </div>
      </section>
    </div>
  );
}
