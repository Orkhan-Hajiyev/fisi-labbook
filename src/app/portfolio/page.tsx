import { FolderKanban, Target, Database, Layers, Briefcase, Rocket, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const techStack = [
  "Next.js 15 (App Router)",
  "TypeScript",
  "Tailwind CSS",
  "Supabase PostgreSQL",
  "Vercel",
  "GitHub",
  "Docker",
  "n8n (optional, Automatisierung)",
];

const areas = [
  "Windows Server und Active Directory",
  "DNS, DHCP und Netzwerkdiagnose",
  "Linux- und Docker-Umgebungen",
  "Administrationsbefehle",
  "Troubleshooting-Fälle",
  "Service- und Systemdokumentation",
];

const future = [
  "Authentifizierung und Admin-Bereich",
  "Export-Funktionen (PDF, Markdown)",
  "Topologie-Diagramme",
  "Automatisierte Zusammenfassungen",
  "Erweiterte Suchfunktionen",
];

function Section({
  icon: Icon,
  title,
  accent = "blue",
  children,
}: {
  icon: React.ElementType;
  title: string;
  accent?: string;
  children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 border-blue-500/15 text-blue-400",
    cyan: "bg-cyan-500/10 border-cyan-500/15 text-cyan-400",
    violet: "bg-violet-500/10 border-violet-500/15 text-violet-400",
    emerald: "bg-emerald-500/10 border-emerald-500/15 text-emerald-400",
    amber: "bg-amber-500/10 border-amber-500/15 text-amber-400",
  };
  const cls = colors[accent] ?? colors.blue;
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${cls}`}>
          <Icon size={15} />
        </div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-400">
          <CheckCircle2 size={13} className="text-blue-400 shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PortfolioPage() {
  return (
    <div>
      <PageHeader
        icon={FolderKanban}
        title="Portfolio"
        description="Projektzusammenfassung, Technologien und Ausblick"
      />

      <div className="space-y-5">
        {/* Ziel */}
        <Section icon={Target} title="Ziel des Projekts" accent="blue">
          <p className="text-sm text-slate-400 leading-relaxed">
            FISI LabBook wurde entwickelt, um praktische IT-Labore, Systeme, Befehle, Docker-Dienste und
            Fehleranalysen strukturiert zu dokumentieren. Der Fokus liegt auf praxisnaher
            Systemintegration, nachvollziehbarer technischer Dokumentation und professioneller
            Fehleranalyse.
          </p>
        </Section>

        {/* Dokumentierte Bereiche */}
        <Section icon={Database} title="Dokumentierte Bereiche" accent="cyan">
          <BulletList items={areas} />
        </Section>

        {/* Technologien */}
        <Section icon={Layers} title="Technologien" accent="violet">
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs bg-white/5 border border-white/10 text-slate-300 px-3 py-1.5 rounded-lg font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </Section>

        {/* Nutzen im Praktikum */}
        <Section icon={Briefcase} title="Nutzen im Praktikum" accent="emerald">
          <p className="text-sm text-slate-400 leading-relaxed">
            Die Plattform zeigt eine strukturierte Arbeitsweise, technisches Verständnis,
            Dokumentationsfähigkeit und praxisorientierte Problemlösung im Bereich Fachinformatiker für
            Systemintegration. Sie eignet sich als Portfolio-Nachweis für Bewerbungsgespräche und
            Praktikumspräsentationen.
          </p>
        </Section>

        {/* Weiterentwicklung */}
        <Section icon={Rocket} title="Weiterentwicklung" accent="amber">
          <BulletList items={future} />
        </Section>
      </div>
    </div>
  );
}
