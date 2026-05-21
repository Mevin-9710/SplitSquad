import type { Metadata } from "next";
import { Pixelify_Sans, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pixelify",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SplitSquad — Split Expenses Without the Chaos",
    template: "%s | SplitSquad",
  },
  description: "UPI-first expense splitting for trips, roommates, and group payments. Track, verify, and settle group payments instantly. Currently in Beta.",
  keywords: ["expense splitting", "UPI payments", "group payments", "bill splitting", "roommate expenses", "trip expenses", "payment verification", "SplitSquad"],
  authors: [{ name: "SplitSquad" }],
  creator: "SplitSquad",
  publisher: "SplitSquad",
  metadataBase: new URL("https://splitsquad.qzz.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://splitsquad.qzz.io",
    title: "SplitSquad — Split Expenses Without the Chaos",
    description: "UPI-first expense splitting for trips, roommates, and group payments. Track, verify, and settle instantly.",
    siteName: "SplitSquad",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SplitSquad — Split Expenses Without the Chaos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SplitSquad — Split Expenses Without the Chaos",
    description: "UPI-first expense splitting for trips, roommates, and group payments.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.json",
  themeColor: "#f4bd31",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelify.variable} ${inter.variable} ${spaceMono.variable}`}>
      <body className="font-body bg-surface text-on-surface antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
