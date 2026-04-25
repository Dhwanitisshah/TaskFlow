# TaskFlow

TaskFlow is a full-stack task manager built with `Next.js`, `TypeScript`, `Tailwind CSS`, `SQLite`, and `JWT` authentication. It lets users create an account, sign in securely, and manage personal tasks without needing MongoDB or Atlas.

## Tech Stack

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `SQLite` via Node's built-in `node:sqlite`
- `JWT + bcryptjs`
- `Zod`

## Features

- User registration and login
- Secure password hashing with `bcryptjs`
- JWT-based authentication with HTTP-only cookies
- Protected dashboard route
- User-specific task data
- Task creation, editing, and deletion
- Search and status filtering
- Client-side and server-side validation
- Local database storage in `.data/taskflow.db` by default

## Getting Started

### Prerequisites

- `Node.js 22.5+`
- `npm`

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

Create a `.env` file in the project root:

```env
DATABASE_PATH=.data/taskflow.db
JWT_SECRET=replace_with_a_long_random_secret
NEXT_PUBLIC_APP_NAME=TaskFlow
```

`DATABASE_PATH` is optional. If you omit it, the app will still use `.data/taskflow.db`.

### 3. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## API Routes

### Auth

- `POST /api/auth/signup` creates a new user account
- `POST /api/auth/login` authenticates a user
- `POST /api/auth/logout` clears the auth cookie
- `GET /api/auth/me` returns the current logged-in user

### Tasks

- `GET /api/tasks` returns all tasks for the logged-in user
- `POST /api/tasks` creates a task
- `PATCH /api/tasks/:taskId` updates a task
- `DELETE /api/tasks/:taskId` deletes a task

## Database Notes

- User and task data are stored in a local SQLite file.
- The database schema is created automatically on first request.
- Existing MongoDB data is not migrated automatically.

## Common Issues

### `JWT_SECRET is not defined`

Add `JWT_SECRET` to `.env`, then restart the dev server.

### SQLite warning in development

Node 22 exposes `node:sqlite` with an experimental warning. The app can still run normally.

### Login succeeds but dashboard redirects back to login

Clear browser cookies, keep the same `JWT_SECRET`, and restart the dev server.

## Scripts

- `npm run dev` start development server
- `npm run build` create production build
- `npm start` run production server
