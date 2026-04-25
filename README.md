# Next.js Form Builder (Form.io)

## Requirements

- Node `20.19.0` (see `.nvmrc`)

If you are using nvm, you can directly switch to this node version by running:

```bash
nvm use
```

## Run locally (recommended)

This app uses SQLite via Prisma. You don't need to run any database server.

### 1) Install deps

```bash
npm install
cp .env.example .env
```

### 2) Set DB env (optional)

By default the app will use a local SQLite file:

- `file:./prisma/dev.db`

Prisma CLI reads `DATABASE_URL` from your shell or from `.env`. This repo includes a default `.env` with:

- `DATABASE_URL="file:./prisma/dev.db"`

To use a different SQLite location, set:

- `DATABASE_URL` (example: `file:./data/dev.db`)

### 3) Run DB migrations (first time)

```bash
npx prisma migrate dev --name init
```

### 4) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## DB configuration (SQLite)

- **Env var**: `DATABASE_URL` (optional)
  - Default: `file:./dev.db`
- **Prisma**:
  - Schema: `prisma/schema.prisma`
  - Migrations: `npx prisma migrate dev` (local)

## DB migrations (Prisma)

### Create a new migration (local dev)

1. Set `DATABASE_URL` (optional) and run:

```bash
npx prisma migrate dev --name your_migration_name
```

This will:
- create a new folder under `prisma/migrations/`
- apply it to your local DB
- regenerate Prisma Client

### Reset DB (dev only, destructive)

```bash
rm -f ./prisma/dev.db
npx prisma migrate dev --name init
```
- **API**:
  - `GET /api/form-definitions` lists definitions
  - `POST /api/form-definitions` creates a definition: `{ id?, name?, definition }`
  - `GET /api/form-definitions/:id` loads a definition
  - `PUT /api/form-definitions/:id` edits: `{ name?, definition? }`
  - `GET /api/form-definitions/:id/submits` lists submits
  - `POST /api/form-definitions/:id/submits` creates submit: `{ submission }`

## Form builder

This app uses [`@formio/react`](https://github.com/formio/react) as the form builder foundation.

## File upload endpoint (Form.io)

- **Route**: `POST /api/formio/upload`
- **Body**: `multipart/form-data` with a `file` field
- **Behavior**: saves to `UPLOADS_DIR` (defaults to `./uploads/`) and returns a JSON payload containing an accessible `url`.
