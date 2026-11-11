"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Network } from "lucide-react";

export default function PublicNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8e7f6] bg-white/95 backdrop-blur-xl shadow-[0_4px_24px_-20px_rgba(26,91,151,0.32)]">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1477ca] to-[#37a8db] flex items-center justify-center shrink-0 shadow-md shadow-blue-400/15">
            <Network size={20} className="text-white" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-[#173958]">FISI LabBook<span className="text-blue-600">.</span></span>
        </Link>

        {/* Desktop */}
        <nav className="hidden sm:flex items-center gap-2">
          <Link
            href="/dashboard"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5"
          >
            Zur App
          </Link>
          <Link
            href="/registrieren"
            className="text-sm text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-200 transition-all px-3 py-1.5 rounded-lg"
          >
            Kostenlos registrieren
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-white bg-[#176cba] hover:bg-[#105b9d] transition-colors px-4 py-2 rounded-xl shadow-sm"
          >
            Einloggen
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="sm:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-blue-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menü"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-slate-200 px-6 py-3 flex flex-col gap-1">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-slate-600 hover:text-slate-900 py-2 transition-colors"
          >
            Zur App
          </Link>
          <Link
            href="/registrieren"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-slate-700 hover:text-slate-900 py-2 transition-colors"
          >
            Kostenlos registrieren
          </Link>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold text-blue-700 hover:text-blue-800 py-2 transition-colors"
          >
            Einloggen
          </Link>
        </div>
      )}
    </header>
  );
}
