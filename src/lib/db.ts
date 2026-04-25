import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

declare global {
  // eslint-disable-next-line no-var
  var sqliteDb: DatabaseSync | undefined;
}

function getDatabasePath() {
  const configuredPath = process.env.DATABASE_PATH?.trim();

  if (!configuredPath) {
    return path.join(process.cwd(), ".data", "taskflow.db");
  }

  return path.isAbsolute(configuredPath) ? configuredPath : path.join(process.cwd(), configuredPath);
}

function initializeDatabase(database: DatabaseSync) {
  database.exec("PRAGMA foreign_keys = ON;");
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL CHECK (status IN ('todo', 'in-progress', 'done')),
      priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
      due_date TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_tasks_user_created_at ON tasks(user_id, created_at DESC);
  `);
}

export async function connectToDatabase() {
  if (!global.sqliteDb) {
    const databasePath = getDatabasePath();
    mkdirSync(path.dirname(databasePath), { recursive: true });
    global.sqliteDb = new DatabaseSync(databasePath);
    initializeDatabase(global.sqliteDb);
  }

  return global.sqliteDb;
}
