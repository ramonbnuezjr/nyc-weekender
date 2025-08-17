import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NYC Chatbot - Central Park Weekend Assistant",
  description: "Your AI assistant for Central Park and NYC weekend planning. Get weather-aware suggestions and local insights powered by Google Gemini AI.",
  keywords: ["NYC", "Central Park", "weekend planning", "weather", "AI assistant", "New York City"],
  authors: [{ name: "NYC Chatbot Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
