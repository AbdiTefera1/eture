"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalVisits: number;
  todayVisits: number;
  last7Visits: number;
  last30Visits: number;
  topPages: { page: string; count: number }[];
  daily: { date: string; count: number }[];
};

export default function AnalyticsWidget() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/analytics/stats")
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then(setStats)
      .catch(() => setError(true));
  }, []);

  if (error) return null;
  if (!stats) {
    return (
      <div style={{ padding: "24px 0", color: "#8a7f68", fontFamily: "IBM Plex Mono, monospace", fontSize: 12 }}>
        Loading analytics…
      </div>
    );
  }

  const maxDaily = Math.max(...stats.daily.map((d) => d.count), 1);

  return (
    <div style={{ marginTop: 36 }}>
      <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, textTransform: "uppercase", color: "#8a7f68", marginBottom: 16, letterSpacing: "0.1em" }}>
        Visitor Analytics
      </div>

      {/* KPI row */}
      <div className="analytics-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Today", value: stats.todayVisits },
          { label: "Last 7 days", value: stats.last7Visits },
          { label: "Last 30 days", value: stats.last30Visits },
          { label: "All time", value: stats.totalVisits },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: "#fff", border: "1px solid rgba(42,36,29,0.08)", padding: "14px 16px" }}>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, textTransform: "uppercase", color: "#8a7f68", marginBottom: 6 }}>
              {kpi.label}
            </div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 28, fontWeight: 700, color: "var(--basalt)" }}>
              {kpi.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart — last 7 days */}
      <div style={{ background: "#fff", border: "1px solid rgba(42,36,29,0.08)", padding: "20px 20px 16px", marginBottom: 20 }}>
        <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, textTransform: "uppercase", color: "#8a7f68", marginBottom: 14 }}>
          Daily visitors (last 7 days)
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
          {stats.daily.map((d) => {
            const height = Math.max((d.count / maxDaily) * 80, 3);
            return (
              <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div
                  style={{
                    width: "100%",
                    height,
                    background: "var(--terracotta)",
                    borderRadius: "2px 2px 0 0",
                    opacity: 0.8,
                    transition: "height 0.3s ease",
                    position: "relative",
                  }}
                  title={`${d.count} visits`}
                />
                <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: "#8a7f68", whiteSpace: "nowrap" }}>
                  {d.date.slice(5)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top pages */}
      {stats.topPages.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid rgba(42,36,29,0.08)", padding: "20px" }}>
          <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, textTransform: "uppercase", color: "#8a7f68", marginBottom: 12 }}>
            Top pages
          </div>
          {stats.topPages.map((p, i) => (
            <div key={p.page} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < stats.topPages.length - 1 ? "1px solid rgba(42,36,29,0.06)" : "none" }}>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: "#443c30", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.page}
              </div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 600, color: "var(--terracotta)", marginLeft: 16, flexShrink: 0 }}>
                {p.count.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
