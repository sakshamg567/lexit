import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { ConvexClientProvider } from "@/utility/ConvexClientProvider";
import "./globals.css";

const InstrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Lexit",
  description: "Expand your vocabulary, effortlessly.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
      { url: "/icons/apple-touch-icon-152x152.png", sizes: "152x152" },
      { url: "/icons/apple-touch-icon-167x167.png", sizes: "167x167" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lexit",
  },
  openGraph: {
    title: "Lexit",
    description: "Expand your vocabulary, effortlessly.",
    url: "https://lexit-two.vercel.app",
    siteName: "Lexit",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Lexit - Expand your vocabulary",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lexit",
    description: "Expand your vocabulary, effortlessly.",
    images: ["/banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${InstrumentSerif.variable} antialiased`}>
        <ConvexClientProvider>
          {children}
          <footer className="fixed bottom-0 left-0 right-0 text-center py-3 text-xs text-gray-500 bg-white/80 backdrop-blur-sm">
            This is Open Source •{" "}
            <a
              href="https://github.com/puang59/lexit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:underline"
            >
              View on GitHub
            </a>
          </footer>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
