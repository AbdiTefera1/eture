import DestinationForm from "@/components/DestinationForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditDestinationPage({ params }: { params: { id: string } }) {
  const destination = await prisma.destination.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!destination) notFound();
  return (<div><div className="admin-header"><h2>Edit destination</h2></div><DestinationForm initial={destination} /></div>);
}
