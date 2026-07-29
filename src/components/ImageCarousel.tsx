"use client";

import { useState } from "react";

export default function ImageCarousel({ images, alt }: { images: { url: string; alt: string }[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return <div className="carousel-empty">No photos yet for this destination.</div>;
  }

  return (
    <div className="carousel">
      <div className="carousel-main" style={{ position: "relative", overflow: "hidden" }}>
        <img 
          src={images[active].url} 
          alt={images[active].alt || alt} 
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
        />
      </div>
      {images.length > 1 && (
        <div className="carousel-thumbs">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              className={`carousel-thumb ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              style={{ padding: 0, border: i === active ? "2px solid var(--terracotta)" : "2px solid transparent", overflow: "hidden" }}
            >
              <img 
                src={img.url} 
                alt={`Thumbnail ${i + 1}`} 
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
