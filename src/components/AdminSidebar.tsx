"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/destinations", label: "Destinations" },
  { href: "/admin/hotels", label: "Hotels" },
  { href: "/admin/shop-places", label: "Shopping" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/connect", label: "Connect board" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="admin-sidebar">
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 18, marginBottom: 24 }}>Selam Admin</div>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
          {l.label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        style={{ marginTop: 24, background: "none", border: "1px solid rgba(237,227,206,0.3)", color: "var(--parchment)", padding: "8px 10px", fontSize: 13, width: "100%", borderRadius: 3 }}
      >
        Log out
      </button>
      <Link href="/" style={{ display: "block", marginTop: 12, fontSize: 12.5, color: "#8a7f68" }}>
        ← View public site
      </Link>
    </aside>
  );
}
