import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function ensureDatabaseUrl() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0) return;

  const host = process.env.MYSQL_HOST?.trim() || "127.0.0.1";
  const port = process.env.MYSQL_PORT?.trim() || "3306";
  const db = process.env.MYSQL_DATABASE?.trim() || "app";
  const user = process.env.MYSQL_USER?.trim() || "root";
  const password = process.env.MYSQL_PASSWORD?.trim() || "app";

  process.env.DATABASE_URL = `mysql://${encodeURIComponent(user)}:${encodeURIComponent(
    password,
  )}@${host}:${port}/${db}`;
}

ensureDatabaseUrl();

export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;

