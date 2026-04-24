import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MR Screen Enterprise Console",
  description: "Multi-Agent Business Console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased not-italic">{children}</body>
    </html>
  );
}
