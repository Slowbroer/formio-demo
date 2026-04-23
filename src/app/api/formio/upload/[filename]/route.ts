import { stat, readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getUploadsDir() {
  return (
    process.env.UPLOADS_DIR?.trim() ||
    path.join(/* turbopackIgnore: true */ process.cwd(), "uploads")
  );
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ filename: string }> },
) {
  const { filename } = await ctx.params;

  // Prevent path traversal
  const safeName = path.basename(filename);
  const filePath = path.join(getUploadsDir(), safeName);

  try {
    const info = await stat(filePath);
    const buf = await readFile(filePath);
    return new NextResponse(buf, {
      headers: {
        "content-length": String(info.size),
        "content-type": "application/octet-stream",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

