"use client";

import { useState } from "react";
import { Locale, t } from "@/lib/i18n";
import HotelPrice from "./HotelPrice";
import HotelMapToggle from "./HotelMapToggle";
import UpvoteButton from "./UpvoteButton";

type HotelImage = { id: string; url: string; alt: string; order: number };

type Hotel = {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  distanceFromAirportKm: number | null;
  tier: string;
  pricePerNight: number;
  currency: string;
  mealPlan: string;
  extraFoodInfo: string | null;
  amenities: string[];
  rating: number;
  website: string | null;
  note: string;
  upvotes: number;
  images: HotelImage[];
};

function PhotoLightbox({ images, startIndex, onClose }: { images: HotelImage[]; startIndex: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
      onClick={onClose}>
      {/* backdrop */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(6,5,4,0.95)", backdropFilter: "blur(8px)" }} />

      {/* counter */}
      <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 2, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "0.14em", color: "rgba(205,191,160,0.5)" }}>
        {idx + 1} / {images.length}
      </div>

      {/* close */}
      <button onClick={onClose} style={{ position: "fixed", top: 16, right: 20, zIndex: 10, width: 36, height: 36, background: "rgba(237,227,206,0.07)", border: "1px solid rgba(237,227,206,0.12)", borderRadius: "50%", color: "rgba(237,227,206,0.8)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      {/* image + arrows */}
      <div style={{ position: "relative", zIndex: 5, display: "flex", alignItems: "center", gap: 16, maxWidth: "90vw" }} onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && (
          <button onClick={prev} style={{ flexShrink: 0, width: 40, height: 40, background: "rgba(237,227,206,0.07)", border: "1px solid rgba(237,227,206,0.1)", borderRadius: "50%", color: "rgba(237,227,206,0.7)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        )}
        <img src={images[idx].url} alt={images[idx].alt || "Hotel photo"} style={{ maxWidth: "80vw", maxHeight: "78vh", objectFit: "contain", borderRadius: 4, boxShadow: "0 40px 100px -20px rgba(0,0,0,0.8)", display: "block" }} />
        {images.length > 1 && (
          <button onClick={next} style={{ flexShrink: 0, width: 40, height: 40, background: "rgba(237,227,206,0.07)", border: "1px solid rgba(237,227,206,0.1)", borderRadius: "50%", color: "rgba(237,227,206,0.7)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        )}
      </div>

      {/* thumbnail strip */}
      {images.length > 1 && (
        <div style={{ position: "relative", zIndex: 5, display: "flex", gap: 8, marginTop: 16, maxWidth: "90vw", overflowX: "auto", padding: "4px 0" }} onClick={(e) => e.stopPropagation()}>
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setIdx(i)} style={{ flexShrink: 0, width: 60, height: 44, padding: 0, border: i === idx ? "2px solid var(--ochre)" : "2px solid transparent", borderRadius: 3, overflow: "hidden", cursor: "pointer", opacity: i === idx ? 1 : 0.55, transition: "all 0.2s ease" }}>
              <img src={img.url} alt={`thumb ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HotelCard({ hotel, locale }: { hotel: Hotel; locale: Locale }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const cover = hotel.images[0];

  const tierLabel = t(locale, `hotels.tier.${hotel.tier}`);
  const mealLabel = t(locale, `hotels.mealplan.${hotel.mealPlan}`);
  const fromLabel = t(locale, "common.from");
  const nightLabel = t(locale, "common.night");

  return (
    <>
      <div className="hotel-card">
        {/* Cover image — click to open lightbox */}
        <div
          className="hotel-card-image"
          style={cover ? { backgroundImage: `url(${cover.url})`, cursor: "pointer" } : undefined}
          onClick={() => cover && setLightboxIdx(0)}
        >
          <span className={`pill pill-${hotel.tier}`}>{tierLabel}</span>
          {hotel.images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(0); }}
              style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(27,23,18,0.75)", border: "none", color: "var(--parchment)", borderRadius: 3, padding: "5px 10px", fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(4px)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              {hotel.images.length} photos
            </button>
          )}
        </div>

        <div className="hotel-card-body">
          <div className="hotel-card-head" style={{ alignItems: "flex-start", marginBottom: 8 }}>
            <h4 style={{ margin: 0 }}>{hotel.name}</h4>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {hotel.rating > 0 && <span className="hotel-rating">★ {hotel.rating.toFixed(1)}</span>}
              <UpvoteButton type="hotel" id={hotel.id} initialCount={hotel.upvotes} />
            </div>
          </div>

          <p className="hotel-address">{hotel.address}, {hotel.city}, {hotel.country}</p>
          {hotel.distanceFromAirportKm != null && (
            <p className="hotel-distance">✈️ {hotel.distanceFromAirportKm} km from the airport</p>
          )}
          <p className="hotel-note">{hotel.note}</p>

          {hotel.amenities?.length > 0 && (
            <div className="chip-row">
              {hotel.amenities.map((a) => <span key={a} className="chip">{a}</span>)}
            </div>
          )}

          <div className="hotel-price-row">
            <div>
              <span className="hotel-price-label">{fromLabel}</span>
              <span className="hotel-price"><HotelPrice amountUSD={hotel.pricePerNight} /></span>
              <span className="hotel-price-label"> / {nightLabel}</span>
            </div>
            <span className="meal-plan-tag">{mealLabel}</span>
          </div>
          {hotel.extraFoodInfo && <p className="hotel-food-note">{hotel.extraFoodInfo}</p>}

          <div className="hotel-card-footer">
            {hotel.latitude && hotel.longitude && (
              <HotelMapToggle latitude={hotel.latitude} longitude={hotel.longitude} label={hotel.name} />
            )}
            {hotel.website && (
              <a href={hotel.website} target="_blank" rel="noreferrer" className="hotel-website-link">Visit website →</a>
            )}
          </div>
        </div>
      </div>

      {/* Photo lightbox */}
      {lightboxIdx !== null && (
        <PhotoLightbox
          images={hotel.images}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}
