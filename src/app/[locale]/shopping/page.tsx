import { prisma } from "@/lib/prisma";
import { Locale } from "@/lib/i18n";
import { ICONS } from "@/lib/icons";
import UpvoteButton from "@/components/UpvoteButton";

export const dynamic = "force-dynamic";

const CATEGORY_ICON: Record<string, string> = {
  coffee: "coffee", leather: "leaf", textile: "fabric", market: "market", other: "compass",
};

export default async function ShoppingPage({ params }: { params: { locale: Locale } }) {
  const places = await prisma.shopPlace.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });

  return (
    <main>
      <div className="section-inner">
        <div className="section-head">
          <span className="eyebrow">Bring Ethiopia home</span>
          <h2>Where to shop</h2>
          <p>Coffee, leather, and handwoven cotton — organized by actual place, so you know exactly where to go and what to look for.</p>
        </div>

        <div className="shop-grid">
          {places.map((s) => (
            <div key={s.id} className="shop-card">
              <div
                className="shop-card-image"
                style={s.images[0] ? { backgroundImage: `url(${s.images[0].url})` } : undefined}
                dangerouslySetInnerHTML={!s.images[0] ? { __html: ICONS[CATEGORY_ICON[s.category] || "market"] } : undefined}
              />
              <div className="shop-card-body">
                <div className="shop-card-head" style={{ alignItems: "flex-start", marginBottom: 8 }}>
                  <h3 style={{ margin: 0 }}>{s.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="price-range">{s.priceRange}</span>
                    <UpvoteButton type="shop" id={s.id} initialCount={s.upvotes} />
                  </div>
                </div>
                <p className="shop-address">{s.address}, {s.city}</p>
                <p>{s.description}</p>

                {s.itemsAvailable?.length > 0 && (
                  <div className="chip-row">
                    {s.itemsAvailable.map((item) => <span key={item} className="chip chip-shop">{item}</span>)}
                  </div>
                )}

                {s.openingHours && <p className="shop-hours">🕒 {s.openingHours}</p>}
              </div>
            </div>
          ))}
          {places.length === 0 && <div className="empty-state">No shopping guides yet.</div>}
        </div>
      </div>
    </main>
  );
}
