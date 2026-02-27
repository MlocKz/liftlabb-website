import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LiftLabb - Track your gains. Ditch the spreadsheet.",
  description:
    "The workout tracker built for lifters who want to get stronger.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
