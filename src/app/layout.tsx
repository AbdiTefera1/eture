import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://selamethiopia.com"),
  title: {
    default: "Selam Ethiopia | The Ultimate Travel & Culture Guide",
    template: "%s | Selam Ethiopia",
  },
  description:
    "Discover the beauty of Ethiopia. Explore top destinations like Lalibela and Addis Ababa, find the best hotels, shop for authentic Ethiopian coffee and textiles, and connect with locals.",
  keywords: [
    "Ethiopia",
    "Visit Ethiopia",
    "Ethiopia travel",
    "Ethiopian tourism",
    "Addis Ababa",
    "Lalibela",
    "Ethiopian coffee",
    "Ethiopian culture",
    "Travel guide Africa",
  ],
  authors: [{ name: "Selam Ethiopia Team" }],
  creator: "Selam Ethiopia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://selamethiopia.com",
    title: "Selam Ethiopia | The Ultimate Travel & Culture Guide",
    description:
      "Discover the beauty of Ethiopia. Explore top destinations, find the best hotels, shop authentic goods, and connect with locals.",
    siteName: "Selam Ethiopia",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Selam Ethiopia Landscape",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Selam Ethiopia | Explore, Stay, Shop, Connect",
    description: "The ultimate guide to visiting and experiencing Ethiopia.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
