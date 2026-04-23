# Next.js Form Builder (Form.io)

## Requirements

- Node `20.19.0` (see `.nvmrc`)

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Docker Compose (app + SQLite)

```bash
docker compose up --build
```

- App: `http://localhost:3000`
- SQLite DB file (shared volume): `/data/app.db`

To open a SQLite shell against the shared DB:

```bash
docker compose exec sqlite sqlite3 /data/app.db
```

## Form builder

This app uses [`@formio/react`](https://github.com/formio/react) as the form builder foundation.

## File upload endpoint (Form.io)

- **Route**: `POST /api/formio/upload`
- **Body**: `multipart/form-data` with a `file` field
- **Behavior**: saves to `public/uploads/` (local dev) and returns a JSON payload containing a `url`.
