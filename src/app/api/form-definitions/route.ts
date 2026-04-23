import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const definitions = await prisma.formDefinition.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      definition: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ definitions });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { id?: string; name?: string; definition?: unknown }
    | null;

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const id = typeof body.id === "string" && body.id.trim() ? body.id : randomUUID();
  const name =
    typeof body.name === "string" && body.name.trim() ? body.name.trim() : "Untitled";
  const definition = body.definition ?? { display: "form", components: [] };

  await prisma.formDefinition.create({
    data: { id, name, definition: definition as any },
  });

  return NextResponse.json({ id, name });
}

