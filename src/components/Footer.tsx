"use client";

import { useLanguage } from "@/contexts/LanguageContext";
export default function Footer() {
  const { language } = useLanguage();
  const de = language === "de";
  return (
    <footer className="border-t border-[#dbe8f6] bg-white/80 mt-auto">
      <div className="px-6 py-6 max-w-7xl w-full mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: copyright + legal */}
          <div className="space-y-1 min-w-0">
            <p className="text-xs text-slate-600">
              © 2026 Orkhan Hajiyev · FISI LabBook · {de ? "Ein Projekt des OrikOS-Ökosystems" : "OrikOS ekosisteminin layihəsi"}
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-lg">
              {de ? "FISI LabBook ist ein eigenständiges Praxis- und Portfolio-Projekt innerhalb des OrikOS-Ökosystems." : "FISI LabBook OrikOS ekosistemi çərçivəsində hazırlanmış müstəqil praktika və portfolio layihəsidir."}
            </p>
            <p className="text-[11px] text-slate-500 pt-0.5">
              {de ? "Kontakt:" : "Əlaqə:"}{" "}
              <a
                href="mailto:info@oriklab.com"
                className="hover:text-slate-600 transition-colors"
              >
                info@oriklab.com
              </a>
              {" · "}
              {de ? "Support:" : "Dəstək:"}{" "}
              <a
                href="mailto:support@oriklab.com"
                className="hover:text-slate-600 transition-colors"
              >
                support@oriklab.com
              </a>
            </p>
          </div>

          {/* Right: nav links */}
          <nav className="flex items-center gap-4 shrink-0 flex-wrap">
            <a
              href="https://www.oriklab.com/de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-600 hover:text-cyan-700 transition-colors"
            >
              OrikLab
            </a>
            <span className="text-slate-300 select-none">·</span>
            <a
              href="https://www.oriklab.com/de/impressum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-600 hover:text-slate-700 transition-colors"
            >
              {de ? "Impressum" : "Hüquqi məlumat"}
            </a>
            <span className="text-slate-300 select-none">·</span>
            <a
              href="https://www.oriklab.com/de/datenschutz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-600 hover:text-slate-700 transition-colors"
            >
              {de ? "Datenschutz" : "Məxfilik siyasəti"}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
