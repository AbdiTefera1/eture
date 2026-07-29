// Server component — no API key required. Uses OpenStreetMap's public embed.
export default function MapEmbed({
  latitude,
  longitude,
  label,
  zoom = 13,
  height = 220,
}: {
  latitude: number;
  longitude: number;
  label?: string;
  zoom?: number;
  height?: number;
}) {
  const delta = 0.5 / Math.pow(2, zoom - 10);
  const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className="map-embed" style={{ height }}>
      <iframe
        src={src}
        title={label ? `Map showing ${label}` : "Map"}
        loading="lazy"
        style={{ border: 0, width: "100%", height: "100%" }}
      />
      <a
        className="map-embed-link"
        href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`}
        target="_blank"
        rel="noreferrer"
      >
        Open larger map ↗
      </a>
    </div>
  );
}
