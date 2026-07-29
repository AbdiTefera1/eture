"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Network or server error occurred");
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "#F6F1E5", minHeight: "100vh" }}>
      <div className="login-box">
        <h2 style={{ marginBottom: 6 }}>Selam Ethiopia — Admin</h2>
        <p style={{ fontSize: 13.5, color: "#8a7f68", marginBottom: 22 }}>Sign in to manage site content.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input name="password" type="password" required />
          </div>
          {error && <p style={{ color: "var(--terracotta)", fontSize: 13.5 }}>{error}</p>}
          <button type="submit" className="submit-btn" style={{ background: "var(--basalt)", color: "var(--parchment)" }} disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
