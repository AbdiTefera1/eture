"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale, t } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import CurrencySwitcher from "./CurrencySwitcher";
import { ICONS } from "@/lib/icons";

export default function Nav({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const L = (key: string) => t(locale, key);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="site-header">
      <div className="tibeb" />
      <div className="nav-wrap">
        <Link href={`/${locale}`} className="brand" onClick={() => setIsOpen(false)}>
          <span className="am">ሰላም</span>
          <span className="en">Selam Ethiopia</span>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <div className="nav-desktop">
          <nav>
            <ul>
              <li><Link href={`/${locale}`}>{L("nav.home")}</Link></li>
              <li><Link href={`/${locale}/gallery`}>{L("nav.gallery")}</Link></li>
              <li><Link href={`/${locale}/destinations`}>{L("nav.destinations")}</Link></li>
              <li><Link href={`/${locale}/hotels`}>{L("nav.hotels")}</Link></li>
              <li><Link href={`/${locale}/shopping`}>{L("nav.shopping")}</Link></li>
              <li><Link href={`/${locale}/connect`}>{L("nav.connect")}</Link></li>
            </ul>
          </nav>
          <div className="nav-switchers">
            <LanguageSwitcher current={locale} />
            <CurrencySwitcher />
          </div>
        </div>

        {/* Hamburger — visible only on mobile */}
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile overlay — OUTSIDE nav-wrap to avoid stacking context issues */}
      <div className={`nav-mobile-overlay ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        <nav>
          <ul>
            <li><Link href={`/${locale}`}>{L("nav.home")}</Link></li>
            <li><Link href={`/${locale}/gallery`}>{L("nav.gallery")}</Link></li>
            <li><Link href={`/${locale}/destinations`}>{L("nav.destinations")}</Link></li>
            <li><Link href={`/${locale}/hotels`}>{L("nav.hotels")}</Link></li>
            <li><Link href={`/${locale}/shopping`}>{L("nav.shopping")}</Link></li>
            <li><Link href={`/${locale}/connect`}>{L("nav.connect")}</Link></li>
          </ul>
        </nav>
        <div className="nav-switchers" style={{ justifyContent: "center" }}>
          <LanguageSwitcher current={locale} />
          <CurrencySwitcher />
        </div>
      </div>
    </header>
  );
}
