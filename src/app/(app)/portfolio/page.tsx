"use client";

import { T, useT } from "@/components/TranslatedText";
import { FolderKanban, Target, Database, Layers, Briefcase, Rocket, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";

const techStack = [
  "Next.js 16 (App Router)",
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
  "Teamverwaltung und erweiterte Rollen",
  "Gestaltete PDF-Berichte und Exportvorlagen",
  "Topologie-Diagramme",
  "Automatisierte Zusammenfassungen",
  "Semantische Suche und intelligente Filter",
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
    blue: "bg-blue-500/10 border-blue-500/15 text-blue-700",
    cyan: "bg-cyan-500/10 border-cyan-500/15 text-cyan-700",
    violet: "bg-violet-500/10 border-violet-500/15 text-violet-700",
    emerald: "bg-emerald-500/10 border-emerald-500/15 text-emerald-700",
    amber: "bg-amber-500/10 border-amber-500/15 text-amber-700",
  };
  const cls = colors[accent] ?? colors.blue;
  return (
    <div className="rounded-xl border border-slate-200 bg-blue-50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${cls}`}>
          <Icon size={15} />
        </div>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
          <CheckCircle2 size={13} className="text-blue-700 shrink-0 mt-0.5" />
          <span><T>{item}</T></span>
        </li>
      ))}
    </ul>
  );
}

export default function PortfolioPage() {
  const translateUI = useT();
  const { language } = useLanguage();
  return (
    <div>
      <PageHeader
        icon={FolderKanban}
        title={translateUI("Portfolio")}
        description={translateUI("Projektzusammenfassung, Technologien und Ausblick")}
      />

      <div className="space-y-5">
        {/* Ziel */}
        <Section icon={Target} title={translateUI("Ziel des Projekts")} accent="blue">
          <p className="text-sm text-slate-600 leading-relaxed">
            {language === "de"
              ? "FISI LabBook wurde entwickelt, um praktische IT-Labore, Systeme, Befehle, Docker-Dienste und Fehleranalysen strukturiert zu dokumentieren. Der Fokus liegt auf praxisnaher Systemintegration, nachvollziehbarer technischer Dokumentation und professioneller Fehleranalyse."
              : "FISI LabBook praktiki IT laboratoriyalarını, sistemləri, əmrləri, Docker xidmətlərini və xəta təhlillərini sistemli şəkildə sənədləşdirmək üçün hazırlanıb. Əsas məqsəd sistem inteqrasiyası üzrə praktiki bacarıqları, aydın texniki sənədləşməni və peşəkar diaqnostikanı dəstəkləməkdir."}
          </p>
        </Section>

        {/* Dokumentierte Bereiche */}
        <Section icon={Database} title={translateUI("Dokumentierte Bereiche")} accent="cyan">
          <BulletList items={areas} />
        </Section>

        {/* Technologien */}
        <Section icon={Layers} title={translateUI("Technologien")} accent="violet">
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs bg-blue-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium"
              >
                <T>{tech}</T>
              </span>
            ))}
          </div>
        </Section>

        {/* Nutzen im Praktikum */}
        <Section icon={Briefcase} title={translateUI("Nutzen im Praktikum")} accent="emerald">
          <p className="text-sm text-slate-600 leading-relaxed">
            {language === "de"
              ? "Die Plattform zeigt eine strukturierte Arbeitsweise, technisches Verständnis, Dokumentationsfähigkeit und praxisorientierte Problemlösung im Bereich Fachinformatiker für Systemintegration. Sie eignet sich als Portfolio-Nachweis für Bewerbungsgespräche und Praktikumspräsentationen."
              : "Platforma sistem inteqrasiyası sahəsində sistemli iş üsulunu, texniki anlayışı, sənədləşdirmə bacarığını və praktiki problemlərin həllini nümayiş etdirir. Bu layihə iş müsahibələrində və təcrübə təqdimatlarında portfolio nümunəsi kimi istifadə oluna bilər."}
          </p>
        </Section>

        {/* Weiterentwicklung */}
        <Section icon={Rocket} title={translateUI("Weiterentwicklung")} accent="amber">
          <BulletList items={future} />
        </Section>
      </div>
    </div>
  );
}
