import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { LOCALES } from "@/lib/i18n";

export const dynamic = "force-dynamic";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://eture.vercel.app";

  // Static routes
  const staticRoutes = ["", "/destinations", "/hotels", "/shopping", "/connect"];
  
  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    }))
  );

  // Dynamic destination routes
  const destinations = await prisma.destination.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const destinationEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    destinations.map((dest) => ({
      url: `${baseUrl}/${locale}/destinations/${dest.slug}`,
      lastModified: dest.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }))
  );

  return [...staticEntries, ...destinationEntries];
}
