import { prisma } from "@/lib/prisma";
import { Locale } from "@/lib/i18n";
import DestinationExplorer from "@/components/DestinationExplorer";

export const dynamic = "force-dynamic";

export default async function DestinationsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const destinations = await prisma.destination.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });

  return (
    <main>
      <div className="section-inner">
        <div className="section-head">
          <span className="eyebrow">Best places to visit</span>
          <h2>Destinations</h2>
          <p>From rock-hewn churches to salt flats hotter than anywhere else on Earth. Filter by what you want to do, or browse everything.</p>
        </div>
        <DestinationExplorer destinations={destinations as any} locale={locale} />
      </div>
    </main>
  );
}
