# Bulgaria Tourism (React + Express + PostgreSQL)

Beginner-friendly fullstack project:
- Frontend: React (EN/BG) with a Home / Places / Contacts UI
- Backend: Express REST API (`GET /places`, `GET /places/:id`, `POST /places`)
- Database: PostgreSQL with a `places` table + seed data
- Docker: `docker-compose up --build` runs frontend + backend + database

## Local development

### 1) Database
Install and start PostgreSQL, then:
1. Create database `bulgaria_tourism`
2. Run `db/init.sql`

### 2) Backend
From `backend/`:
```powershell
npm install
node app.js
```
Backend listens on `http://localhost:5000`.

### 3) Frontend
From `frontend/`:
```powershell
npm install
npm start
```
Frontend listens on `http://localhost:3000` and calls `http://localhost:5000` by default.

## Docker (recommended)

From the repository root:
```powershell
docker-compose up --build
```

Then open:
- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:5000/health`

## API

- `GET /places` (optional query params: `?town=...&category=...`)
- `GET /places/:id`
- `POST /places` (for testing)

