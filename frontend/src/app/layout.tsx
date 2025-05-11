import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI TaskPilot",
  description: "Tell us your task. We'll fly the best AIs for you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="app-body">{children}</body>
    </html>
  );
}
