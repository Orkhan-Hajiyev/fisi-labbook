export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0f1117] mt-auto">
      <div className="px-6 py-6 max-w-7xl w-full mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: copyright + legal */}
          <div className="space-y-1 min-w-0">
            <p className="text-xs text-slate-500">
              © 2026 Orkhan Hajiyev · FISI LabBook · Ein Projekt des OrikOS-Ökosystems
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed max-w-lg">
              FISI LabBook ist ein eigenständiges Praxis- und Portfolio-Projekt innerhalb des
              OrikOS-Ökosystems.
            </p>
            <p className="text-[11px] text-slate-700 pt-0.5">
              Kontakt:{" "}
              <a
                href="mailto:info@oriklab.com"
                className="hover:text-slate-500 transition-colors"
              >
                info@oriklab.com
              </a>
              {" · "}
              Support:{" "}
              <a
                href="mailto:support@oriklab.com"
                className="hover:text-slate-500 transition-colors"
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
              className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
            >
              OrikLab
            </a>
            <span className="text-white/10 select-none">·</span>
            <a
              href="https://www.oriklab.com/de/impressum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Impressum
            </a>
            <span className="text-white/10 select-none">·</span>
            <a
              href="https://www.oriklab.com/de/datenschutz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Datenschutz
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
