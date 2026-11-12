"use client";

import { Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  const de = language === "de";
  return <footer className="mt-auto border-t border-[#d8e8f7] bg-white/95">
    <div className="mx-auto w-full max-w-7xl px-5 sm:px-7">
      <div className="grid gap-6 border-b border-[#e3edf8] py-8 sm:grid-cols-[1fr_auto]">
        <div className="max-w-xl">
          <p className="text-lg font-extrabold tracking-tight text-[#173e68]">FISI <span className="text-[#1772cf]">LabBook</span></p>
          <p className="mt-2 text-sm leading-6 text-[#56738c]">{de ? "Ein eigenständiges IT-Praxis- und Dokumentationsprojekt im Umfeld von OrikLab." : "OrikLab çərçivəsində hazırlanmış, IT praktikası və sənədləşmə üçün müstəqil rəqəmsal layihə."}</p>
        </div>
        <div className="sm:min-w-[220px]">
          <h2 className="text-sm font-extrabold text-[#173e68]">{de ? "Kontakt" : "Əlaqə"}</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm text-[#58758c]">
            <a href="mailto:info@oriklab.com" className="inline-flex items-center gap-2 hover:text-blue-700"><Mail size={15} className="text-blue-600"/>info@oriklab.com</a>
            <a href="mailto:support@oriklab.com" className="inline-flex items-center gap-2 hover:text-blue-700"><Mail size={15} className="text-blue-600"/>support@oriklab.com</a>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:justify-between sm:items-center">
        <span className="text-xs text-[#66829a]">© {new Date().getFullYear()} FISI LabBook · OrikLab</span>
        <nav aria-label={de ? "Rechtliche Informationen" : "Hüquqi keçidlər"} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-[#456b89]">
          <a href="/impressum" className="hover:text-blue-700">{de ? "Impressum" : "Hüquqi məlumat"}</a>
          <a href="/datenschutz" className="hover:text-blue-700">{de ? "Datenschutz" : "Məxfilik siyasəti"}</a>
        </nav>
      </div>
    </div>
  </footer>;
}
