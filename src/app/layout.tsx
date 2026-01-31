import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barbershop Booking",
  description: "Modern online barbershop booking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold">Barbershop</Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/employees" className="hover:underline">Pegawai</Link>
              <Link href="/services" className="hover:underline">Menu Layanan</Link>
              <Link href="/booking" className="hover:underline">Booking</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="border-t mt-8">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Barbershop. All rights reserved.
          </div>
        </footer>
        <Toaster richColors />
      </body>
    </html>
  );
}
