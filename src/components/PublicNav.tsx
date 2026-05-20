"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function PublicNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0f1117]/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#161b27] border border-white/10 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-black bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent select-none">
              FL
            </span>
          </div>
          <span className="text-sm font-bold text-white">FISI LabBook</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden sm:flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5"
          >
            Zur App
          </Link>
          <Link
            href="/registrieren"
            className="text-sm text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition-all px-3 py-1.5 rounded-lg"
          >
            Kostenlos registrieren
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-1.5 rounded-lg"
          >
            Einloggen
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="sm:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/5 px-6 py-3 flex flex-col gap-1">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-slate-400 hover:text-white py-2 transition-colors"
          >
            Zur App
          </Link>
          <Link
            href="/registrieren"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-slate-300 hover:text-white py-2 transition-colors"
          >
            Kostenlos registrieren
          </Link>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 py-2 transition-colors"
          >
            Einloggen
          </Link>
        </div>
      )}
    </header>
  );
}
