"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MultiImageUploader, { ImageItem } from "./MultiImageUploader";

type Hotel = {
  id?: string; name: string; city: string; country: string; address: string; tier: string;
  latitude: number | null; longitude: number | null; distanceFromAirportKm: number | null;
  pricePerNight: number; currency: string; mealPlan: string; extraFoodInfo: string;
  amenities: string[]; rating: number; website: string; note: string; order: number;
  published: boolean; images: ImageItem[];
};

const MEAL_PLANS = [
  { value: "room_only", label: "Room only" },
  { value: "breakfast", label: "Breakfast included" },
  { value: "half_board", label: "Half board" },
  { value: "full_board", label: "Full board" },
];

export default function HotelForm({ initial }: { initial?: any }) {
  const router = useRouter();
  const [form, setForm] = useState<Hotel>(
    initial
      ? { ...initial, amenities: initial.amenities || [], images: initial.images || [] }
      : { name: "", city: "", country: "Ethiopia", address: "", latitude: null, longitude: null, distanceFromAirportKm: null, tier: "mid", pricePerNight: 0, currency: "USD", mealPlan: "room_only", extraFoodInfo: "", amenities: [], rating: 0, website: "", note: "", order: 0, published: true, images: [] }
  );
  const [amenitiesText, setAmenitiesText] = useState((form.amenities || []).join(", "));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = !!initial?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...form, amenities: amenitiesText.split(",").map((a) => a.trim()).filter(Boolean) };
    const url = isEdit ? `/api/hotels/${initial.id}` : "/api/hotels";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push("/admin/hotels");
      router.refresh();
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="field"><label>Hotel name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
      <div className="field-row">
        <div className="field"><label>City</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
        <div className="field"><label>Country</label><input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
      </div>
      <div className="field"><label>Street address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>

      <div className="field-row">
        <div className="field"><label>Distance from nearest airport (km)</label><input type="number" step="0.1" value={form.distanceFromAirportKm ?? ""} onChange={(e) => setForm({ ...form, distanceFromAirportKm: e.target.value === "" ? null : Number(e.target.value) })} placeholder="8.5" /></div>
        <div className="field"><label>Latitude (for map)</label><input type="number" step="any" value={form.latitude ?? ""} onChange={(e) => setForm({ ...form, latitude: e.target.value === "" ? null : Number(e.target.value) })} placeholder="9.0161" /></div>
        <div className="field"><label>Longitude (for map)</label><input type="number" step="any" value={form.longitude ?? ""} onChange={(e) => setForm({ ...form, longitude: e.target.value === "" ? null : Number(e.target.value) })} placeholder="38.7625" /></div>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Tier</label>
          <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
            <option value="budget">Budget</option><option value="mid">Mid-range</option><option value="lux">Luxury</option>
          </select>
        </div>
        <div className="field"><label>Price per night (USD)</label><input type="number" step="0.01" value={form.pricePerNight} onChange={(e) => setForm({ ...form, pricePerNight: Number(e.target.value) })} required /></div>
      </div>
      <p className="field-hint">Enter the price in USD — the public site converts it to each visitor's chosen currency automatically.</p>

      <div className="field">
        <label>Meal plan</label>
        <select value={form.mealPlan} onChange={(e) => setForm({ ...form, mealPlan: e.target.value })}>
          {MEAL_PLANS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>
      <div className="field"><label>Extra food info (optional)</label><input value={form.extraFoodInfo || ""} onChange={(e) => setForm({ ...form, extraFoodInfo: e.target.value })} placeholder="Dinner available for $8/person" /></div>
      <div className="field"><label>Amenities (comma-separated)</label><input value={amenitiesText} onChange={(e) => setAmenitiesText(e.target.value)} placeholder="Free WiFi, Pool, Airport shuttle" /></div>

      <div className="field-row">
        <div className="field"><label>Rating (0–5)</label><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></div>
        <div className="field"><label>Website (optional)</label><input value={form.website || ""} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." /></div>
        <div className="field"><label>Sort order</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></div>
      </div>

      <div className="field"><label>Note / description</label><textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={{ minHeight: 80 }} /></div>

      <div className="field">
        <label>Photos</label>
        <MultiImageUploader images={form.images} onChange={(images) => setForm({ ...form, images })} />
      </div>

      <div className="field">
        <label><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} style={{ width: "auto", marginRight: 8 }} />Published</label>
      </div>
      {error && <p style={{ color: "var(--terracotta)", fontSize: 13.5 }}>{error}</p>}
      <button type="submit" className="submit-btn" style={{ background: "var(--basalt)", color: "var(--parchment)" }} disabled={saving}>
        {saving ? "Saving…" : isEdit ? "Save changes" : "Create hotel"}
      </button>
    </form>
  );
}
