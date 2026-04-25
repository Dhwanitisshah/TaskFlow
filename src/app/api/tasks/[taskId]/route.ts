import { NextRequest, NextResponse } from "next/server";
import { getApiErrorMessage, logApiError } from "@/lib/api-error";
import { getCurrentUser } from "@/lib/auth";
import { serializeTask } from "@/lib/serializers";
import { deleteTaskForUser, isValidRecordId, updateTaskForUser } from "@/lib/store";
import { formatZodError, taskSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{ taskId: string }>;
};

async function getTaskId(context: RouteContext) {
  const params = await context.params;
  return params.taskId;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const taskId = await getTaskId(context);

  if (!isValidRecordId(taskId)) {
    return NextResponse.json({ error: "Invalid task ID." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = taskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const task = await updateTaskForUser(taskId, {
      userId: user.id,
      title: parsed.data.title.trim(),
      description: parsed.data.description?.trim() ?? "",
      status: parsed.data.status,
      priority: parsed.data.priority,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    return NextResponse.json({ task: serializeTask(task) });
  } catch (error) {
    logApiError("tasks/update", error);
    return NextResponse.json(
      { error: getApiErrorMessage(error, "Unable to update task right now.") },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = await getTaskId(context);

    if (!isValidRecordId(taskId)) {
      return NextResponse.json({ error: "Invalid task ID." }, { status: 400 });
    }

    const deletedTask = await deleteTaskForUser(taskId, user.id);

    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully." });
  } catch (error) {
    logApiError("tasks/delete", error);
    return NextResponse.json(
      { error: getApiErrorMessage(error, "Unable to delete task right now.") },
      { status: 500 }
    );
  }
}
