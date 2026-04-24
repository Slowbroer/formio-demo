export type FormioUploadedFile = {
  storage: "url";
  name: string;
  originalName?: string;
  size: number;
  type: string;
  url: string;
};

// Minimal FileService compatible with Form.io's File component.
// It must implement uploadFile (and optionally deleteFile/downloadFile).
export class FormioUrlFileService {
  constructor(private uploadEndpoint: string) {}

  async uploadFile(
    _storage: string,
    file: File,
    fileName: string,
    _dir?: string,
    _evt?: unknown,
    _url?: string,
    _options?: unknown,
  ): Promise<FormioUploadedFile> {
    const fd = new FormData();
    fd.append("file", file, fileName);

    const res = await fetch(this.uploadEndpoint, {
      method: "POST",
      body: fd,
    });
    const data = (await res.json().catch(() => null)) as
      | { url?: string; error?: string; data?: { url?: string } }
      | null;

    if (!res.ok) throw new Error(data?.error ?? "Upload failed");
    const url = data?.url ?? data?.data?.url;
    if (!url) throw new Error("Upload response missing url");

    return {
      storage: "url",
      name: fileName,
      originalName: fileName,
      size: file.size,
      type: file.type,
      url,
    };
  }

  // Optional hooks used by Form.io in some flows.
  // We keep delete as a no-op unless you want real deletion behavior.
  async deleteFile(_fileInfo: unknown) {
    return;
  }

  async downloadFile(fileInfo: unknown) {
    // Form.io calls downloadFile for preview/render flows.
    // Returning the fileInfo object (with a reachable `url`) is enough for URL storage.
    if (fileInfo && typeof fileInfo === "object") {
      return fileInfo as any;
    }
    if (typeof fileInfo === "string") {
      return { url: fileInfo } as any;
    }
    return null as any;
  }
}

