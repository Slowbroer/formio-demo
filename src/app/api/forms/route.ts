import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const forms = await prisma.form.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      schema: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ forms });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { id?: string; name?: string; schema?: unknown }
    | null;

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = typeof body.name === "string" && body.name.trim() ? body.name : "Untitled";
  const schema = body.schema ?? {};
  const id = typeof body.id === "string" && body.id.trim() ? body.id : randomUUID();

  await prisma.form.upsert({
    where: { id },
    create: { id, name, schema: schema as any },
    update: { name, schema: schema as any },
  });

  return NextResponse.json({ id, name });
}

