import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MR Screen — Enterprise Console",
  description: "Multi-Agent Business Console for MR Screen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
