"use client";

import dynamic from "next/dynamic";

const FormBuilderClient = dynamic(
  () => import("../components/FormBuilderClient"),
  { ssr: false },
);

export default function Home() {
  return <FormBuilderClient />;
}
