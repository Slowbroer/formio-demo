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

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name || "");
  const safeBase = sanitizeFilename(path.basename(file.name || "upload", ext));
  const filename = `${safeBase}-${crypto.randomUUID()}${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), bytes);

  // Form.io File component expects a response that includes URL information.
  // Returning both 'url' and 'data' helps cover common adapter expectations.
  const url = `/uploads/${filename}`;

  return NextResponse.json({
    url,
    data: {
      url,
      name: file.name,
      originalName: file.name,
      size: file.size,
      type: file.type,
    },
  });
}

