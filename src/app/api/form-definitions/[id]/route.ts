import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const row = await prisma.formDefinition.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      definition: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(row);
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as
    | { name?: string; definition?: unknown }
    | null;

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const existing = await prisma.formDefinition.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const name =
    typeof body.name === "string" && body.name.trim() ? body.name.trim() : undefined;
  const definition = body.definition;

  if (!name && typeof definition === "undefined") {
    return NextResponse.json(
      { error: "Provide at least one of: name, definition." },
      { status: 400 },
    );
  }

  await prisma.formDefinition.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(typeof definition !== "undefined" ? { definition: definition as any } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}

