import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FormsPage() {
  const definitions = await prisma.formDefinition.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      updatedAt: true,
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Form definitions</h1>
        <Link
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
          href="/forms/new"
        >
          New
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white">
        <ul className="divide-y divide-zinc-200">
          {definitions.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <div className="truncate font-medium">{d.name}</div>
                <div className="text-xs text-zinc-500">
                  Updated {new Date(d.updatedAt).toLocaleString()}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
                  href={`/forms/${d.id}`}
                >
                  View
                </Link>
                <Link
                  className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
                  href={`/forms/${d.id}/edit`}
                >
                  Edit
                </Link>
                <Link
                  className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
                  href={`/forms/${d.id}/submits`}
                >
                  Submits
                </Link>
              </div>
            </li>
          ))}
          {definitions.length === 0 ? (
            <li className="p-4 text-sm text-zinc-600">
              No form definitions yet. Create one.
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

