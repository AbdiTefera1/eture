import ShopPlaceForm from "@/components/ShopPlaceForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditShopPlacePage({ params }: { params: { id: string } }) {
  const place = await prisma.shopPlace.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!place) notFound();
  return (<div><div className="admin-header"><h2>Edit shopping place</h2></div><ShopPlaceForm initial={place} /></div>);
}
