"use client";

import { usePathname, useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, Locale } from "@/lib/i18n";

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(next: string) {
    const segments = pathname.split("/");
    segments[1] = next; // first segment after leading slash is the locale
    router.push(segments.join("/"));
  }

  return (
    <select className="mini-select" value={current} onChange={(e) => handleChange(e.target.value)} aria-label="Language">
      {LOCALES.map((l) => (
        <option key={l} value={l}>{LOCALE_LABELS[l]}</option>
      ))}
    </select>
  );
}
