import type { Metadata } from "next";
import { Geist, Geist_Mono, Rubik, Mulish, Fleur_De_Leah } from "next/font/google";
import { PrimeReactProvider } from "primereact/api";
import "./globals.css";

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

const fleur_de_leah = Fleur_De_Leah({
  weight: "400",
  variable: "--font-fleur-de-leah",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Snaptogether",
  description: "Create moments together",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Meta Tags */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${fleur_de_leah.variable} ${mulish.variable}  ${geistSans.variable} ${rubik.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Wrap the entire app with PrimeReactProvider */}
        <PrimeReactProvider>
          {children}
        </PrimeReactProvider>
      </body>
    </html>
  );
}
