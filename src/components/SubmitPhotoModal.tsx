"use client";

import { useState, useRef } from "react";
import { GALLERY_CATEGORIES } from "@/lib/constants";

export default function SubmitPhotoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    caption: "",
    category: GALLERY_CATEGORIES[0],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!fileInputRef.current?.files?.[0]) {
      setError("Please select a photo to upload.");
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]);
    formData.append("name", form.name);
    formData.append("caption", form.caption);
    formData.append("category", form.category);

    try {
      const res = await fetch("/api/gallery-submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Failed to submit photo.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during submission.");
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="lb" style={{ zIndex: 500 }}>
      <div className="lb-bg" onClick={onClose} style={{ backdropFilter: "blur(4px)" }} />
      <div className="modal-content" style={{ position: "relative", zIndex: 10, background: "#fff", width: "90%", maxWidth: 480, padding: 32, borderRadius: 6, color: "var(--ink)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", fontSize: 20 }}>✕</button>
        
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, margin: "0 0 8px" }}>Submit a Photo</h3>
        <p style={{ fontSize: 13, color: "#6a6050", marginBottom: 24, lineHeight: 1.5 }}>
          Share places you have visited in Ethiopia, especially if they have a great view of a known location! Submissions are reviewed before appearing publicly.
        </p>

        {success ? (
          <div style={{ padding: "24px 0", textAlign: "center" }}>
            <p style={{ color: "var(--green)", fontWeight: 500, fontSize: 16, marginBottom: 12 }}>Photo submitted successfully!</p>
            <p style={{ fontSize: 13, color: "#6a6050" }}>It will appear in the gallery once approved by a moderator.</p>
            <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 24 }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--terracotta)", marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>
                Location Name
              </label>
              <input 
                required
                placeholder="e.g. Simien Mountains National Park"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(42,36,29,0.2)", borderRadius: 2 }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--terracotta)", marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>
                Caption (Optional)
              </label>
              <input 
                placeholder="Brief context about the view or place"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(42,36,29,0.2)", borderRadius: 2 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--terracotta)", marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(42,36,29,0.2)", borderRadius: 2 }}
              >
                {GALLERY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--terracotta)", marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>
                Photo
              </label>
              <input 
                required
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(42,36,29,0.2)", borderRadius: 2, background: "#fbf8f1" }}
              />
            </div>

            {error && <p style={{ color: "var(--terracotta)", fontSize: 13, margin: 0 }}>{error}</p>}

            <button type="submit" disabled={saving} style={{ background: "var(--ochre)", color: "var(--basalt)", padding: "12px", border: "none", borderRadius: 2, fontWeight: 600, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", marginTop: 8 }}>
              {saving ? "Submitting..." : "Submit Photo"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
