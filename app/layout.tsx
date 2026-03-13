import type { Metadata } from "next";
// @ts-expect-error - allow importing CSS without type declarations
import "./globals.css";
// @ts-expect-error - allow importing CSS without type declarations
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Cheap Fuel Finder",
  description: "Find the cheapest fuel station near you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
