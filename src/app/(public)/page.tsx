"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Container, FlaskConical, Layers3, Network, Play, Server, ShieldCheck, Terminal, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import InfrastructureHero, { AnimatedProjectWalkthrough } from "@/components/InfrastructureShowcase";

const translations = {
  de: {
    eyebrow: "FÜR FACHINFORMATIKER:INNEN · SYSTEMINTEGRATION",
    title1: "Dein digitales IT-Labor.",
    title2: "Lernen. Anwenden. Dokumentieren.",
    lead: "FISI LabBook verbindet praxisnahe IT-Labore, Systemdokumentation, Admin-Befehle und strukturierte Fehleranalysen in einer übersichtlichen Plattform.",
    trust: ["Praxisnah", "Übersichtlich", "Kostenlos"],
    demo: "Demo eingeschränkt testen", examples: "Ausgefülltes Beispiel ansehen", signup: "Kostenlos registrieren", login: "Anmelden",
    preview: "Interaktive Plattformvorschau", example: "Beispiel · keine echte Infrastruktur",
    terminal: "Netzwerk prüfen · Ausgabe dokumentieren",
    titleChoice: "Drei Wege, FISI LabBook kennenzulernen",
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
    sampleTitle: "So sieht eine vollständige Dokumentation aus",
    sampleLead: "Im Beispielbereich siehst du nicht nur leere Formulare, sondern einen zusammenhängenden, ausgefüllten FISI-Fall – inklusive technischer Zusammenhänge.",
    sampleRows: [["Labor", "Firmennetz mit Windows und Linux"], ["System", "srv-ad01 · DNS / Active Directory"], ["Netzwerk", "192.168.20.0/24 · VLAN 20"], ["Fehleranalyse", "DNS-Auflösung prüfen und beheben"]],
    sampleLink: "Zum erklärten Beispiel-Workspace",
    freeEyebrow: "100 % KOSTENLOS", freeTitle: "Alle Funktionen mit deinem eigenen Konto nutzen.",
    freeText: "Nach der Registrierung und gegebenenfalls der E-Mail-Bestätigung kannst du deinen persönlichen Workspace verwenden. Für die derzeit angebotene App ist kein kostenpflichtiges Abo erforderlich.",
    freeLink: "Jetzt kostenlos registrieren",
    caveat: "Demo und Beispielbereich zeigen illustrative Daten. Sie sind keine Verbindung zu echten Servern oder produktiven IT-Systemen.",
  },
  az: {
    eyebrow: "SİSTEM İNTEQRASİYASI SAHƏSİNİ ÖYRƏNƏNLƏR ÜÇÜN",
    title1: "Sənin rəqəmsal IT laboratoriyan.",
    title2: "Öyrən. Tətbiq et. Sənədləşdir.",
    lead: "FISI LabBook praktiki IT laboratoriyalarını, sistem sənədlərini, inzibati əmrləri və sistemli xəta təhlilini vahid, aydın platformada birləşdirir.",
    trust: ["Praktik yönümlü", "Aydın quruluş", "Tam pulsuz"],
    demo: "Məhdud demonu sına", examples: "Doldurulmuş nümunəyə bax", signup: "Pulsuz qeydiyyatdan keç", login: "Daxil ol",
    preview: "İnteraktiv platforma təqdimatı", example: "Nümunə · real infrastruktur deyil",
    terminal: "Şəbəkəni yoxla · nəticəni sənədləşdir",
    titleChoice: "FISI LabBook ilə tanış olmağın üç yolu",
    choiceLead: "Platformanı necə kəşf etmək istədiyini özün seç.",
    items: [
      { title: "Məhdud demo", subtitle: "Qeydiyyatsız", text: "Açıq IT nümunələrinə və seçilmiş funksiyalara bax. Burada şəxsi qeydləri daimi saxlamaq mümkün deyil.", cta: "Demonu aç" },
      { title: "Tam doldurulmuş nümunə iş mühiti", subtitle: "İzahlı tanışlıq", text: "Laboratoriya, sistem, əmrlər, Docker, xəta təhlili və qeydləri əhatə edən, hər bölməsi izah olunmuş nümunə layihəni araşdır.", cta: "Nümunələri kəşf et" },
      { title: "Şəxsi iş mühiti", subtitle: "Qeydiyyatdan sonra pulsuz", text: "Öz laboratoriyalarını və sistemlərini yarat, əmrlərini və praktiki qeydlərini idarə et, mövcud ixrac funksiyalarından istifadə et.", cta: "Pulsuz hesab yarat" },
    ],
    modulesTitle: "sistem inteqrasiyası praktikası üçün hər şey", modulesLead: "Server quraşdırılmasından xətanın həllinin sənədləşdirilməsinə qədər.",
    modules: [
      ["IT laboratoriyaları", "Tapşırıqları, məqsədləri və nəticələri sistemli qeyd et."],
      ["Sistemlər və xidmətlər", "Serverləri, IP ünvanlarını, rolları və xidmətləri sənədləşdir."],
      ["Əmrlər", "PowerShell, Linux və şəbəkə əmrlərini topla."],
      ["Xəta təhlili", "Əlamətləri, səbəbləri və həll yollarını qeyd et."],
      ["Docker", "Konteynerləri, portları və Compose nümunələrini izləməyə kömək edir."],
      ["Praktiki qeydlər", "Şəxsi IT biliklərini bir yerdə saxla."],
    ],
    sampleTitle: "Tam sənədləşdirilmiş layihə necə görünür?",
    sampleLead: "Nümunə bölməsində boş formalar deyil, texniki əlaqələri ilə birlikdə hazırlanmış sistem inteqrasiyası üzrə bütöv praktik nümunəni görəcəksən.",
    sampleRows: [["Laboratoriya", "Windows və Linux ilə müəssisə şəbəkəsi"], ["Sistem", "srv-ad01 · DNS / Active Directory"], ["Şəbəkə", "192.168.20.0/24 · VLAN 20"], ["Xəta təhlili", "DNS ad həllini yoxla və düzəlt"]],
    sampleLink: "İzahlı nümunə iş mühiti-ə keç",
    freeEyebrow: "100% PULSUZ", freeTitle: "Şəxsi hesabınla bütün mövcud funksiyalardan istifadə et.",
    freeText: "Qeydiyyatdan və tələb olunduqda e-poçt təsdiqindən sonra şəxsi iş mühiti-dən istifadə edə bilərsən. Tətbiqin hazırda təqdim olunan funksiyaları üçün ödənişli abunə tələb edilmir.",
    freeLink: "İndi pulsuz qeydiyyatdan keç",
    caveat: "Demo və nümunə bölmələrindəki məlumatlar illüstrativdir; real serverlərə və işlək IT infrastrukturuna qoşulmur.",
  },
} as const;

const moduleIcons = [FlaskConical, Server, Terminal, Wrench, Container, BookOpen];
const choiceIcons = [Play, Layers3, ShieldCheck];
const choiceLinks = ["/dashboard", "/beispiele", "/registrieren"];

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
    </section>

    <section className="bg-[#f1f7ff] border-y border-[#deebfa] py-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-7"><h2 className="text-2xl sm:text-3xl font-extrabold text-[#153b64]">{t.modulesTitle}</h2><p className="mt-2 text-sm text-[#57758f]">{t.modulesLead}</p>
        <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{t.modules.map(([title,desc],i)=>{const Icon=moduleIcons[i];return <article key={title} className="rounded-2xl bg-white border border-blue-100 p-5 shadow-sm flex gap-4"><span className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 grid place-items-center text-blue-700"><Icon size={22}/></span><div><h3 className="font-bold text-sm text-[#163e68]">{title}</h3><p className="text-xs leading-relaxed mt-2 text-[#637d96]">{desc}</p></div></article>})}</div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-5 sm:px-7 py-14 grid lg:grid-cols-[.86fr_1.14fr] items-center gap-8">
      <div><p className="uppercase tracking-widest text-xs font-bold text-blue-700">{t.preview}</p><h2 className="mt-3 text-3xl font-extrabold text-[#14395c]">{t.sampleTitle}</h2><p className="mt-4 text-[#57718a] text-sm leading-7">{t.sampleLead}</p><Link href="/beispiele" className="mt-6 inline-flex items-center gap-2 text-blue-700 font-bold text-sm hover:underline">{t.sampleLink}<ArrowRight size={16}/></Link></div>
      <AnimatedProjectWalkthrough language={language} />
    </section>

    <section className="max-w-7xl mx-auto px-5 sm:px-7"><div className="rounded-[24px] p-6 sm:p-9 bg-gradient-to-r from-[#e6f3ff] via-[#eff8ff] to-[#d7ebff] border border-[#bedcf6] grid lg:grid-cols-[1fr_auto] items-center gap-5">
      <div><p className="text-xs tracking-widest font-black text-blue-700">{t.freeEyebrow}</p><h2 className="mt-2 text-2xl font-extrabold text-[#133c68]">{t.freeTitle}</h2><p className="text-sm text-[#50718e] mt-3 max-w-3xl leading-relaxed">{t.freeText}</p></div><Link href="/registrieren" className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-[#106acb] text-white font-bold text-sm hover:bg-[#0759b2]">{t.freeLink}<ArrowRight size={16}/></Link>
    </div><p className="mt-5 text-xs text-[#68829a] text-center">{t.caveat}</p></section>
  </div>;
}
