import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminShopPlacesPage() {
  const places = await prisma.shopPlace.findMany({
    orderBy: { order: "asc" },
    include: { images: { take: 1, orderBy: { order: "asc" } } },
  });
  return (
    <div>
      <div className="admin-header">
        <h2>Shopping places</h2>
        <Link href="/admin/shop-places/new" className="btn btn-primary">+ New place</Link>
      </div>
      <table className="admin-table">
        <thead><tr><th>Photo</th><th>Name</th><th>Category</th><th>City</th><th>Published</th><th></th></tr></thead>
        <tbody>
          {places.map((s) => (
            <tr key={s.id}>
              <td><div className="table-thumb" style={s.images[0] ? { backgroundImage: `url(${s.images[0].url})` } : undefined} /></td>
              <td>{s.name}</td>
              <td>{s.category}</td>
              <td>{s.city}</td>
              <td>{s.published ? "Yes" : "No"}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link className="btn-small" href={`/admin/shop-places/${s.id}`}>Edit</Link>
                <DeleteButton endpoint={`/api/shop-places/${s.id}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {places.length === 0 && <div className="empty-state">No shopping places yet.</div>}
    </div>
  );
}
