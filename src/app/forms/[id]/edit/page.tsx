"use client";

import { FormBuilder, type FormType } from "@formio/react";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type DefinitionResponse = {
  id: string;
  name: string;
  definition: FormType;
};

export default function EditFormDefinitionPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [schema, setSchema] = useState<FormType>({ display: "form", components: [] });
  const [loadedInitial, setLoadedInitial] = useState<FormType | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/form-definitions/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = (await res.json()) as DefinitionResponse;
        if (cancelled) return;
        setName(data.name);
        setSchema(data.definition);
        setLoadedInitial(data.definition);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const initialForm = useMemo<FormType | undefined>(() => {
    if (!loadedInitial) return undefined;
    return loadedInitial;
  }, [loadedInitial]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/form-definitions/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, definition: schema }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Failed to save");
      }
      router.push(`/forms/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 text-sm text-zinc-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8">
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Edit form definition</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
            onClick={() => router.push(`/forms/${id}`)}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            onClick={save}
          >
            {saving ? "Saving..." : "Save"}
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

      <div className="rounded-xl border border-zinc-200 bg-white p-3">
        <div className="formio min-h-[70dvh]">
          <FormBuilder initialForm={initialForm} onChange={setSchema} options={{}} />
        </div>
      </div>
    </div>
  );
}

