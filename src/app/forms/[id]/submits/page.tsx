import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FormSubmitsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

      <div className="rounded-xl border border-zinc-200 bg-white">
        <ul className="divide-y divide-zinc-200">
          {submits.map((s) => (
            <li key={s.id} className="p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-sm font-medium">{s.id}</div>
                <div className="text-xs text-zinc-500">
                  {new Date(s.createdAt).toLocaleString()}
                </div>
              </div>
              <pre className="max-h-[40dvh] overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-50">
                {JSON.stringify(s.submission, null, 2)}
              </pre>
            </li>
          ))}
          {submits.length === 0 ? (
            <li className="p-4 text-sm text-zinc-600">No submits for this form yet.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

