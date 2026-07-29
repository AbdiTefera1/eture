"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ICON_KEYS } from "@/lib/icons";
import { ACTIVITY_TAGS } from "@/lib/activityTags";
import MultiImageUploader, { ImageItem } from "./MultiImageUploader";

type Destination = {
  id?: string;
  name: string; tag: string; region: string; summary: string; description: string;
  highlights: string[]; bestTimeToVisit: string; duration: string; difficulty: string;
  activityTags: string[]; avgTempC: number | null; latitude: number | null; longitude: number | null;
  icon: string; colorway: string; order: number; published: boolean;
  images: ImageItem[];
};

const COLORWAYS = ["art-1", "art-2", "art-3", "art-4"];

export default function DestinationForm({ initial }: { initial?: any }) {
  const router = useRouter();
  const [form, setForm] = useState<Destination>(
    initial
      ? { ...initial, highlights: initial.highlights || [], activityTags: initial.activityTags || [], images: initial.images || [] }
      : { name: "", tag: "", region: "", summary: "", description: "", highlights: [], bestTimeToVisit: "", duration: "", difficulty: "", activityTags: [], avgTempC: null, latitude: null, longitude: null, icon: "compass", colorway: "art-1", order: 0, published: true, images: [] }
  );
  const [highlightsText, setHighlightsText] = useState((form.highlights || []).join("\n"));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = !!initial?.id;

  function toggleActivity(key: string) {
    setForm((f) => ({
      ...f,
      activityTags: f.activityTags.includes(key) ? f.activityTags.filter((k) => k !== key) : [...f.activityTags, key],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...form, highlights: highlightsText.split("\n").map((h) => h.trim()).filter(Boolean) };
    const url = isEdit ? `/api/destinations/${initial.id}` : "/api/destinations";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push("/admin/destinations");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="field"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
      <div className="field"><label>Region</label><input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="e.g. North Ethiopia" /></div>
      <div className="field"><label>Tag (e.g. &quot;UNESCO · North&quot;)</label><input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} /></div>
      <div className="field"><label>Short summary (used in listings)</label><textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} style={{ minHeight: 60 }} /></div>
      <div className="field"><label>Full description (used on detail page)</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required style={{ minHeight: 120 }} /></div>
      <div className="field"><label>Highlights (one per line)</label><textarea value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} style={{ minHeight: 90 }} placeholder={"Rock-hewn churches\nEarly-morning light\nActive pilgrimage site"} /></div>

      <div className="field">
        <label>What can visitors do here?</label>
        <div className="tag-picker">
          {ACTIVITY_TAGS.map((t) => (
            <button
              type="button"
              key={t.key}
              className={`tag-picker-btn ${form.activityTags.includes(t.key) ? "active" : ""}`}
              onClick={() => toggleActivity(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field-row">
        <div className="field"><label>Best time to visit</label><input value={form.bestTimeToVisit || ""} onChange={(e) => setForm({ ...form, bestTimeToVisit: e.target.value })} placeholder="Oct–Mar" /></div>
        <div className="field"><label>Suggested duration</label><input value={form.duration || ""} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="2-3 days" /></div>
        <div className="field"><label>Difficulty</label><input value={form.difficulty || ""} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} placeholder="Easy / Moderate" /></div>
      </div>

      <div className="field-row">
        <div className="field"><label>Average temperature (°C)</label><input type="number" value={form.avgTempC ?? ""} onChange={(e) => setForm({ ...form, avgTempC: e.target.value === "" ? null : Number(e.target.value) })} placeholder="22" /></div>
        <div className="field"><label>Latitude (for map)</label><input type="number" step="any" value={form.latitude ?? ""} onChange={(e) => setForm({ ...form, latitude: e.target.value === "" ? null : Number(e.target.value) })} placeholder="12.0317" /></div>
        <div className="field"><label>Longitude (for map)</label><input type="number" step="any" value={form.longitude ?? ""} onChange={(e) => setForm({ ...form, longitude: e.target.value === "" ? null : Number(e.target.value) })} placeholder="39.0473" /></div>
      </div>

      <div className="field">
        <label>Photos</label>
        <MultiImageUploader images={form.images} onChange={(images) => setForm({ ...form, images })} />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Icon (used when no photo is set)</label>
          <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
            {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Card color</label>
          <select value={form.colorway} onChange={(e) => setForm({ ...form, colorway: e.target.value })}>
            {COLORWAYS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field"><label>Sort order</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></div>
      </div>

      <div className="field">
        <label><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} style={{ width: "auto", marginRight: 8 }} />Published</label>
      </div>
      {error && <p style={{ color: "var(--terracotta)", fontSize: 13.5 }}>{error}</p>}
      <button type="submit" className="submit-btn" style={{ background: "var(--basalt)", color: "var(--parchment)" }} disabled={saving}>
        {saving ? "Saving…" : isEdit ? "Save changes" : "Create destination"}
      </button>
    </form>
  );
}
