import type { Metadata } from "next";
import { SITE_URL, pageMetadata } from "@/src/lib/site-seo";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "EOS",
  ...pageMetadata('/'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" data-scroll-behavior="smooth" className={`${inter.variable} h-full antialiased`}>
      <body className={`${inter.className} min-h-full flex flex-col`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
