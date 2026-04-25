import { connectToDatabase } from "@/lib/db";
import { TaskPriority, TaskStatus } from "@/types";

type UserRow = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
};

type TaskRow = {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskRecord = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

type SaveTaskInput = {
  userId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
};

function mapUser(row: UserRow): UserRecord {
  return {
    id: String(row.id),
    name: row.name,
    email: row.email,
    password: row.password,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}

function mapTask(row: TaskRow): TaskRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date ? new Date(row.due_date) : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}

export function isValidRecordId(value: string) {
  return /^[1-9]\d*$/.test(value);
}

export async function findUserByEmail(email: string) {
  const database = await connectToDatabase();
  const row = database
    .prepare(
      `
        SELECT id, name, email, password, created_at, updated_at
        FROM users
        WHERE email = ?
        LIMIT 1
      `
    )
    .get(email) as UserRow | undefined;

  return row ? mapUser(row) : null;
}

export async function findUserById(id: string) {
  if (!isValidRecordId(id)) {
    return null;
  }

  const database = await connectToDatabase();
  const row = database
    .prepare(
      `
        SELECT id, name, email, password, created_at, updated_at
        FROM users
        WHERE id = ?
        LIMIT 1
      `
    )
    .get(Number(id)) as UserRow | undefined;

  return row ? mapUser(row) : null;
}

export async function createUser({ name, email, password }: CreateUserInput) {
  const database = await connectToDatabase();
  const timestamp = new Date().toISOString();
  const result = database
    .prepare(
      `
        INSERT INTO users (name, email, password, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `
    )
    .run(name, email, password, timestamp, timestamp);

  return findUserById(String(result.lastInsertRowid));
}

export async function listTasksByUserId(userId: string) {
  if (!isValidRecordId(userId)) {
    return [];
  }

  const database = await connectToDatabase();
  const rows = database
    .prepare(
      `
        SELECT id, user_id, title, description, status, priority, due_date, created_at, updated_at
        FROM tasks
        WHERE user_id = ?
        ORDER BY created_at DESC
      `
    )
    .all(Number(userId)) as TaskRow[];

  return rows.map(mapTask);
}

export async function getTaskByIdForUser(taskId: string, userId: string) {
  if (!isValidRecordId(taskId) || !isValidRecordId(userId)) {
    return null;
  }

  const database = await connectToDatabase();
  const row = database
    .prepare(
      `
        SELECT id, user_id, title, description, status, priority, due_date, created_at, updated_at
        FROM tasks
        WHERE id = ? AND user_id = ?
        LIMIT 1
      `
    )
    .get(Number(taskId), Number(userId)) as TaskRow | undefined;

  return row ? mapTask(row) : null;
}

export async function createTask({ userId, title, description, status, priority, dueDate }: SaveTaskInput) {
  if (!isValidRecordId(userId)) {
    return null;
  }

  const database = await connectToDatabase();
  const timestamp = new Date().toISOString();
  const result = database
    .prepare(
      `
        INSERT INTO tasks (user_id, title, description, status, priority, due_date, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .run(Number(userId), title, description, status, priority, dueDate?.toISOString() ?? null, timestamp, timestamp);

  return getTaskByIdForUser(String(result.lastInsertRowid), userId);
}

export async function updateTaskForUser(taskId: string, { userId, title, description, status, priority, dueDate }: SaveTaskInput) {
  if (!isValidRecordId(taskId) || !isValidRecordId(userId)) {
    return null;
  }

  const database = await connectToDatabase();
  const result = database
    .prepare(
      `
        UPDATE tasks
        SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = ?
        WHERE id = ? AND user_id = ?
      `
    )
    .run(title, description, status, priority, dueDate?.toISOString() ?? null, new Date().toISOString(), Number(taskId), Number(userId));

  if (Number(result.changes) === 0) {
    return null;
  }

  return getTaskByIdForUser(taskId, userId);
}

export async function deleteTaskForUser(taskId: string, userId: string) {
  if (!isValidRecordId(taskId) || !isValidRecordId(userId)) {
    return false;
  }

  const database = await connectToDatabase();
  const result = database
    .prepare(
      `
        DELETE FROM tasks
        WHERE id = ? AND user_id = ?
      `
    )
    .run(Number(taskId), Number(userId));

  return Number(result.changes) > 0;
}
