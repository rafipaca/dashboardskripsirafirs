import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard GWNBR Pneumonia",
  description: "Visualisasi Model GWNBR untuk Kasus Pneumonia Balita di Pulau Jawa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
