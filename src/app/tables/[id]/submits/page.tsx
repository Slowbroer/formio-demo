import { redirect } from "next/navigation";

export default async function TableSubmitsRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/forms/${id}/submits`);
}
