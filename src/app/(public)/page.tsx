import Link from "next/link";
import {
  FlaskConical,
  Server,
  Terminal,
  Bug,
  Container,
  StickyNote,
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const modules = [
  {
    icon: FlaskConical,
    label: "Labore",
    desc: "Dokumentierte IT-Laborumgebungen mit Status, Ziel und Beschreibung.",
    accent: "blue",
  },
  {
    icon: Server,
    label: "Systeme",
    desc: "Infrastruktur-Dokumentation: Hostnames, IP-Adressen, Rollen, Dienste.",
    accent: "cyan",
  },
  {
    icon: Terminal,
    label: "Befehle",
    desc: "Admin-Befehlsreferenz mit Plattform, Kategorie und Beispielen.",
    accent: "violet",
  },
  {
    icon: Bug,
    label: "Fehleranalyse",
    desc: "Strukturierte Troubleshooting-Fälle: Symptome, Ursache, Lösung.",
    accent: "amber",
  },
  {
    icon: Container,
    label: "Docker-Dienste",
    desc: "Container-Dienste mit Images, Ports und Compose-Snippets.",
    accent: "emerald",
  },
  {
    icon: StickyNote,
    label: "Praxisnotizen",
    desc: "Persönlicher Arbeitsbereich für technische Notizen und FISI-Dokumentation.",
    accent: "slate",
  },
];

const accentMap: Record<string, string> = {
  blue: "bg-blue-500/10 border-blue-500/15 text-blue-400",
  cyan: "bg-cyan-500/10 border-cyan-500/15 text-cyan-400",
  violet: "bg-violet-500/10 border-violet-500/15 text-violet-400",
  amber: "bg-amber-500/10 border-amber-500/15 text-amber-400",
  emerald: "bg-emerald-500/10 border-emerald-500/15 text-emerald-400",
  slate: "bg-slate-500/10 border-slate-500/15 text-slate-400",
};

const steps = [
  {
    icon: CheckCircle2,
    step: "01",
    title: "OrikOS-Konto erstellen",
    desc: "Name, E-Mail und Passwort eingeben und kostenfrei registrieren.",
  },
  {
    icon: Mail,
    step: "02",
    title: "E-Mail bestätigen",
    desc: "Den Bestätigungslink in Ihrem Postfach öffnen und Konto aktivieren.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "App nutzen",
    desc: "Mit OrikOS-Konto einloggen und persönliche FISI-Dokumentation verwalten.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-cyan-600/5 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-cyan-500/20 bg-cyan-500/5 text-cyan-500/80 mb-8">
            OrikOS-Ökosystemprojekt
          </span>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-none mb-5">
            FISI LabBook
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-blue-400/90 font-medium mb-6 leading-snug">
            Ihre persönliche Plattform für Systemintegration,
            <br className="hidden sm:block" /> Labor-Dokumentation und Fehleranalyse.
          </p>

          {/* Main description */}
          <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8 text-sm sm:text-base">
            FISI LabBook unterstützt angehende Fachinformatiker für Systemintegration dabei,
            praktische IT-Labore, Systeme, Befehle, Fehleranalysen, Docker-Dienste und
            Praxisnotizen strukturiert zu dokumentieren und dauerhaft zu verwalten.
          </p>

          {/* Registration note */}
          <p className="text-xs text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
            Erstellen Sie ein kostenloses OrikOS-Konto, bestätigen Sie Ihre E-Mail-Adresse und
            starten Sie mit Ihrer persönlichen FISI-Dokumentation.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 text-sm font-medium text-slate-200 transition-all"
            >
              Zur App
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/registrieren"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors shadow-lg shadow-blue-600/20"
            >
              Kostenlos registrieren
            </Link>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-sm font-medium text-slate-300 hover:text-white transition-all"
            >
              Einloggen
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-b border-white/5 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest text-center mb-10">
            So funktioniert&apos;s
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map(({ icon: Icon, step, title, desc }) => (
              <div
                key={step}
                className="relative rounded-xl border border-white/5 bg-white/[0.02] p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-black text-slate-700 tabular-nums">{step}</span>
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center">
                    <Icon size={13} className="text-blue-400" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules ── */}
      <section className="border-b border-white/5 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest text-center mb-10">
            Module der Plattform
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(({ icon: Icon, label, desc, accent }) => (
              <div
                key={label}
                className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.035] hover:border-white/10 transition-all duration-150 p-5"
              >
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${accentMap[accent]}`}
                >
                  <Icon size={14} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{label}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mobile install ── */}
      <section className="border-b border-white/5 py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start gap-6 rounded-xl border border-white/5 bg-white/[0.02] p-6 sm:p-8">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone size={16} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-white mb-1.5">FISI LabBook mobil nutzen</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-5">
                FISI LabBook kann auf dem Smartphone wie eine App genutzt werden. Öffnen Sie die
                Plattform im Browser und fügen Sie sie über &bdquo;Zum Startbildschirm
                hinzufügen&ldquo; zu Ihrem Gerät hinzu.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                  <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    Android / Chrome
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Menü öffnen <span className="text-slate-600">→</span>{" "}
                    <span className="text-slate-300">Zum Startbildschirm hinzufügen</span>
                  </p>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                  <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    iPhone / Safari
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Teilen öffnen <span className="text-slate-600">→</span>{" "}
                    <span className="text-slate-300">Zum Home-Bildschirm</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OrikOS brand block ── */}
      <section className="py-14">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-cyan-500/15 bg-cyan-500/5 text-cyan-500/60 mb-4">
            OrikOS-Ökosystemprojekt
          </span>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
            Ein OrikOS-Projekt innerhalb der OrikLab-Webplattform – entwickelt für praxisnahe
            Systemintegration, technische Dokumentation und strukturierte Fehleranalyse.
          </p>
        </div>
      </section>
    </div>
  );
}
