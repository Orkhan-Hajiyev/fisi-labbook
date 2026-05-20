import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FISI LabBook",
  description: "Systemintegration Labor- und Troubleshooting-Plattform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0d0f14] text-slate-200">
        <div className="flex flex-1 min-h-screen">
          <Navigation />
          <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
            <div className="flex-1 px-6 py-8 max-w-7xl w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
