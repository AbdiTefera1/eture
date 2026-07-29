import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ImageCarousel from "@/components/ImageCarousel";
import MapEmbed from "@/components/MapEmbed";
import { Locale } from "@/lib/i18n";
import { activityLabel } from "@/lib/activityTags";
import UpvoteButton from "@/components/UpvoteButton";

export const dynamic = "force-dynamic";

export default async function DestinationDetailPage({ params }: { params: { locale: Locale; slug: string } }) {
  const destination = await prisma.destination.findUnique({
    where: { slug: params.slug },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!destination || !destination.published) notFound();

  return (
    <main>
      <div className="section-inner" style={{ paddingBottom: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span className="card-tag" style={{ margin: 0 }}>{destination.tag}</span>
          <UpvoteButton type="destination" id={destination.id} initialCount={destination.upvotes} />
        </div>
        <h1 style={{ fontSize: "clamp(30px, 4vw, 46px)", marginTop: 8 }}>{destination.name}</h1>
        <p style={{ color: "#5a5142", fontSize: 16, marginTop: 8, maxWidth: 640 }}>{destination.region}</p>
        {(destination.activityTags?.length > 0 || destination.avgTempC !== null) && (
          <div className="chip-row" style={{ marginTop: 14 }}>
            {destination.avgTempC !== null && destination.avgTempC !== undefined && (
              <span className="chip">🌡 {destination.avgTempC}°C average</span>
            )}
            {destination.activityTags?.map((tag) => (
              <span key={tag} className="chip chip-shop">{activityLabel(tag)}</span>
            ))}
          </div>
        )}
      </div>

      <div className="section-inner" style={{ paddingTop: 24 }}>
        <ImageCarousel images={destination.images} alt={destination.name} />
      </div>

      <div className="section-inner dest-detail-grid">
        <div>
          <h3 style={{ marginBottom: 14 }}>About</h3>
          <p style={{ lineHeight: 1.7, color: "#443c30" }}>{destination.description}</p>

          {destination.highlights?.length > 0 && (
            <>
              <h3 style={{ margin: "28px 0 14px" }}>Highlights</h3>
              <ul className="dest-detail-highlights">
                {destination.highlights.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </>
          )}

          {destination.latitude && destination.longitude && (
            <>
              <h3 style={{ margin: "28px 0 14px" }}>Location</h3>
              <MapEmbed latitude={destination.latitude} longitude={destination.longitude} label={destination.name} height={280} />
            </>
          )}
        </div>

        <aside className="dest-detail-facts">
          {destination.avgTempC !== null && destination.avgTempC !== undefined && (
            <div className="fact"><span>Average temperature</span><strong>{destination.avgTempC}°C</strong></div>
          )}
          {destination.bestTimeToVisit && (
            <div className="fact"><span>Best time to visit</span><strong>{destination.bestTimeToVisit}</strong></div>
          )}
          {destination.duration && (
            <div className="fact"><span>Suggested duration</span><strong>{destination.duration}</strong></div>
          )}
          {destination.difficulty && (
            <div className="fact"><span>Difficulty</span><strong>{destination.difficulty}</strong></div>
          )}
          <div className="fact"><span>Region</span><strong>{destination.region}</strong></div>
        </aside>
      </div>
    </main>
  );
}
