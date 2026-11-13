"use client";

import { Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  const de = language === "de";
  const pathname = usePathname();
  const compactAuthFooter = ["/login", "/registrieren", "/passwort-vergessen", "/passwort-zuruecksetzen"].includes(pathname);
  return <footer className="mt-auto border-t border-[#d8e8f7] bg-white/95">
    <div className="mx-auto w-full max-w-7xl px-5 sm:px-7">
      {!compactAuthFooter && (
      <div className={`grid border-b border-[#e3edf8] sm:grid-cols-[1fr_auto] ${compactAuthFooter ? "gap-2 py-2 sm:py-3" : "gap-6 py-8"}`}>
        <div className="max-w-xl">
          <p className="text-lg font-extrabold tracking-tight text-[#173e68]">FISI <span className="text-[#1772cf]">LabBook</span></p>
          <p className={`${compactAuthFooter ? "mt-1 text-xs leading-5" : "mt-2 text-sm leading-6"} text-[#56738c]`}>{de ? "Ein eigenständiges IT-Praxis- und Dokumentationsprojekt im Umfeld von OrikLab." : "OrikLab çərçivəsində hazırlanmış, IT praktikası və sənədləşmə üçün müstəqil rəqəmsal layihə."}</p>
        </div>
        <div className="sm:min-w-[220px]">
          <h2 className="text-sm font-extrabold text-[#173e68]">{de ? "Kontakt" : "Əlaqə"}</h2>
          <div className={`${compactAuthFooter ? "mt-1 gap-1 text-xs" : "mt-3 gap-2 text-sm"} flex flex-col text-[#58758c]`}>
            <a href="mailto:info@oriklab.com" className="inline-flex items-center gap-2 hover:text-blue-700"><Mail size={15} className="text-blue-600"/>info@oriklab.com</a>
            <a href="mailto:support@oriklab.com" className="inline-flex items-center gap-2 hover:text-blue-700"><Mail size={15} className="text-blue-600"/>support@oriklab.com</a>
          </div>
        </div>
      </div>
      )}
      <div className={`flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center ${compactAuthFooter ? "py-2" : "py-4"}`}>
        <span className="text-xs text-[#66829a]">© {new Date().getFullYear()} FISI LabBook · OrikLab</span>
        <nav aria-label={de ? "Rechtliche Informationen" : "Hüquqi keçidlər"} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-[#456b89]">
          <a href="/impressum" className="hover:text-blue-700">{de ? "Impressum" : "Hüquqi məlumat"}</a>
          <a href="/datenschutz" className="hover:text-blue-700">{de ? "Datenschutz" : "Məxfilik siyasəti"}</a>
        </nav>
      </div>
    </div>
  </footer>;
}
