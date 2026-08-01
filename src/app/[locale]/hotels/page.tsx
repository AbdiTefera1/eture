import { prisma } from "@/lib/prisma";
import { Locale } from "@/lib/i18n";
import HotelCard from "@/components/HotelCard";

export const dynamic = "force-dynamic";

export default async function HotelsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const hotels = await prisma.hotel.findMany({
    where: { published: true },
    orderBy: [{ city: "asc" }, { order: "asc" }],
    include: { images: { orderBy: { order: "asc" } } },
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
                <HotelCard key={h.id} hotel={h as any} locale={locale} />
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
