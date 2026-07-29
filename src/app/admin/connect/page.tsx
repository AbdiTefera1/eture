import { prisma } from "@/lib/prisma";
import ConnectModerationRow from "@/components/ConnectModerationRow";

export const dynamic = "force-dynamic";

export default async function AdminConnectPage() {
  const posts = await prisma.connectPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="admin-header">
        <h2>Connect board moderation</h2>
      </div>
      <p style={{ fontSize: 13.5, color: "#8a7f68", marginBottom: 20, maxWidth: 600 }}>
        Anyone can submit a post from the public Connect page. Posts are visible by default —
        hide or delete anything inappropriate.
      </p>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Role</th><th>City</th><th>Message</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {posts.map((p) => <ConnectModerationRow key={p.id} post={p} />)}
        </tbody>
      </table>
      {posts.length === 0 && <div className="empty-state">No posts yet.</div>}
    </div>
  );
}
