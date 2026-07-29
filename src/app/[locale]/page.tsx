import Link from "next/link";
import { ICONS } from "@/lib/icons";
import { Locale, t } from "@/lib/i18n";

const HOME_CARDS = [
  {
    icon: "compass",
    art: "art-1",
    key: "destinations",
    href: "destinations",
    desc: "A curated list of Ethiopia's best-known destinations, from Lalibela to the Danakil Depression.",
  },
  {
    icon: "bed",
    art: "art-2",
    key: "hotels",
    href: "hotels",
    desc: "Recommended hotels by city and budget, with real prices, amenities, and photos.",
  },
  {
    icon: "market",
    art: "art-3",
    key: "shopping",
    href: "shopping",
    desc: "Where to buy coffee, leather, and handwoven cotton — the gifts people actually bring home.",
  },
];

export default function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const L = (key: string) => t(locale, key);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <div className="home-hero">
        <div className="home-hero-inner">
          <span className="home-hero-eyebrow">{L("hero.eyebrow")}</span>
          <span className="home-hero-amh">የኢትዮጵያ ውበት</span>
          <h1 className="home-hero-title">{L("hero.title")}</h1>
          <p className="home-hero-lede">{L("hero.lede")}</p>
          <div className="home-hero-cta">
            <Link className="home-btn home-btn--primary" href={`/${locale}/destinations`}>
              {L("hero.cta.destinations")}
            </Link>
            <Link className="home-btn home-btn--ghost" href={`/${locale}/connect`}>
              {L("hero.cta.connect")}
            </Link>
          </div>
        </div>
      </div>

      {/* Tibeb stripe */}
      <div className="tibeb" style={{ height: 5 }} />

      {/* ─── Cards ────────────────────────────────────────── */}
      <main>
        <div className="home-cards-section">
          <div className="home-cards-head">
            <span className="home-cards-eyebrow">Where to begin</span>
            <h2 className="home-cards-heading">Three ways in.</h2>
            <p className="home-cards-sub">
              Ethiopia rewards people who plan a little. Start with what you care about most.
            </p>
          </div>

          <div className="home-cards-grid">
            {HOME_CARDS.map((c) => (
              <Link key={c.key} href={`/${locale}/${c.href}`} className="hc">
                <div className={`hc-art ${c.art}`}>
                  <div className="hc-icon" dangerouslySetInnerHTML={{ __html: ICONS[c.icon] }} />
                </div>
                <div className="hc-body">
                  <h3 className="hc-title">{t(locale, `nav.${c.key}`)}</h3>
                  <p className="hc-desc">{c.desc}</p>
                  <span className="hc-link">Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
