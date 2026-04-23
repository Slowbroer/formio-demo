"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Form, type FormType } from "@formio/react";
import { useEffect, useMemo, useState } from "react";
import { FormioUrlFileService } from "@/lib/formioUrlFileService";

type DefinitionResponse = {
  id: string;
  name: string;
  definition: FormType;
  updatedAt: string;
};

export default function FormPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [def, setDef] = useState<DefinitionResponse | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    { state: "idle" } | { state: "submitting" } | { state: "success"; submitId: string } | { state: "error"; message: string }
  >({ state: "idle" });

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/form-definitions/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Not found");
        const data = (await res.json()) as DefinitionResponse;
        if (!cancelled) setDef(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const formDefinition = useMemo<FormType | null>(() => def?.definition ?? null, [def]);
  const fileService = useMemo(
    () => new FormioUrlFileService("/api/formio/upload"),
    [],
  );

  async function handleSubmit(submission: any) {
    setSubmitStatus({ state: "submitting" });
    try {
      const res = await fetch(`/api/form-definitions/${id}/submits`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ submission }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? "Submit failed");
      setSubmitStatus({ state: "success", submitId: data.id });
    } catch (e) {
      setSubmitStatus({
        state: "error",
        message: e instanceof Error ? e.message : "Submit failed",
      });
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 text-sm text-zinc-600">
        Loading...
      </div>
    );
  }

  if (error || !def || !formDefinition) {
    return (
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8">
        <div className="rounded-md border border-zinc-200 bg-white p-4">
          {error ?? "Not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{def.name}</h1>
          <div className="text-xs text-zinc-500">
            Updated {new Date(def.updatedAt).toLocaleString()}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
            href={`/forms/${id}/edit`}
          >
            Edit
          </Link>
          <Link
            className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
            href={`/forms/${id}/submits`}
          >
            Submits
          </Link>
        </div>
      </div>

      {submitStatus.state === "success" ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Submitted. Submission id: <span className="font-mono">{submitStatus.submitId}</span>
        </div>
      ) : null}
      {submitStatus.state === "error" ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {submitStatus.message}
        </div>
      ) : null}

      <div className="rounded-xl border border-zinc-200 bg-white p-3">
        <div className="formio">
          <Form
            src={formDefinition}
            options={{
              fileService,
            }}
            onSubmit={(submission) => handleSubmit(submission)}
          />
        </div>
      </div>
    </div>
  );
}

