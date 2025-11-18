# Cent Stage — Frontend (Next.js + Tailwind)

This is a minimal Next.js frontend for the "Cent Stage" task-manager assessment. It expects a backend API that exposes the following endpoints:

- `GET  /tasks`         — list tasks
- `POST /tasks`         — create task (body: { title, description })
- `PATCH /tasks/:id`    — update task (body: { status }) or patch fields
- `DELETE /tasks/:id`   — delete task

Environment:
- Set `NEXT_PUBLIC_API_URL` to your backend base URL (default `http://localhost:4000`).

Run locally:
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

Deploy on Vercel:
- Push to a GitHub repo and import into Vercel, or upload the project directly.
- Add an environment variable `NEXT_PUBLIC_API_URL` in Vercel dashboard pointing to your backend.

This package contains only the frontend ready to be deployed on Vercel.
