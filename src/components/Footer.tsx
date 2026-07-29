import { Locale, t } from "@/lib/i18n";

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer>
      <div style={{ marginBottom: 10, fontFamily: "Fraunces, serif", fontSize: 17, color: "var(--parchment)" }}>
        Selam Ethiopia
      </div>
      {t(locale, "footer.tagline")}
      <div className="tibeb" style={{ height: 6, marginTop: 24 }} />
    </footer>
  );
}
