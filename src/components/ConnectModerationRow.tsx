"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Post = { id: string; name: string; role: string; city: string; message: string; contact: string | null; approved: boolean };

export default function ConnectModerationRow({ post }: { post: Post }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggleApproved() {
    setBusy(true);
    await fetch(`/api/connect/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: !post.approved }),
    });
    router.refresh();
    setBusy(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this post permanently?")) return;
    setBusy(true);
    await fetch(`/api/connect/${post.id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
    <tr>
      <td>{post.name}</td>
      <td>{post.role === "guide" ? "Local guide/host" : "Traveler"}</td>
      <td>{post.city}</td>
      <td style={{ maxWidth: 320 }}>{post.message}</td>
      <td>{post.approved ? "Visible" : "Hidden"}</td>
      <td style={{ display: "flex", gap: 8 }}>
        <button className="btn-small" onClick={toggleApproved} disabled={busy}>
          {post.approved ? "Hide" : "Approve"}
        </button>
        <button className="btn-small btn-danger" onClick={handleDelete} disabled={busy}>Delete</button>
      </td>
    </tr>
  );
}
