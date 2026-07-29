"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MultiImageUploader, { ImageItem } from "./MultiImageUploader";

type ShopPlace = {
  id?: string; name: string; category: string; address: string; city: string;
  itemsAvailable: string[]; priceRange: string; openingHours: string; description: string;
  order: number; published: boolean; images: ImageItem[];
};

const CATEGORIES = ["coffee", "leather", "textile", "market", "other"];

export default function ShopPlaceForm({ initial }: { initial?: any }) {
  const router = useRouter();
  const [form, setForm] = useState<ShopPlace>(
    initial
      ? { ...initial, itemsAvailable: initial.itemsAvailable || [], images: initial.images || [] }
      : { name: "", category: "coffee", address: "", city: "Addis Ababa", itemsAvailable: [], priceRange: "$$", openingHours: "", description: "", order: 0, published: true, images: [] }
  );
  const [itemsText, setItemsText] = useState((form.itemsAvailable || []).join(", "));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = !!initial?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...form, itemsAvailable: itemsText.split(",").map((i) => i.trim()).filter(Boolean) };
    const url = isEdit ? `/api/shop-places/${initial.id}` : "/api/shop-places";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push("/admin/shop-places");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="field"><label>Place name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Tomoca Coffee - Piassa" /></div>
      <div className="field-row">
        <div className="field">
          <label>Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field"><label>Price range</label>
          <select value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })}>
            <option value="$">$ (cheap)</option><option value="$$">$$ (moderate)</option><option value="$$$">$$$ (pricier)</option>
          </select>
        </div>
      </div>
      <div className="field-row">
        <div className="field"><label>Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
        <div className="field"><label>City</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
      </div>
      <div className="field"><label>Items available (comma-separated)</label><input value={itemsText} onChange={(e) => setItemsText(e.target.value)} placeholder="Roasted beans, Cold brew, Espresso" /></div>
      <div className="field"><label>Opening hours (optional)</label><input value={form.openingHours || ""} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} placeholder="8am–8pm daily" /></div>
      <div className="field"><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required style={{ minHeight: 90 }} /></div>

      <div className="field">
        <label>Photos</label>
        <MultiImageUploader images={form.images} onChange={(images) => setForm({ ...form, images })} />
      </div>

      <div className="field"><label>Sort order</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></div>
      <div className="field">
        <label><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} style={{ width: "auto", marginRight: 8 }} />Published</label>
      </div>
      {error && <p style={{ color: "var(--terracotta)", fontSize: 13.5 }}>{error}</p>}
      <button type="submit" className="submit-btn" style={{ background: "var(--basalt)", color: "var(--parchment)" }} disabled={saving}>
        {saving ? "Saving…" : isEdit ? "Save changes" : "Create place"}
      </button>
    </form>
  );
}
