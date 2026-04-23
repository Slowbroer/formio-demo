# Next.js Form Builder (Form.io)

## Requirements

- Node `20.19.0` (see `.nvmrc`)

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Docker Compose (app + MySQL)

```bash
docker compose up --build
```

- App: `http://localhost:3000`
- MySQL: `localhost:3306` (database `app`, user `app`, password `app`)

## DB configuration (MySQL)

- **Env var**: `DATABASE_URL` (optional)
  - If not set, the app falls back to `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
  - Defaults: `mysql://app:app@127.0.0.1:3306/app`
- **Prisma**:
  - Schema: `prisma/schema.prisma`
  - Migrations: `npx prisma migrate dev` (local) / `npx prisma migrate deploy` (Docker)

## DB migrations (Prisma)

### Create a new migration (local dev)

1. Ensure MySQL is running (recommended):

```bash
docker compose up -d mysql
```

2. Set `DATABASE_URL` (or `MYSQL_*`) and run:

```bash
npx prisma migrate dev --name your_migration_name
```

This will:
- create a new folder under `prisma/migrations/`
- apply it to your local DB
- regenerate Prisma Client

### Apply migrations (Docker / production)

Docker Compose runs migrations via the `migrate` service:

```bash
docker compose up --build
```

Or run just migrations:

```bash
docker compose run --rm migrate
```

### Reset DB (dev only, destructive)

```bash
docker compose down -v
docker compose up -d --build
```
- **API**:
  - `GET /api/form-definitions` lists definitions
  - `POST /api/form-definitions` creates a definition: `{ id?, name?, definition }`
  - `GET /api/form-definitions/:id` loads a definition
  - `PUT /api/form-definitions/:id` edits: `{ name?, definition? }`
  - `GET /api/form-definitions/:id/submits` lists submits
  - `POST /api/form-definitions/:id/submits` creates submit: `{ submission }`
  - `GET /api/forms` lists forms
  - `POST /api/forms` upserts a form: `{ id?, name?, schema }`

## Form builder

This app uses [`@formio/react`](https://github.com/formio/react) as the form builder foundation.

## File upload endpoint (Form.io)

- **Route**: `POST /api/formio/upload`
- **Body**: `multipart/form-data` with a `file` field
- **Behavior**: saves to `public/uploads/` (local dev) and returns a JSON payload containing a `url`.
