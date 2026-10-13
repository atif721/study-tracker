# Study Tracker

A full-stack app to log daily study sessions and see weekly totals per subject.

**Stack:** React, TypeScript, Tailwind CSS, Express, PostgreSQL

## Status

- Backend API: subjects and sessions (done)
- Frontend: subjects list, add, delete (done)
- Frontend: sessions UI and weekly summary (next)

## Prerequisites

- Node.js and pnpm
- PostgreSQL (I run it in Docker)

## Setup

### 1. Database

Create the user and database (replace the container name and password):

```bash
docker exec -it <postgres_container> psql -U <superuser> -d <any_db>
```

```sql
CREATE USER study_user WITH PASSWORD 'your_password';
CREATE DATABASE study_tracker OWNER study_user;
```

Create the tables:

```bash
cd backend
docker exec -i <postgres_container> psql -U study_user -d study_tracker < db/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # then put your real password in .env
pnpm install
pnpm dev               # runs on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
pnpm install
pnpm dev               # runs on http://localhost:5173
```

The frontend talks to `http://localhost:5000` by default. Set `VITE_API_URL` to change it.

## API

| Method | Endpoint                | Description                                                                    |
| ------ | ----------------------- | ------------------------------------------------------------------------------ |
| GET    | `/subjects`             | List subjects                                                                  |
| POST   | `/subjects`             | Create a subject `{ name }`                                                    |
| PUT    | `/subjects/:id`         | Rename a subject                                                               |
| DELETE | `/subjects/:id`         | Delete a subject (and its sessions)                                            |
| POST   | `/sessions`             | Log a session `{ subject_id, minutes, studied_on?, note? }`                    |
| GET    | `/sessions`             | List sessions (filters: `subject_id`, `from`, `to`)                            |
| GET    | `/sessions/summary`     | Minutes and session count per subject (default: this week, or `from` and `to`) |
| DELETE | `/sessions/:id`         | Delete a session                                                               |
| GET    | `/health`, `/health/db` | Server and database checks                                                     |
