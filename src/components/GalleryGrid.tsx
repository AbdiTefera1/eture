"use client";

import { useState, useEffect, useCallback } from "react";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import UpvoteButton from "./UpvoteButton";

type GImage = {
  id: string;
  name: string;
  caption: string;
  imageUrl: string;
  category: string;
  tall: boolean;
  upvotes: number;
};

function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // If the URL is already absolute (external site), share it directly.
    // If it's a local path (e.g. /uploads/photo.jpg), prepend the site origin.
    const fullUrl = url.startsWith("http://") || url.startsWith("https://")
      ? url
      : window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button 
      type="button" 
      onClick={handleShare} 
      style={{ 
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        color: "var(--parchment)",
        cursor: "pointer",
        padding: "4px 8px",
        borderRadius: "4px",
        opacity: 0.8,
        transition: "opacity 0.2s",
        fontSize: "12px",
        fontFamily: "'IBM Plex Mono', monospace",
        gap: 6
      }} 
      title="Copy Image Link"
    >
      {copied ? "Copied!" : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      )}
    </button>
  );
}

export default function GalleryGrid({ images }: { images: GImage[] }) {
  const categories = ["all", ...GALLERY_CATEGORIES];

  const [filter, setFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    filter === "all" ? images : images.filter((i) => i.category === filter);

  const close = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length)),
    [filtered.length]
  );
  const prev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, close, next, prev]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  return (
    <div className="gallery-root">
      {/* ── Filters ─────────────────────────────── */}
      {categories.length > 2 && (
        <div className="gf-bar">
          {categories.map((c) => (
            <button
              key={c}
              className={`gf-pill${filter === c ? " gf-pill--active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* ── Bento grid ─────────────────────────── */}
      <div className="g-bento">
        {filtered.map((g, i) => (
          <div
            key={g.id}
            className={`g-cell${g.tall ? " g-cell--tall" : ""}`}
            onClick={() => setLightboxIndex(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setLightboxIndex(i)}
            aria-label={`View: ${g.name}`}
          >
            <span
              className="g-cell-img"
              style={{ backgroundImage: `url(${g.imageUrl})` }}
            />
            <span className="g-cell-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", gap: 12 }}>
              <span className="g-cell-name" style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShareButton url={g.imageUrl} />
                <UpvoteButton type="gallery" id={g.id} initialCount={g.upvotes} style={{ color: "var(--parchment)" }} />
              </div>
            </span>
          </div>
        ))}
      </div>

      {/* ── Lightbox ────────────────────────────── */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (() => {
        const img = filtered[lightboxIndex];
        return (
          <div className="lb" role="dialog" aria-modal="true" aria-label="Photo viewer">
            <div className="lb-bg" onClick={close} />

            {/* Counter */}
            <span className="lb-counter">{lightboxIndex + 1} / {filtered.length}</span>

            {/* Close */}
            <button className="lb-close" onClick={close} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Image */}
            <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
              {/* Prev */}
              <button className="lb-arrow lb-arrow--prev" onClick={prev} aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M11 3L5 9l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <img className="lb-img" src={img.imageUrl} alt={img.name} />

              {/* Next */}
              <button className="lb-arrow lb-arrow--next" onClick={next} aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M7 3l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Caption */}
            <div className="lb-caption" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, width: "100%" }}>
                <div>
                  <strong className="lb-caption-name">{img.name || "Untitled"}</strong>
                  {img.caption && <span className="lb-caption-text">{img.caption}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ShareButton url={img.imageUrl} />
                  <UpvoteButton type="gallery" id={img.id} initialCount={img.upvotes} style={{ color: "var(--parchment)" }} />
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
