import HotelForm from "@/components/HotelForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditHotelPage({ params }: { params: { id: string } }) {
  const hotel = await prisma.hotel.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!hotel) notFound();
  return (<div><div className="admin-header"><h2>Edit hotel</h2></div><HotelForm initial={hotel} /></div>);
}
