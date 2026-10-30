import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abztract.arhamkhnz.com"),
  openGraph: { type: "website", siteName: "Abztract" },
  twitter: { card: "summary_large_image" },
  title: "Abztract — Make a mark",
  description: "Create abstract symbols from a seed. Explore shapes, tune the details, and download SVG or PNG.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full overscroll-y-none antialiased`}>
      <body className="flex min-h-full flex-col scheme-dark bg-background font-sans text-foreground selection:bg-[#dce3ce]">
        {children}
      </body>
    </html>
  );
}
