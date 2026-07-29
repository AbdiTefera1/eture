"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { GALLERY_CATEGORIES } from "@/lib/constants";

type GalleryImage = {
  id?: string;
  name: string;
  caption: string;
  imageUrl: string;
  category: string;
  tall: boolean;
  order: number;
  published: boolean;
};

export default function GalleryImageForm({ initial }: { initial?: GalleryImage }) {
  const router = useRouter();
  const [form, setForm] = useState<GalleryImage>(
    initial || {
      name: "",
      caption: "",
      imageUrl: "",
      category: GALLERY_CATEGORIES[0],
      tall: false,
      order: 0,
      published: true,
    }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadMode, setUploadMode] = useState<"upload" | "link">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEdit = !!initial?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    let finalImageUrl = form.imageUrl;

    // Handle file upload if in upload mode and a file is selected
    if (uploadMode === "upload" && fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errBody = await uploadRes.json().catch(() => ({}));
          throw new Error(errBody.error || "File upload failed");
        }

        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url;
      } catch (err: any) {
        setError(err.message || "Failed to upload image.");
        setSaving(false);
        return;
      }
    }

    if (!finalImageUrl) {
      setError("Please provide an image (upload a file or enter a URL).");
      setSaving(false);
      return;
    }

    const payload = { ...form, imageUrl: finalImageUrl };

    const url = isEdit ? `/api/gallery/${initial!.id}` : "/api/gallery";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/gallery");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong saving the gallery post");
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Name / Title</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div className="field">
        <label>Caption (optional)</label>
        <input
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
        />
      </div>

      <div className="field">
        <label>Category (used for filtering)</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={{ width: "100%", padding: "10px 12px", background: "#fbf8f1", border: "1px solid rgba(42,36,29,0.2)", borderRadius: 2 }}
        >
          {GALLERY_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="field" style={{ marginBottom: 24, marginTop: 12 }}>
        <label>Image Source</label>
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 400, color: "var(--ink)" }}>
            <input
              type="radio"
              checked={uploadMode === "upload"}
              onChange={() => setUploadMode("upload")}
            />
            Upload File
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 400, color: "var(--ink)" }}>
            <input
              type="radio"
              checked={uploadMode === "link"}
              onChange={() => setUploadMode("link")}
            />
            Image URL
          </label>
        </div>

        {uploadMode === "upload" ? (
          <div>
            <input type="file" ref={fileInputRef} accept="image/*" />
            {isEdit && form.imageUrl && (
              <p style={{ fontSize: 12, color: "#8a7f68", marginTop: 4 }}>
                Leave empty to keep existing image: {form.imageUrl}
              </p>
            )}
          </div>
        ) : (
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
          />
        )}
      </div>

      {form.imageUrl && uploadMode === "link" && (
        <div
          style={{
            width: "100%",
            height: 140,
            backgroundImage: `url(${form.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            marginBottom: 14,
            border: "1px solid rgba(42,36,29,0.15)",
          }}
        />
      )}

      <div className="field">
        <label>Sort order</label>
        <input
          type="number"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
        />
      </div>

      <div className="field">
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 400, color: "var(--ink)" }}>
          <input
            type="checkbox"
            checked={form.tall}
            onChange={(e) => setForm({ ...form, tall: e.target.checked })}
            style={{ width: "auto" }}
          />
          Tall tile (for masonry variety)
        </label>
      </div>

      <div className="field">
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 400, color: "var(--ink)" }}>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            style={{ width: "auto" }}
          />
          Published
        </label>
      </div>

      {error && (
        <p style={{ color: "var(--terracotta)", fontSize: 13.5, marginBottom: 16 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        className="submit-btn"
        style={{ background: "var(--basalt)", color: "var(--parchment)" }}
        disabled={saving}
      >
        {saving ? "Saving…" : isEdit ? "Save changes" : "Add photo"}
      </button>
    </form>
  );
}
