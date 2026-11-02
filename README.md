# Personal Task Manager (MERN)

A full-stack task manager built for the Codewise Infotech MERN practical assessment.

## Features

- Create, list, retrieve, update, and delete tasks.
- Filter tasks by `todo`, `in_progress`, and `done`.
- Sort by due date, priority (low → medium → high), or creation date.
- Validate task input and return clear HTTP errors.
- React loading/error states and server-synchronized updates.

## Requirements

- Node.js 18 or newer and npm
- MongoDB local server, or a MongoDB Atlas connection string

## 1. Clone and install

```bash
git clone <your-github-repository-url>
cd personal-task-manager
cd backend
npm install
cd ../frontend
npm install
```

## 2. Configure environment

In `backend`, copy `.env.example` to `.env` and set `MONGO_URI` to your local MongoDB URI or Atlas connection string. Keep `.env` private; never commit it.

In `frontend`, copy `.env.example` to `.env`. The default API URL is `http://localhost:5000`.

## 3. Run the application

Open two terminals from the project root.

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Open the Vite URL printed in the frontend terminal (normally http://localhost:5173).

## API reference

Base URL: `http://localhost:5000`

| Method | Endpoint     | Purpose                                                           |
| ------ | ------------ | ----------------------------------------------------------------- |
| POST   | `/tasks`     | Create a task                                                     |
| GET    | `/tasks`     | List tasks; optional `status`, `sortBy`, `order` query parameters |
| GET    | `/tasks/:id` | Retrieve one task                                                 |
| PUT    | `/tasks/:id` | Update one or more allowed fields                                 |
| DELETE | `/tasks/:id` | Delete a task                                                     |
| GET    | `/health`    | Server health check                                               |

Examples:

- `GET /tasks?status=todo`
- `GET /tasks?sortBy=dueDate&order=asc`
- `GET /tasks?sortBy=priority&order=desc`

Task fields: `title` (required string), `description` (optional string), `priority` (`low`, `medium`, `high`), `status` (`todo`, `in_progress`, `done`), and `dueDate` (optional date). Mongoose timestamps provide `createdAt` and `updatedAt`.

## Validation and errors

Invalid title, status, priority, date, sort options, or malformed IDs return a clear 400 response. A valid but unknown task ID returns 404. The centralized error middleware prevents stack traces from being sent to clients.

## Project structure

The backend separates database configuration, Mongoose model, controller logic, routes, and error middleware. The frontend separates reusable task components and API service calls from the main application state.
