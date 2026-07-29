import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { order: "asc" },
    include: { images: { take: 1, orderBy: { order: "asc" } }, _count: { select: { images: true } } },
  });

  return (
    <div>
      <div className="admin-header">
        <h2>Destinations</h2>
        <Link href="/admin/destinations/new" className="btn btn-primary">+ New destination</Link>
      </div>
      <table className="admin-table">
        <thead><tr><th>Photo</th><th>Name</th><th>Tag</th><th>Photos</th><th>Published</th><th></th></tr></thead>
        <tbody>
          {destinations.map((d) => (
            <tr key={d.id}>
              <td><div className="table-thumb" style={d.images[0] ? { backgroundImage: `url(${d.images[0].url})` } : undefined} /></td>
              <td>{d.name}</td>
              <td>{d.tag}</td>
              <td>{d._count.images}</td>
              <td>{d.published ? "Yes" : "No"}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link className="btn-small" href={`/admin/destinations/${d.id}`}>Edit</Link>
                <DeleteButton endpoint={`/api/destinations/${d.id}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {destinations.length === 0 && <div className="empty-state">No destinations yet.</div>}
    </div>
  );
}
