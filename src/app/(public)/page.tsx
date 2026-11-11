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
  Network,
  Activity,
  Layers3,
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
  blue: "bg-blue-500/10 border-blue-500/15 text-blue-700",
  cyan: "bg-cyan-500/10 border-cyan-500/15 text-cyan-700",
  violet: "bg-violet-500/10 border-violet-500/15 text-violet-700",
  amber: "bg-amber-500/10 border-amber-500/15 text-amber-700",
  emerald: "bg-emerald-500/10 border-emerald-500/15 text-emerald-700",
  slate: "bg-slate-500/10 border-slate-500/15 text-slate-600",
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
      <section className="relative overflow-hidden border-b border-[#d9e8f7] bg-gradient-to-br from-[#f7fbff] via-[#f1f8ff] to-[#e5f2ff]">
        <div className="absolute inset-0 fisi-tech-grid opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-16 sm:py-20 lg:py-24 grid lg:grid-cols-[1.08fr_0.92fr] items-center gap-12">
          <div>
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase border border-[#c0e0f5] bg-white/85 text-blue-700 mb-6">
            <Network size={14} /> OrikLab · FISI Education
          </span>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-[#153a5c] tracking-[-0.05em] leading-[1.05] mb-5">
            FISI <span className="text-[#1477c6]">LabBook.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl font-semibold text-[#2a577b] mb-5 leading-snug">
            Dein System. Dein Wissen.<br />Dein nächstes Level.
          </p>

          {/* Main description */}
          <p className="text-[#56718a] leading-relaxed max-w-xl mb-6 text-sm sm:text-base">
            Die Praxisplattform für angehende Fachinformatiker für Systemintegration:
            IT-Labore planen, Netzwerke dokumentieren, Admin-Befehle sammeln und Fehler strukturiert lösen.
          </p>

          {/* Registration note */}
          <p className="text-xs text-[#6d8aa2] mb-7 max-w-lg leading-relaxed">
            Ein kostenloses Konto genügt – danach steht dir dein persönlicher IT-Workspace zur Verfügung.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#176cba] hover:bg-[#105b9d] text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-colors"
            >
              LabBook entdecken
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/registrieren"
              className="px-5 py-3 rounded-xl bg-white border border-[#b8d7f1] hover:border-blue-400 text-sm font-semibold text-[#1e629a] shadow-sm transition-all"
            >
              Kostenlos starten
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 mt-8 text-[11px] font-semibold text-[#5d809f]">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#1491b8]" /> Praxisorientiert</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#1491b8]" /> Privater Workspace</span>
            <span className="flex items-center gap-1.5"><Smartphone size={14} className="text-[#1491b8]" /> Mobil nutzbar</span>
          </div>
          </div>

          <div className="fisi-card relative rounded-[24px] p-5 sm:p-6 border-[#c4def3] bg-white/95 shadow-[0_28px_65px_-35px_rgba(21,100,170,0.35)]">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#e1eaf4]">
              <div className="flex items-center gap-2.5"><div className="h-9 w-9 rounded-xl bg-[#e8f4ff] text-blue-700 flex items-center justify-center"><Layers3 size={19} /></div><div><p className="text-xs font-bold text-[#214b6e]">Systemintegration Cockpit</p><p className="text-[10px] text-slate-500">FISI LabBook · Vorschau</p></div></div>
              <div className="flex gap-1.5"><span className="w-2 h-2 rounded-full bg-[#b9d9ec]"/><span className="w-2 h-2 rounded-full bg-[#b9d9ec]"/><span className="w-2 h-2 rounded-full bg-[#1d9fc3]"/></div>
            </div>
            <div className="grid grid-cols-3 gap-3 my-5">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3"><Server size={18} className="text-[#1f75b4] mb-3" /><p className="text-xs font-bold text-[#214b6e]">Systeme</p><p className="text-[10px] text-slate-500 mt-1">Infrastruktur</p></div>
              <div className="rounded-xl bg-cyan-50 border border-cyan-100 p-3"><Network size={18} className="text-cyan-700 mb-3" /><p className="text-xs font-bold text-[#214b6e]">Netzwerk</p><p className="text-[10px] text-slate-500 mt-1">Topologie</p></div>
              <div className="rounded-xl bg-sky-50 border border-sky-100 p-3"><Bug size={18} className="text-sky-700 mb-3" /><p className="text-xs font-bold text-[#214b6e]">Analyse</p><p className="text-[10px] text-slate-500 mt-1">Troubleshooting</p></div>
            </div>
            <div className="rounded-xl bg-[#143550] text-[#c8e9fc] p-4 font-mono text-[11px] sm:text-xs leading-6">
              <div className="flex items-center gap-2 mb-2"><Terminal size={13} className="text-[#74d1ef]" /><span className="text-[#81d5f0]">PowerShell · Beispiel</span></div>
              <p><span className="text-[#89dfbb]">PS C:\&gt;</span> Get-NetIPConfiguration</p>
              <p className="text-[#9ac7e3]"># Prüfen · Verstehen · Dokumentieren</p>
            </div>
            <div className="flex items-center gap-2 pt-4 text-[11px] font-medium text-slate-500"><Activity size={14} className="text-[#1b9db8]" /> Ein Ort für deine gesamte IT-Praxis <ArrowRight size={13} className="ml-auto text-blue-500" /></div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-b border-[#e0ebf5] py-16 bg-white/50">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[11px] font-bold text-blue-700 uppercase tracking-[0.18em] text-center mb-2">SO FUNKTIONIERT&apos;S</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#193d5c] text-center mb-10">In drei Schritten startklar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map(({ icon: Icon, step, title, desc }) => (
              <div
                key={step}
                className="fisi-card relative rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-black text-slate-500 tabular-nums">{step}</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Icon size={13} className="text-blue-700" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[#214a6c] mb-1.5">{title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules ── */}
      <section className="border-b border-[#e0ebf5] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-[11px] font-bold text-blue-700 uppercase tracking-[0.18em] text-center mb-2">DEINE IT-WERKZEUGE</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#193d5c] text-center mb-10">Alles für deine IT-Praxis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(({ icon: Icon, label, desc, accent }) => (
              <div
                key={label}
                className="fisi-card rounded-2xl transition-all duration-200 hover:-translate-y-0.5 p-6"
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${accentMap[accent]}`}
                >
                  <Icon size={19} />
                </div>
                <h3 className="text-sm font-bold text-[#214a6c] mb-2">{label}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mobile install ── */}
      <section className="border-b border-slate-200 py-14">
        <div className="max-w-5xl mx-auto px-6">
          <div className="fisi-card flex flex-col sm:flex-row items-start gap-6 rounded-2xl p-6 sm:p-8">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone size={16} className="text-blue-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-slate-900 mb-1.5">FISI LabBook mobil nutzen</h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                FISI LabBook kann auf dem Smartphone wie eine App genutzt werden. Öffnen Sie die
                Plattform im Browser und fügen Sie sie über &bdquo;Zum Startbildschirm
                hinzufügen&ldquo; zu Ihrem Gerät hinzu.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-200 bg-blue-50 px-4 py-3">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Android / Chrome
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Menü öffnen <span className="text-slate-500">→</span>{" "}
                    <span className="text-slate-700">Zum Startbildschirm hinzufügen</span>
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-blue-50 px-4 py-3">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    iPhone / Safari
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Teilen öffnen <span className="text-slate-500">→</span>{" "}
                    <span className="text-slate-700">Zum Home-Bildschirm</span>
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-cyan-500/15 bg-cyan-500/5 text-cyan-700/60 mb-4">
            OrikOS-Ökosystemprojekt
          </span>
          <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Ein OrikOS-Projekt innerhalb der OrikLab-Webplattform – entwickelt für praxisnahe
            Systemintegration, technische Dokumentation und strukturierte Fehleranalyse.
          </p>
        </div>
      </section>
    </div>
  );
}
