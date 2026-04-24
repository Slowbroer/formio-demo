"use client";

import { FormBuilder, type FormType } from "@formio/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const EMPTY_FORM: FormType = {
  display: "form",
  components: [],
};

export default function NewFormClient() {
  const router = useRouter();
  const [name, setName] = useState("Untitled");
  const [definition, setDefinition] = useState<FormType>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep initialForm stable to avoid builder re-instantiation.
  const initialForm = useMemo(() => EMPTY_FORM, []);

  async function create() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/form-definitions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          definition,
        }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? "Failed to create");
      router.push(`/forms/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">New form definition</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
            onClick={() => router.push("/forms")}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={create}
            disabled={saving}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Name</span>
        <input
          className="rounded-md border border-zinc-200 px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border border-zinc-200 bg-white p-3">
        <div className="formio min-h-[70dvh]">
          <FormBuilder initialForm={initialForm} onChange={setDefinition} options={{}} />
        </div>
      </div>
    </div>
  );
}

