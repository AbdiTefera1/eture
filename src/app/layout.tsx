import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Selam Ethiopia — Explore, Stay, Shop, Connect",
  description: "A guide to visiting Ethiopia: destinations, hotels, shopping, and a community connect board.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
