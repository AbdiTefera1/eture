"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GALLERY_CATEGORIES } from "@/lib/constants";

export default function BulkGalleryUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    let done = 0;
    for (const file of Array.from(files)) {
      setProgress(`Uploading ${done + 1} of ${files.length}…`);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) continue;
        const { url } = await uploadRes.json();
        await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name.replace(/\.[^.]+$/, ""),
            caption: "",
            imageUrl: url,
            category: GALLERY_CATEGORIES[0],
            tall: false,
            order: 0,
          }),
        });
      } catch {
        // continue with remaining files
      }
      done += 1;
    }
    setProgress("");
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="uploader" style={{ marginBottom: 24 }}>
      <div className="uploader-dropzone" onClick={() => inputRef.current?.click()}>
        {uploading ? progress : "Bulk add: click or drag multiple photos here — each becomes its own gallery entry"}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
      </div>
    </div>
  );
}
