"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Container, FlaskConical, Info, Layers3, Network, Play, Server, ShieldCheck, Terminal, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import InfrastructureHero from "@/components/InfrastructureShowcase";

const translations = {
  de: {
    eyebrow: "FÜR FACHINFORMATIKER:INNEN · SYSTEMINTEGRATION",
    title1: "Dein digitales IT-Labor.",
    title2: "Lernen. Anwenden. Dokumentieren.",
    lead: "FISI LabBook verbindet praxisnahe IT-Labore, Systemdokumentation, Admin-Befehle und strukturierte Fehleranalysen in einer übersichtlichen Plattform.",
    trust: ["Praxisnah", "Übersichtlich", "Kostenlos"],
    demo: "Demo eingeschränkt testen", examples: "Ausgefülltes Beispiel ansehen", signup: "Kostenlos registrieren", login: "Anmelden",
    titleChoice: "Drei Wege, FISI LabBook kennenzulernen", demoNotice: "Demo und Beispielbereich dienen zum Kennenlernen; es besteht keine Verbindung zu echten Servern.",
    choiceLead: "Du entscheidest, wie du die Plattform entdecken möchtest.",
    items: [
      { title: "Eingeschränkte Demo", subtitle: "Ohne Registrierung", text: "Öffentliche IT-Beispiele und ausgewählte Funktionen ansehen. Eigene Einträge lassen sich hier nicht dauerhaft speichern.", cta: "Demo starten" },
      { title: "Ausgefüllter Beispiel-Workspace", subtitle: "Geführter Rundgang", text: "Ein vollständig illustriertes Übungsprojekt mit Labor, System, Befehlen, Docker, Fehleranalyse und Notizen – mit Erklärungen zu jedem Bereich.", cta: "Beispiele entdecken" },
      { title: "Dein persönlicher Workspace", subtitle: "Kostenlos nach Registrierung", text: "Eigene Labore und Systeme anlegen, Befehle und Praxisnotizen verwalten und verfügbare Exportfunktionen nutzen.", cta: "Kostenloses Konto erstellen" },
    ],
    modulesTitle: "Alles für deinen FISI-Alltag", modulesLead: "Von der Einrichtung eines Servers bis zur dokumentierten Fehlerbehebung.",
    modules: [
      ["IT-Labore", "Übungen, Ziele und Ergebnisse nachvollziehbar festhalten."],
      ["Systeme & Dienste", "Server, IP-Adressen, Rollen und Dienste strukturieren."],
      ["Befehle", "PowerShell, Linux und Netzwerkkommandos sammeln."],
      ["Fehleranalyse", "Symptome, Ursachen und Lösungen dokumentieren."],
      ["Docker", "Container, Ports und Compose-Beispiele im Blick behalten."],
      ["Praxisnotizen", "Persönliches IT-Wissen dauerhaft festhalten."],
    ],
    freeEyebrow: "KOSTENLOS STARTEN", freeTitle: "Dein Wissen verdient einen eigenen IT-Workspace.",
    freeText: "Registriere dich kostenlos und dokumentiere eigene Labore, Systeme, Befehle und Praxisnotizen an einem Ort. Zur Aktivierung kann eine E-Mail-Bestätigung erforderlich sein.",
    freeLink: "Kostenloses Konto erstellen", paidNote: "Für die derzeit angebotenen Funktionen ist kein kostenpflichtiges Abo erforderlich.",
  },
  az: {
    eyebrow: "İT VƏ SİSTEM İNTEQRASİYASINI ÖYRƏNƏNLƏR ÜÇÜN",
    title1: "Sənin rəqəmsal IT laboratoriyan.",
    title2: "Öyrən. Tətbiq et. Sənədləşdir.",
    lead: "FISI LabBook praktiki IT laboratoriyalarını, sistem sənədlərini, inzibati əmrləri və sistemli xəta təhlilini vahid, aydın platformada birləşdirir.",
    trust: ["Praktik öyrənmə", "Aydın quruluş", "Pulsuz istifadə"],
    demo: "Məhdud demonu sına", examples: "Doldurulmuş nümunəyə bax", signup: "Pulsuz qeydiyyatdan keç", login: "Daxil ol",
    titleChoice: "FISI LabBook ilə tanış olmağın üç yolu", demoNotice: "Demo və nümunə bölmələri öyrənmə məqsədlidir; real serverlərə qoşulmur.",
    choiceLead: "Platformanı necə kəşf etmək istədiyini özün seç.",
    items: [
      { title: "Məhdud demo", subtitle: "Qeydiyyatsız", text: "Açıq IT nümunələrinə və seçilmiş funksiyalara bax. Burada şəxsi qeydləri daimi saxlamaq mümkün deyil.", cta: "Demonu aç" },
      { title: "Tam doldurulmuş nümunə iş mühiti", subtitle: "İzahlı tanışlıq", text: "Laboratoriya, sistem, əmrlər, Docker, xəta təhlili və qeydləri əhatə edən, hər bölməsi izah olunmuş nümunə layihəni araşdır.", cta: "Nümunələri kəşf et" },
      { title: "Şəxsi iş mühiti", subtitle: "Qeydiyyatdan sonra pulsuz", text: "Öz laboratoriyalarını və sistemlərini yarat, əmrlərini və praktiki qeydlərini idarə et, mövcud ixrac funksiyalarından istifadə et.", cta: "Pulsuz hesab yarat" },
    ],
    modulesTitle: "Sistem inteqrasiyası praktikası üçün hər şey", modulesLead: "Server quraşdırılmasından xətanın həllinin sənədləşdirilməsinə qədər.",
    modules: [
      ["IT laboratoriyaları", "Tapşırıqları, məqsədləri və nəticələri sistemli qeyd et."],
      ["Sistemlər və xidmətlər", "Serverləri, IP ünvanlarını, rolları və xidmətləri sənədləşdir."],
      ["Əmrlər", "PowerShell, Linux və şəbəkə əmrlərini topla."],
      ["Xəta təhlili", "Əlamətləri, səbəbləri və həll yollarını qeyd et."],
      ["Docker", "Konteynerləri, portları və Compose nümunələrini izləməyə kömək edir."],
      ["Praktiki qeydlər", "Şəxsi IT biliklərini bir yerdə saxla."],
    ],
    freeEyebrow: "PULSUZ BAŞLA", freeTitle: "Öyrəndiklərini şəxsi IT laboratoriyanda topla.",
    freeText: "Pulsuz hesab yarat, laboratoriyalarını və sistemlərini sənədləşdir, əmrlərini və praktiki qeydlərini bir məkanda idarə et. Qeydiyyatı tamamlamaq üçün e-poçt təsdiqi tələb oluna bilər.",
    freeLink: "Pulsuz hesab yarat", paidNote: "Hazırda ödənişli abunə tələb olunmur.",
  },
} as const;

const moduleIcons = [FlaskConical, Server, Terminal, Wrench, Container, BookOpen];
const choiceIcons = [Play, Layers3, ShieldCheck];
const choiceLinks = ["/dashboard", "/beispiele", "/registrieren"];
const moduleLinks = ["/labore", "/systeme", "/befehle", "/fehleranalyse", "/docker-dienste", "/praxisnotizen"];

export default function LandingPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const de = language === "de";

  return <div className="pb-12">
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f5faff] to-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-7 py-12 sm:py-16 grid lg:grid-cols-[1fr_1.02fr] items-center gap-8 lg:gap-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-[#eaf5ff] px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#1263ad]"><Network size={14} />{t.eyebrow}</span>
          <h1 className="mt-6 text-[clamp(2.2rem,4vw,3.65rem)] font-extrabold tracking-tight leading-[1.12] text-[#102c54]">{t.title1}<span className="block mt-2 text-[#176ed3]">{t.title2}</span></h1>
          <p className="mt-6 text-[#4d6987] text-base leading-relaxed max-w-xl">{t.lead}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-[#116bc9] hover:bg-[#0959b0] text-white text-sm font-bold shadow-lg shadow-blue-500/20">{t.demo}<ArrowRight size={16}/></Link>
            <Link href="/beispiele" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 border border-[#bdd7ef] bg-white hover:bg-blue-50 text-[#165a9a] text-sm font-bold">{t.examples}<Layers3 size={16}/></Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-5 text-xs font-semibold text-[#4b759a]">{t.trust.map(s=><span key={s} className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-blue-600" />{s}</span>)}</div>
        </div>
        <InfrastructureHero language={language} />
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-5 sm:px-7 py-12" aria-labelledby="ways-title">
      <div className="mb-7"><p className="text-xs font-extrabold tracking-[.16em] text-blue-700 uppercase">FISI LABBOOK</p><h2 id="ways-title" className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#143960]">{t.titleChoice}</h2><p className="text-[#5c7791] mt-2 text-sm">{t.choiceLead}</p></div>
      <div className="grid md:grid-cols-3 gap-4">
        {t.items.map((item,i)=>{const Icon=choiceIcons[i]; return <article key={item.title} className={`fisi-card rounded-[22px] p-6 flex flex-col gap-4 ${i===1?"border-blue-300 bg-[#eff7ff]":""}`}>
          <div className="flex items-center justify-between"><span className="w-12 h-12 grid place-items-center rounded-2xl bg-[#e5f1ff] text-blue-700"><Icon size={25}/></span><span className="rounded-full bg-[#eaf2fc] px-3 py-1 text-[10px] text-[#366f9d] font-bold">{item.subtitle}</span></div>
          <h3 className="text-lg font-bold text-[#17385e]">{item.title}</h3><p className="text-sm leading-relaxed text-[#58728d] flex-1">{item.text}</p>
          <Link href={choiceLinks[i]} className="flex items-center justify-between text-sm font-bold text-blue-700 hover:text-blue-900 pt-2 border-t border-blue-100">{item.cta}<ArrowRight size={17}/></Link>
        </article>})}
      </div>
      <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-[#587793]"><Info className="mt-0.5 shrink-0 text-[#2478c8]" size={17}/>{t.demoNotice}</p>
    </section>

    <section className="border-y border-[#d8e8f8] bg-gradient-to-b from-[#eef6ff] via-[#f8fbff] to-[#eaf4ff] py-14 sm:py-[70px]" aria-labelledby="modules-title">
      <div className="max-w-7xl mx-auto px-5 sm:px-7">
        <p className="text-xs font-extrabold tracking-[.16em] text-blue-700 uppercase">{de ? "DIE MODULE" : "TƏTBİQİN BÖLMƏLƏRİ"}</p>
        <h2 id="modules-title" className="mt-3 text-[clamp(1.65rem,2.8vw,2.35rem)] font-extrabold tracking-tight leading-tight text-[#14385f]">{t.modulesTitle}</h2>
        <p className="mt-3 text-base leading-7 text-[#55738e]">{t.modulesLead}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.modules.map(([title,desc],i)=>{const Icon=moduleIcons[i];return <Link href={moduleLinks[i]} key={title} className="group flex min-h-[172px] flex-col justify-between rounded-[21px] border border-[#c9dff5] bg-white p-6 shadow-[0_18px_34px_-29px_rgba(14,76,140,.38)] transition-all hover:-translate-y-1 hover:border-[#98c5ef] hover:shadow-[0_22px_45px_-30px_rgba(14,76,140,.42)]">
            <div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#e9f4ff] to-[#cfe7ff] text-[#136bc1]"><Icon size={25}/></span><span className="text-xs font-bold text-[#97b8d6]">{String(i+1).padStart(2,"0")}</span></div>
            <div className="mt-4 flex items-end justify-between gap-3"><div><h3 className="text-lg font-extrabold text-[#173e66]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#55738e]">{desc}</p></div><ArrowRight size={18} className="mb-1 shrink-0 text-[#2478ca] transition-transform group-hover:translate-x-1" aria-hidden="true"/></div>
          </Link>})}
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-5 sm:px-7 pt-14 pb-6" aria-labelledby="signup-title">
      <div className="relative overflow-hidden rounded-[26px] border border-[#b8d7f6] bg-gradient-to-r from-[#e4f1ff] via-[#eff7ff] to-[#d8ebff] p-7 sm:p-10">
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl"><p className="text-xs font-extrabold uppercase tracking-widest text-[#176cbd]">{t.freeEyebrow}</p><h2 id="signup-title" className="mt-3 text-2xl sm:text-[30px] font-extrabold leading-tight text-[#123b66]">{t.freeTitle}</h2><p className="mt-3 text-sm sm:text-base leading-7 text-[#50718d]">{t.freeText}</p><p className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#236cae]"><CheckCircle2 size={16}/>{t.paidNote}</p></div>
          <Link href="/registrieren" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1168c7] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/15 transition-colors hover:bg-[#0956a5]">{t.freeLink}<ArrowRight size={17}/></Link>
        </div>
      </div>
    </section>
  </div>;
}
