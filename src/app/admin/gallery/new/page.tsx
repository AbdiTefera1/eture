import GalleryImageForm from "@/components/GalleryImageForm";
import BulkGalleryUploader from "@/components/BulkGalleryUploader";

export default function NewGalleryImagePage() {
  return (
    <div>
      <div className="admin-header"><h2>Add photo</h2></div>
      <BulkGalleryUploader />
      <p style={{ fontSize: 13, color: "#8a7f68", margin: "-8px 0 20px" }}>— or add one photo with full details below —</p>
      <GalleryImageForm />
    </div>
  );
}
