"use client";

import dynamic from "next/dynamic";

const FormBuilderClient = dynamic(
  () => import("../components/FormBuilderClient"),
  { ssr: false },
);

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-6 px-4 py-8">
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-semibold">Welcome</div>
          <div className="text-sm text-zinc-600">
            Use the Form.io sandbox builder, or manage saved “tables” (definitions &
            submits) backed by SQLite.
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <a
              className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
              href="/"
            >
              Builder
            </a>
            <a
              className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
              href="/forms"
            >
              Form definitions
            </a>
          </div>
        </div>
      </div>

      <FormBuilderClient />
    </div>
  );
}
