"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ACTIVITY_TAGS } from "@/lib/activityTags";
import { t, Locale } from "@/lib/i18n";
import UpvoteButton from "./UpvoteButton";

type Dest = {
  id: string; slug: string; name: string; tag: string; summary: string; description: string;
  colorway: string; highlights: string[]; activityTags: string[]; avgTempC: number | null;
  images: { url: string }[];
  upvotes: number;
};

export default function DestinationExplorer({ destinations, locale }: { destinations: Dest[]; locale: Locale }) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active ? destinations.filter((d) => d.activityTags?.includes(active)) : destinations;

  return (
    <div>
      <div className="tag-picker" style={{ marginBottom: 30 }}>
        <button className={`tag-picker-btn ${active === null ? "active" : ""}`} onClick={() => setActive(null)}>
          All destinations
        </button>
        {ACTIVITY_TAGS.map((tag) => (
          <button
            key={tag.key}
            className={`tag-picker-btn ${active === tag.key ? "active" : ""}`}
            onClick={() => setActive(tag.key)}
          >
            {tag.label}
          </button>
        ))}
      </div>

      <div className="dest-feature-list">
        {filtered.map((d, i) => {
          const cover = d.images[0]?.url;
          return (
            <div key={d.id} style={{ position: "relative" }}>
              <Link href={`/${locale}/destinations/${d.slug}`} className={`dest-feature-row ${i % 2 === 1 ? "reverse" : ""}`}>
                <div className={`dest-feature-image ${d.colorway}`} style={cover ? { backgroundImage: `url(${cover})` } : undefined}>
                  {!cover && <span className="dest-feature-noimg">{d.name}</span>}
                  {d.avgTempC !== null && d.avgTempC !== undefined && <span className="temp-badge">{d.avgTempC}°C avg</span>}
                </div>
                <div className="dest-feature-text">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <span className="card-tag" style={{ margin: 0 }}>{d.tag}</span>
                    {/* spacer so the tag doesn't overlap the external upvote btn */}
                    <span style={{ width: 80 }} />
                  </div>
                  <h3 style={{ marginTop: 0 }}>{d.name}</h3>
                  <p>{d.summary || d.description}</p>
                  {d.highlights?.length > 0 && (
                    <ul className="dest-feature-highlights">
                      {d.highlights.slice(0, 3).map((h) => <li key={h}>{h}</li>)}
                    </ul>
                  )}
                  <span className="dest-feature-link">{t(locale, "common.readMore")} →</span>
                </div>
              </Link>
              {/* UpvoteButton lives OUTSIDE the Link so clicks don't navigate */}
              <div style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
                <UpvoteButton type="destination" id={d.id} initialCount={d.upvotes} />
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="empty-state">No destinations match that filter yet.</div>}
      </div>

    </div>
  );
}
