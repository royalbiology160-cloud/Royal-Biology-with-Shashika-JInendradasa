import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Royal Biology | 2027 Revision",
  description:
    "Premium Online Biology Learning Platform for Sri Lankan G.C.E. Advanced Level Students – 2027 Revision",
  keywords: ["Biology", "A/L", "Sri Lanka", "2027", "Revision", "Royal Biology"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="si">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
