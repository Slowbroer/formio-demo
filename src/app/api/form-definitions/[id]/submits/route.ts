import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const submits = await prisma.formSubmit.findMany({
    where: { formDefinitionId: id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      formDefinitionId: true,
      submission: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ submits });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as { submission?: unknown } | null;

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const submission = body.submission ?? {};
  const submitId = randomUUID();

  const exists = await prisma.formDefinition.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!exists) {
    return NextResponse.json({ error: "Form definition not found" }, { status: 404 });
  }

  await prisma.formSubmit.create({
    data: {
      id: submitId,
      formDefinitionId: id,
      submission: submission as any,
    },
  });

  return NextResponse.json({ id: submitId });
}

