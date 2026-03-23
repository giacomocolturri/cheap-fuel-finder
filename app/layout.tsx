import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

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
    <html suppressHydrationWarning className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
