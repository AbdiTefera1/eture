"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Invisible component — fires a beacon to /api/analytics/visit
 * whenever the user navigates to a new page.
 */
export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith("/admin")) return;

    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer || null,
      }),
    }).catch(() => {/* silently ignore errors */});
  }, [pathname]);

  return null;
}
