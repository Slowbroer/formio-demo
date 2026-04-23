"use client";

import { Form, type FormType, FormBuilder } from "@formio/react";
import { useMemo, useState } from "react";

const EMPTY_FORM: FormType = {
  display: "form",
  components: [],
};

export default function FormBuilderClient() {
  const [schema, setSchema] = useState<FormType>(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState<"build" | "preview" | "json">(
    "build",
  );

  // Keep initialForm stable to avoid builder re-instantiation.
  const initialForm = useMemo(() => EMPTY_FORM, []);

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Form Builder (Form.io)
          </h1>
          <p className="text-sm text-zinc-600">
            Build a schema, preview it, and upload files via{" "}
            <code className="rounded bg-zinc-100 px-1 py-0.5">
              /api/formio/upload
            </code>
            .
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          <TabButton
            active={activeTab === "build"}
            onClick={() => setActiveTab("build")}
          >
            Builder
          </TabButton>
          <TabButton
            active={activeTab === "preview"}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </TabButton>
          <TabButton
            active={activeTab === "json"}
            onClick={() => setActiveTab("json")}
          >
            JSON
          </TabButton>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-3">
          {activeTab === "build" ? (
            <div className="formio min-h-[70dvh]">
              <FormBuilder
                initialForm={initialForm}
                onChange={setSchema}
                options={{}}
              />
            </div>
          ) : null}

          {activeTab === "preview" ? (
            <div className="formio">
              <Form
                src={schema}
                options={{
                  fileService: "url",
                  uploadUrl: "/api/formio/upload",
                }}
              />
            </div>
          ) : null}

          {activeTab === "json" ? (
            <pre className="max-h-[70dvh] overflow-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-50">
              {JSON.stringify(schema, null, 2)}
            </pre>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-sm font-medium transition",
        active
          ? "bg-zinc-900 text-white"
          : "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

