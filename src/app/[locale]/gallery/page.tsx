import { prisma } from "@/lib/prisma";
import GalleryGrid from "@/components/GalleryGrid";
import SubmitPhotoButton from "./SubmitPhotoButton";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <main>
      <div className="section-inner">
        <div className="gallery-page-head">
          <div>
            <span className="gallery-page-eyebrow">Photography</span>
            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <h1 className="gallery-page-title">Gallery</h1>
              <SubmitPhotoButton />
            </div>
          </div>
          <p className="gallery-page-desc">
            Ethiopia in photographs — from ancient churches to living markets.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="empty-state">
            No photos yet — add some from the admin dashboard.
          </div>
        ) : (
          <GalleryGrid images={images} />
        )}
      </div>
    </main>
  );
}
