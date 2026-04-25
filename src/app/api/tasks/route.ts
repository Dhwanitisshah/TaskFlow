import { NextRequest, NextResponse } from "next/server";
import { getApiErrorMessage, logApiError } from "@/lib/api-error";
import { getCurrentUser } from "@/lib/auth";
import { serializeTask } from "@/lib/serializers";
import { createTask, listTasksByUserId } from "@/lib/store";
import { formatZodError, taskSchema } from "@/lib/validators";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await listTasksByUserId(user.id);

    return NextResponse.json({ tasks: tasks.map((task) => serializeTask(task)) });
  } catch (error) {
    logApiError("tasks/get", error);
    return NextResponse.json({ error: getApiErrorMessage(error, "Unable to load tasks right now.") }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = taskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const task = await createTask({
      userId: user.id,
      title: parsed.data.title.trim(),
      description: parsed.data.description?.trim() ?? "",
      status: parsed.data.status,
      priority: parsed.data.priority,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null
    });

    if (!task) {
      throw new Error("Unable to create task record.");
    }

    return NextResponse.json({ task: serializeTask(task) }, { status: 201 });
  } catch (error) {
    logApiError("tasks/create", error);
    return NextResponse.json(
      { error: getApiErrorMessage(error, "Unable to create task right now.") },
      { status: 500 }
    );
  }
}
