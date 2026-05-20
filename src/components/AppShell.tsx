"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DemoBanner from "@/components/DemoBanner";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {/* flex-col on mobile (header stacks above content), flex-row on md+ (sidebar beside content) */}
      <div className="flex flex-col md:flex-row min-h-screen">
        <Navigation />
        <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <DemoBanner />
          <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-7xl w-full mx-auto min-w-0">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </AuthProvider>
  );
}
