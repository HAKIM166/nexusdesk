import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusDesk",
  description: "Premium SaaS CRM dashboard built with Next.js and Supabase.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}