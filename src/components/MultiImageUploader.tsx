"use client";

import { useRef, useState } from "react";

export type ImageItem = { id?: string; url: string; alt: string; order: number };

export default function MultiImageUploader({
  images,
  onChange,
}: {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadMode, setUploadMode] = useState<"upload" | "link">("upload");
  const [linkUrl, setLinkUrl] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    const uploaded: ImageItem[] = [];
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Upload failed");
        }
        const { url } = await res.json();
        uploaded.push({ url, alt: "", order: images.length + uploaded.length });
      } catch (e: any) {
        setError(e.message || "One or more uploads failed");
      }
    }
    onChange([...images, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleAddLink() {
    if (!linkUrl.trim()) return;
    onChange([...images, { url: linkUrl.trim(), alt: "", order: images.length }]);
    setLinkUrl("");
  }

  function updateAlt(index: number, alt: string) {
    const next = [...images];
    next[index] = { ...next[index], alt };
    onChange(next);
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i })));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((img, i) => ({ ...img, order: i })));
  }

  return (
    <div className="uploader">
      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 400, color: "var(--ink)", fontSize: 13 }}>
          <input
            type="radio"
            checked={uploadMode === "upload"}
            onChange={() => setUploadMode("upload")}
          />
          Upload Files
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 400, color: "var(--ink)", fontSize: 13 }}>
          <input
            type="radio"
            checked={uploadMode === "link"}
            onChange={() => setUploadMode("link")}
          />
          Add Image URL
        </label>
      </div>

      {uploadMode === "upload" ? (
        <div
          className="uploader-dropzone"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
        >
          {uploading ? "Uploading…" : "Click or drag images here (JPEG, PNG, WebP — up to 8MB each)"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLink())}
            style={{ flex: 1, padding: "10px 12px", border: "1px solid rgba(42,36,29,0.2)", borderRadius: 2 }}
          />
          <button
            type="button"
            onClick={handleAddLink}
            style={{ background: "var(--basalt)", color: "var(--parchment)", padding: "0 16px", border: "none", borderRadius: 2, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
          >
            Add
          </button>
        </div>
      )}

      {error && <p style={{ color: "var(--terracotta)", fontSize: 13, marginTop: 8 }}>{error}</p>}

      {images.length > 0 && (
        <div className="uploader-grid">
          {images.map((img, i) => (
            <div className="uploader-item" key={img.url + i}>
              <div className="uploader-thumb" style={{ backgroundImage: `url(${img.url})` }} />
              <input
                type="text"
                placeholder="Alt text (for accessibility)"
                value={img.alt}
                onChange={(e) => updateAlt(i, e.target.value)}
              />
              <div className="uploader-actions">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1}>↓</button>
                <button type="button" onClick={() => remove(i)} className="danger">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
