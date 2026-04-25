import { TaskRecord } from "@/lib/store";
import { TaskItem } from "@/types";

export function serializeTask(task: TaskRecord): TaskItem {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString()
  };
}
