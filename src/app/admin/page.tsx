import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [destinations, hotels, shopping, gallery, posts, pendingPosts] = await Promise.all([
    prisma.destination.count(),
    prisma.hotel.count(),
    prisma.shopPlace.count(),
    prisma.galleryImage.count(),
    prisma.connectPost.count(),
    prisma.connectPost.count({ where: { approved: false } }),
  ]);

  const cards = [
    { label: "Destinations", count: destinations, href: "/admin/destinations" },
    { label: "Hotels", count: hotels, href: "/admin/hotels" },
    { label: "Shopping places", count: shopping, href: "/admin/shop-places" },
    { label: "Gallery photos", count: gallery, href: "/admin/gallery" },
    { label: "Connect posts", count: posts, href: "/admin/connect" },
    { label: "Pending moderation", count: pendingPosts, href: "/admin/connect" },
  ];

  return (
    <div>
      <div className="admin-header">
        <h2>Overview</h2>
      </div>
      <div className="grid grid-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card" style={{ padding: 20 }}>
            <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 12, textTransform: "uppercase", color: "#8a7f68" }}>{c.label}</div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 34, fontWeight: 700, marginTop: 8 }}>{c.count}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
