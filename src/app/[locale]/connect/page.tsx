import ConnectForm from "@/components/ConnectForm";
import { prisma } from "@/lib/prisma";
import { Locale, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function ConnectPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const posts = await prisma.connectPost.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <div className="section-inner">
        <div className="section-head">
          <span className="eyebrow">Meet the community</span>
          <h2>{t(locale, "connect.title")}</h2>
          <p>{t(locale, "connect.subtitle")}</p>
        </div>
        <div className="connect-layout">
          <ConnectForm />
          <div>
            {posts.length === 0 && <div className="empty-state">No posts yet — be the first to say hello.</div>}
            {posts.map((p) => (
              <div key={p.id} className="post">
                <div className="post-head">
                  <h4>{p.name}</h4>
                  <span className={`role-tag role-${p.role}`}>{p.role === "guide" ? "Local guide/host" : "Traveler"}</span>
                </div>
                <div className="post-meta">{p.city} · {timeAgo(p.createdAt)}</div>
                <p>{p.message}</p>
                {p.contact && <p style={{ color: "var(--terracotta)", fontFamily: "IBM Plex Mono, monospace", fontSize: 12.5 }}>{p.contact}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
