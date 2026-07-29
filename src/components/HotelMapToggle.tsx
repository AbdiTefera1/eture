"use client";

import { useState } from "react";
import MapEmbed from "./MapEmbed";

export default function HotelMapToggle({ latitude, longitude, label }: { latitude: number; longitude: number; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" className="map-toggle-link" onClick={() => setOpen((o) => !o)}>
        {open ? "Hide map" : "📍 View on map"}
      </button>
      {open && (
        <div style={{ marginTop: 10 }}>
          <MapEmbed latitude={latitude} longitude={longitude} label={label} height={180} zoom={14} />
        </div>
      )}
    </div>
  );
}
