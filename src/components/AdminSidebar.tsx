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
      <div className="sidebar-title" style={{ fontFamily: "Fraunces, serif", fontSize: 18, marginBottom: 8 }}>Selam Admin</div>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
          {l.label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        style={{ background: "none", border: "1px solid rgba(237,227,206,0.3)", color: "var(--parchment)", padding: "7px 12px", fontSize: 13, borderRadius: 3, marginTop: 4 }}
      >
        Log out
      </button>
      <Link href="/" style={{ display: "inline-block", marginTop: 4, fontSize: 12.5, color: "#8a7f68", padding: "7px 4px" }}>
        ← Site
      </Link>
    </aside>
  );
}
