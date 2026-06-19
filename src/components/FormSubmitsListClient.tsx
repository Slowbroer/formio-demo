"use client";

import { Form, type FormType } from "@formio/react";
import { useMemo, useState } from "react";
import { FormioUrlFileService } from "@/lib/formioUrlFileService";

type SubmitRow = {
  id: string;
  submission: unknown;
  createdAt: string;
};

export default function FormSubmitsListClient({
  definition,
  submits,
}: {
  definition: FormType;
  submits: SubmitRow[];
}) {
  const fileService = useMemo(
    () => new FormioUrlFileService("/api/formio/upload"),
    [],
  );

  const [openId, setOpenId] = useState<string | null>(submits[0]?.id ?? null);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <ul className="divide-y divide-zinc-200">
        {submits.map((s) => {
          const open = openId === s.id;
          return (
            <li key={s.id} className="p-4">
              <button
                type="button"
                className="flex w-full items-start justify-between gap-3 text-left"
                onClick={() => setOpenId(open ? null : s.id)}
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{s.id}</div>
                  <div className="text-xs text-zinc-500">
                    {new Date(s.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="shrink-0 text-xs text-zinc-500">
                  {open ? "Hide" : "Show"}
                </div>
              </button>

              {open ? (
                <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-3">
                  <div className="formio">
                    <Form
                      src={definition}
                      submission={s.submission as any}
                      options={{
                        readOnly: true,
                        renderMode: "html",
                        noAlerts: true,
                        fileService,
                      }}
                    />
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}

        {submits.length === 0 ? (
          <li className="p-4 text-sm text-zinc-600">No submits for this form yet.</li>
        ) : null}
      </ul>
    </div>
  );
}

