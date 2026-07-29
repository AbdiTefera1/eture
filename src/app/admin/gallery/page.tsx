import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <div className="admin-header">
        <h2>Gallery</h2>
        <Link href="/admin/gallery/new" className="btn btn-primary">+ New photo</Link>
      </div>
      <table className="admin-table">
        <thead><tr><th>Preview</th><th>Name</th><th>Category</th><th>Caption</th><th>Published</th><th></th></tr></thead>
        <tbody>
          {images.map((g) => (
            <tr key={g.id}>
              <td><div style={{ width: 60, height: 40, backgroundImage: `url(${g.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} /></td>
              <td>{g.name}</td>
              <td>{g.category}</td>
              <td>{g.caption}</td>
              <td>{g.published ? "Yes" : "No"}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link className="btn-small" href={`/admin/gallery/${g.id}`}>Edit</Link>
                <DeleteButton endpoint={`/api/gallery/${g.id}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {images.length === 0 && <div className="empty-state">No photos yet.</div>}
    </div>
  );
}
