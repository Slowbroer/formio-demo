import Link from "next/link";
import { prisma } from "@/lib/prisma";
import FormSubmitsListClient from "@/components/FormSubmitsListClient";

export const dynamic = "force-dynamic";

export default async function FormSubmitsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const def = await prisma.formDefinition.findUnique({
    where: { id },
    select: { definition: true },
  });

  if (!def) {
    return (
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8">
        <div className="rounded-md border border-zinc-200 bg-white p-4">Not found.</div>
      </div>
    );
  }

  const submits = await prisma.formSubmit.findMany({
    where: { formDefinitionId: id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      submission: true,
      createdAt: true,
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Submits</h1>
        <Link
          className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
          href={`/forms/${id}`}
        >
          Back
        </Link>
      </div>

      <FormSubmitsListClient
        definition={def.definition as any}
        submits={submits.map((s) => ({
          ...s,
          createdAt: s.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}

