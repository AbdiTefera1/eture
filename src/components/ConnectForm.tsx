"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConnectForm() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      role: (form.elements.namedItem("role") as HTMLSelectElement).value,
      city: (form.elements.namedItem("city") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
      contact: (form.elements.namedItem("contact") as HTMLInputElement).value.trim(),
    };

    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("Posted publicly. Thank you!");
        form.reset();
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        setStatus(body.error || "Something went wrong — please try again.");
      }
    } catch {
      setStatus("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatus(""), 4000);
    }
  }

  return (
    <div className="form-card">
      <h3>Post to the board</h3>
      <p className="hint">Visible publicly to all visitors. Don&apos;t include phone numbers or sensitive details — use a contact method you&apos;re comfortable sharing.</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Name / handle</label>
          <input name="name" type="text" placeholder="e.g. Selam or Priya" required maxLength={40} />
        </div>
        <div className="field">
          <label>I am a...</label>
          <select name="role">
            <option value="guide">Local guide / host</option>
            <option value="traveler">Traveler seeking company</option>
          </select>
        </div>
        <div className="field">
          <label>City / region</label>
          <input name="city" type="text" placeholder="e.g. Addis Ababa, Lalibela" required maxLength={40} />
        </div>
        <div className="field">
          <label>Message</label>
          <textarea name="message" placeholder="What can you offer, or what are you looking for?" required maxLength={400} />
        </div>
        <div className="field">
          <label>Contact (optional)</label>
          <input name="contact" type="text" placeholder="Instagram, email, WhatsApp link..." maxLength={60} />
        </div>
        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? "Posting…" : "Post publicly"}
        </button>
        <div style={{ marginTop: 12, fontSize: 13, color: "var(--ochre)", minHeight: 16 }}>{status}</div>
      </form>
    </div>
  );
}
