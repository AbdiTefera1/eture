"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ endpoint, label = "Delete" }: { endpoint: string; label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this item? This can't be undone.")) return;
    setBusy(true);
    await fetch(endpoint, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
    <button className="btn-small btn-danger" onClick={handleDelete} disabled={busy}>
      {busy ? "…" : label}
    </button>
  );
}
