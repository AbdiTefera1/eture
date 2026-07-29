import { prisma } from "@/lib/prisma";
import { Locale, t } from "@/lib/i18n";
import HotelPrice from "@/components/HotelPrice";
import HotelMapToggle from "@/components/HotelMapToggle";
import UpvoteButton from "@/components/UpvoteButton";

export const dynamic = "force-dynamic";

export default async function HotelsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const hotels = await prisma.hotel.findMany({
    where: { published: true },
    orderBy: [{ city: "asc" }, { order: "asc" }],
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });

  const byCity = hotels.reduce<Record<string, typeof hotels>>((acc, h) => {
    acc[h.city] = acc[h.city] || [];
    acc[h.city].push(h);
    return acc;
  }, {});

  return (
    <main>
      <div className="section-inner">
        <div className="section-head">
          <span className="eyebrow">Where to stay</span>
          <h2>Recommended stays</h2>
          <p>Grouped by city. Prices are per night and shown in your selected currency (switch it in the top nav) — always verify current rates before booking.</p>
        </div>

        {Object.entries(byCity).map(([city, list]) => (
          <div key={city} className="city-block">
            <h3>{city}</h3>
            <div className="hotel-grid">
              {list.map((h) => (
                <div key={h.id} className="hotel-card">
                  <div className="hotel-card-image" style={h.images[0] ? { backgroundImage: `url(${h.images[0].url})` } : undefined}>
                    <span className={`pill pill-${h.tier}`}>{t(locale, `hotels.tier.${h.tier}`)}</span>
                  </div>
                  <div className="hotel-card-body">
                    <div className="hotel-card-head" style={{ alignItems: "flex-start", marginBottom: 8 }}>
                      <h4 style={{ margin: 0 }}>{h.name}</h4>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {h.rating > 0 && <span className="hotel-rating">★ {h.rating.toFixed(1)}</span>}
                        <UpvoteButton type="hotel" id={h.id} initialCount={h.upvotes} />
                      </div>
                    </div>
                    <p className="hotel-address">{h.address}, {h.city}, {h.country}</p>
                    {h.distanceFromAirportKm !== null && h.distanceFromAirportKm !== undefined && (
                      <p className="hotel-distance">✈️ {h.distanceFromAirportKm} km from the airport</p>
                    )}
                    <p className="hotel-note">{h.note}</p>

                    {h.amenities?.length > 0 && (
                      <div className="chip-row">
                        {h.amenities.map((a) => <span key={a} className="chip">{a}</span>)}
                      </div>
                    )}

                    <div className="hotel-price-row">
                      <div>
                        <span className="hotel-price-label">{t(locale, "common.from")}</span>
                        <span className="hotel-price"><HotelPrice amountUSD={h.pricePerNight} /></span>
                        <span className="hotel-price-label"> / {t(locale, "common.night")}</span>
                      </div>
                      <span className="meal-plan-tag">{t(locale, `hotels.mealplan.${h.mealPlan}`)}</span>
                    </div>
                    {h.extraFoodInfo && <p className="hotel-food-note">{h.extraFoodInfo}</p>}

                    <div className="hotel-card-footer">
                      {h.latitude && h.longitude && (
                        <HotelMapToggle latitude={h.latitude} longitude={h.longitude} label={h.name} />
                      )}
                      {h.website && (
                        <a href={h.website} target="_blank" rel="noreferrer" className="hotel-website-link">Visit website →</a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {hotels.length === 0 && <div className="empty-state">No hotels listed yet.</div>}

        <div className="note">Currency conversions are approximate reference values, not live exchange rates — confirm final pricing directly with the hotel.</div>
      </div>
    </main>
  );
}
