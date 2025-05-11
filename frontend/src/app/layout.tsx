"use client";
import "./globals.css";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { ChatProvider } from "@/contexts/ChatContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>AI TaskPilot</title>
        <meta name="description" content="Tell us your task. We'll fly the best AIs for you" />
      </head>
      <body className="app-body">
        <LayoutProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </LayoutProvider>
      </body>
    </html>
  );
}
