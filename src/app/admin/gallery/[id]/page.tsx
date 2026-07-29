import GalleryImageForm from "@/components/GalleryImageForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditGalleryImagePage({ params }: { params: { id: string } }) {
  const image = await prisma.galleryImage.findUnique({ where: { id: params.id } });
  if (!image) notFound();
  return (<div><div className="admin-header"><h2>Edit photo</h2></div><GalleryImageForm initial={image} /></div>);
}
