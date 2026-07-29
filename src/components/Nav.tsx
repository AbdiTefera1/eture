import Link from "next/link";
import { Locale, t } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import CurrencySwitcher from "./CurrencySwitcher";

export default function Nav({ locale }: { locale: Locale }) {
  const L = (key: string) => t(locale, key);
  return (
    <header>
      <div className="tibeb" />
      <div className="nav-wrap">
        <Link href={`/${locale}`} className="brand">
          <span className="am">ሰላም</span>
          <span className="en">Selam Ethiopia</span>
        </Link>
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
    </header>
  );
}
