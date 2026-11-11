"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Layers3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PublicNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const de = language === "de";

  const links = [
    { href: "/", label: de ? "Startseite" : "Ana səhifə" },
    { href: "/dashboard", label: de ? "Demo testen" : "Demonu sına" },
    { href: "/beispiele", label: de ? "Beispiel-Workspace" : "Nümunə Workspace" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#d6e6f8] bg-white/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[72px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="FISI LabBook">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1074d8] to-[#53b7f3] text-white grid place-items-center shadow-md shadow-blue-500/15"><Layers3 size={23} /></span>
          <span className="leading-tight"><strong className="text-[17px] text-[#12345b] tracking-tight block">FISI <span className="text-[#1476cf]">LabBook</span></strong><span className="text-[10px] text-[#517391]">{de ? "IT-Labor · Praxis · Dokumentation" : "IT laboratoriyası · Praktika · Sənədləşmə"}</span></span>
        </Link>
        <nav aria-label={de ? "Hauptnavigation" : "Əsas naviqasiya"} className="hidden lg:flex items-center gap-1">
          {links.map(({ href, label }) => <Link key={href} href={href} className="px-3 py-2 rounded-lg text-sm font-semibold text-[#385775] hover:bg-blue-50 hover:text-blue-700 transition-colors">{label}</Link>)}
        </nav>
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-[#d4e4f7] p-0.5 bg-[#f4f9ff]" aria-label={de ? "Sprache wählen" : "Dil seçimi"}>
            <button type="button" onClick={() => setLanguage("de")} aria-pressed={de} className={`px-2.5 py-1.5 text-xs font-bold rounded-md ${de ? "bg-blue-600 text-white" : "text-[#4f6b87] hover:bg-white"}`}>DE</button>
            <button type="button" onClick={() => setLanguage("az")} aria-pressed={!de} className={`px-2.5 py-1.5 text-xs font-bold rounded-md ${!de ? "bg-blue-600 text-white" : "text-[#4f6b87] hover:bg-white"}`}>AZ</button>
          </div>
          <Link href="/login" className="text-sm font-semibold px-3 py-2 text-[#174d80] hover:text-blue-700">{de ? "Anmelden" : "Daxil ol"}</Link>
          <Link href="/registrieren" className="px-4 py-2.5 rounded-xl text-sm font-bold bg-[#126bd0] hover:bg-[#0758b4] text-white shadow-sm transition-colors">{de ? "Kostenlos registrieren" : "Pulsuz qeydiyyat"}</Link>
        </div>
        <button type="button" className="sm:hidden rounded-lg p-2 text-blue-800 hover:bg-blue-50" aria-label={menuOpen ? (de ? "Menü schließen" : "Menyunu bağla") : (de ? "Menü öffnen" : "Menyunu aç")} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
      </div>
      {menuOpen && <nav className="sm:hidden bg-white border-t border-[#dce8f7] px-5 py-4 flex flex-col gap-2">
        {links.map(({ href, label }) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="py-2 text-sm font-semibold text-[#214d77]">{label}</Link>)}
        <div className="flex gap-2 py-1">
          <button onClick={() => setLanguage("de")} aria-pressed={de} className="rounded-lg border border-blue-200 px-3 py-1.5 text-sm">Deutsch</button>
          <button onClick={() => setLanguage("az")} aria-pressed={!de} className="rounded-lg border border-blue-200 px-3 py-1.5 text-sm">Azərbaycanca</button>
        </div>
        <Link href="/login" onClick={() => setMenuOpen(false)} className="py-2 font-semibold text-blue-700">{de ? "Anmelden" : "Daxil ol"}</Link>
        <Link href="/registrieren" onClick={() => setMenuOpen(false)} className="text-center py-3 rounded-xl font-semibold bg-blue-700 text-white">{de ? "Kostenlos registrieren" : "Pulsuz qeydiyyat"}</Link>
      </nav>}
    </header>
  );
}
