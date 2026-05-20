"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DemoBanner from "@/components/DemoBanner";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <Navigation />
        <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          <DemoBanner />
          <div className="flex-1 px-6 py-8 max-w-7xl w-full mx-auto">{children}</div>
          <Footer />
        </main>
      </div>
    </AuthProvider>
  );
}
