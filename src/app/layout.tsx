import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE } from "./_lib/site";
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
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  applicationName: SITE.name,
  icons: {
    // Preserve the file-based SVG favicon and add a PNG alternative.
    other: [{ rel: "icon", url: "/icons/icon-128.png", sizes: "128x128", type: "image/png" }],
  },
  authors: [{ name: SITE.author, url: SITE.authorUrl }],
  alternates: { canonical: SITE.url },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
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
