import { notFound } from "next/navigation";
import { LOCALES, isValidLocale, isRTL, Locale } from "@/lib/i18n";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VisitTracker from "@/components/VisitTracker";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dir = isRTL(locale) ? "rtl" : "ltr";

  return (
    <div dir={dir} lang={locale}>
      <CurrencyProvider>
        <VisitTracker />
        <Nav locale={locale} />
        {children}
        <Footer locale={locale} />
      </CurrencyProvider>
    </div>
  );
}

