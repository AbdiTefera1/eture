// ---------------------------------------------------------------------------
// Storage adapter. This is the ONLY file you need to change to move image
// storage from local disk to a real object store (S3, Cloudinary, Vercel Blob,
// etc.) before going to production with more than one server instance —
// local disk storage doesn't survive redeploys or scale across instances.
// ---------------------------------------------------------------------------
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export class UploadError extends Error {}

export async function saveUploadedFile(file: File): Promise<{ url: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new UploadError(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("File is larger than the 8MB limit.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  // --- Swap point for cloud storage ---
  // return { url: await uploadToS3(buffer, filename) };
  return { url: `/uploads/${filename}` };
}
