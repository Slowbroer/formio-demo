import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function ensureDatabaseUrl() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0) return;

  // Default to a local SQLite file for both local dev and Docker.
  // This can be overridden by setting DATABASE_URL explicitly.
  process.env.DATABASE_URL = "file:./dev.db";
}

ensureDatabaseUrl();

export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalThis.__prisma = prisma;

