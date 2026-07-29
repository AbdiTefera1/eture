"use client";

import { useState } from "react";

export default function ImageCarousel({ images, alt }: { images: { url: string; alt: string }[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return <div className="carousel-empty">No photos yet for this destination.</div>;
  }

  return (
    <div className="carousel">
      <div className="carousel-main" style={{ backgroundImage: `url(${images[active].url})` }} aria-label={images[active].alt || alt} />
      {images.length > 1 && (
        <div className="carousel-thumbs">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              className={`carousel-thumb ${i === active ? "active" : ""}`}
              style={{ backgroundImage: `url(${img.url})` }}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
