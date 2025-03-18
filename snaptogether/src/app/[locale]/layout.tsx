import type { Metadata } from "next";
import { Geist, Geist_Mono, Rubik, Mulish, Fleur_De_Leah, Gochi_Hand } from "next/font/google";
import { PrimeReactProvider } from "primereact/api";
import { Portal } from "@/components/Portal/Portal";
import "./globals.css";

import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

const gochi_hand = Gochi_Hand({
  weight: "400",
  variable: "--font-gochi-hand",
  subsets: ["latin"],
});

const fleur_de_leah = Fleur_De_Leah({
  weight: "400",
  variable: "--font-fleur-de-leah",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Snaptogether",
  description: "Create moments together",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>

) {

  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        {/* ✅ Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body
        className={`${gochi_hand.variable} ${fleur_de_leah.variable} ${mulish.variable} ${geistSans.variable} ${rubik.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ Wrap the entire app inside Portal to prevent SSR issues */}
        <PrimeReactProvider>
          <NextIntlClientProvider>
            <Portal>{children}</Portal>
          </NextIntlClientProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
