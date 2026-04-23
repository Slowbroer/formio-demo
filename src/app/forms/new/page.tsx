"use client";

import dynamic from "next/dynamic";

const NewFormClient = dynamic(() => import("../../../components/NewFormClient"), {
  ssr: false,
});

export default function NewFormPage() {
  return <NewFormClient />;
}

