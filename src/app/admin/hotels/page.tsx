import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminHotelsPage() {
  const hotels = await prisma.hotel.findMany({
    orderBy: [{ city: "asc" }, { order: "asc" }],
    include: { images: { take: 1, orderBy: { order: "asc" } } },
  });

  return (
    <div>
      <div className="admin-header">
        <h2>Hotels</h2>
        <Link href="/admin/hotels/new" className="btn btn-primary">+ New hotel</Link>
      </div>
      <table className="admin-table">
        <thead><tr><th>Photo</th><th>City</th><th>Name</th><th>Tier</th><th>Price/night</th><th>Published</th><th></th></tr></thead>
        <tbody>
          {hotels.map((h) => (
            <tr key={h.id}>
              <td><div className="table-thumb" style={h.images[0] ? { backgroundImage: `url(${h.images[0].url})` } : undefined} /></td>
              <td>{h.city}</td>
              <td>{h.name}</td>
              <td>{h.tier}</td>
              <td>${h.pricePerNight.toFixed(0)}</td>
              <td>{h.published ? "Yes" : "No"}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link className="btn-small" href={`/admin/hotels/${h.id}`}>Edit</Link>
                <DeleteButton endpoint={`/api/hotels/${h.id}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {hotels.length === 0 && <div className="empty-state">No hotels yet.</div>}
    </div>
  );
}
