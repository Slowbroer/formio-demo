import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function sanitizeFilename(name: string) {
  const base = path.basename(name);
  return base.replace(/[^\w.\-() ]+/g, "_");
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Expected multipart form field 'file'." },
      { status: 400 },
    );
  }

  const uploadsDir =
    process.env.UPLOADS_DIR?.trim() ||
    path.join(/* turbopackIgnore: true */ process.cwd(), "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name || "");
  const safeBase = sanitizeFilename(path.basename(file.name || "upload", ext));
  const filename = `${safeBase}-${crypto.randomUUID()}${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), bytes);

  // Serve via our GET route so it's always accessible (including Docker),
  // regardless of whether the app can write into `public/`.
  const relativeUrl = `/api/formio/upload/${encodeURIComponent(filename)}`;
  const absoluteUrl = new URL(relativeUrl, "http://localhost:3000").toString();

  return NextResponse.json({
    url: absoluteUrl,
    name: file.name,
    size: file.size,
  });
}

