"use client";

import { useEffect, useState } from "react";
import { Network, Server, ShieldCheck, Terminal } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";

export default function InfrastructureHero({ language }: { language: Language }) {
  return (
    <div className="fisi-infra-hero relative isolate overflow-hidden rounded-[28px] border border-[#bbd8f7] min-h-[350px] sm:min-h-[420px] bg-gradient-to-br from-[#e7f3ff] via-[#eaf6ff] to-[#b8d9fa] shadow-[0_32px_75px_-38px_rgba(10,83,176,.32)]" aria-label={language==="de"?"Illustration eines IT-Labors mit vernetzten Diensten":"Bir-birinə qoşulmuş IT xidmətləri olan laboratoriya təsviri"} role="img">
      <div className="absolute inset-0 fisi-tech-grid opacity-60" aria-hidden="true" />
      <div className="absolute w-64 h-64 -right-20 -top-20 rounded-full bg-[#5da6ff]/20 blur-3xl" aria-hidden="true" />
      <div className="absolute w-64 h-64 -bottom-24 left-0 rounded-full bg-white/50 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 px-5 sm:px-7 pt-5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 rounded-xl bg-white/95 border border-[#c5ddf5] py-2 px-3 text-xs font-bold text-[#245e99] shadow-sm"><Network size={16}/>{language==="de"?"Netzwerk-Topologie":"Şəbəkə topologiyası"}</span>
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-[#2c6da8]"><span className="w-2 h-2 rounded-full bg-blue-500"/> {language==="de"?"Beispielumgebung":"Nümunə mühit"}</span>
      </div>
      <svg viewBox="0 0 720 415" className="absolute left-0 right-0 top-6 h-[calc(100%-22px)] w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="infra-edge" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2f9af9"/><stop offset="1" stopColor="#1474d4"/></linearGradient>
          <linearGradient id="infra-rack" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#356cb0"/><stop offset="1" stopColor="#102f5d"/></linearGradient>
          <filter id="infra-glow"><feGaussianBlur stdDeviation="6"/></filter>
        </defs>
        <g opacity=".26" stroke="#5bacee" strokeWidth="1" fill="none">
          <path d="M28 100L180 55 330 100 504 50 690 100M25 285L180 330 360 290 545 341 696 270"/>
          <path d="M125 55V340M355 48V370M600 65V355"/>
        </g>
        <g fill="none" stroke="#93c9f6" strokeWidth="11" strokeLinecap="round" filter="url(#infra-glow)">
          <path d="M146 211H264L323 155M264 211L323 285M426 211H556L611 147M556 211L611 286"/>
        </g>
        <g fill="none" stroke="url(#infra-edge)" strokeWidth="3.3" strokeLinecap="round" strokeLinejoin="round">
          <path className="fisi-infra-line" d="M146 211H264L323 155"/>
          <path className="fisi-infra-line" d="M264 211L323 285"/>
          <path className="fisi-infra-line" d="M426 211H556L611 147"/>
          <path className="fisi-infra-line" d="M556 211L611 286"/>
        </g>
        <g transform="translate(46 152)">
          <rect width="102" height="115" rx="17" fill="white" fillOpacity=".95" stroke="#a1cbf1" strokeWidth="2"/>
          <rect x="22" y="20" width="58" height="39" rx="10" fill="#e0f2ff" stroke="#79b8ea"/>
          <path d="M34 44h34m-29-10h24m-12 10v16" stroke="#207bce" strokeWidth="4" strokeLinecap="round"/>
          <rect x="16" y="76" width="70" height="25" rx="9" fill="#dbedff"/>
          <text x="51" y="93" fontSize="12" fontWeight="700" textAnchor="middle" fill="#205887">WAN</text>
        </g>
        <g transform="translate(257 147)">
          <rect width="170" height="128" rx="20" fill="white" fillOpacity=".98" stroke="#76b7eb" strokeWidth="2.6"/>
          <rect x="25" y="22" width="120" height="52" rx="12" fill="#255c9b"/>
          <path d="M45 45H125M45 53H125" stroke="#9bd9ff" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="50" cy="90" r="6" fill="#24b9ed"/><circle cx="71" cy="90" r="6" fill="#24b9ed"/><circle cx="92" cy="90" r="6" fill="#24b9ed"/><circle cx="113" cy="90" r="6" fill="#24b9ed"/>
          <text x="85" y="115" textAnchor="middle" fontSize="13" fontWeight="700" fill="#235b94">CORE SWITCH</text>
        </g>
        <g transform="translate(302 86)">
          <rect x="0" y="0" width="68" height="75" rx="11" fill="url(#infra-rack)" stroke="#5da6e5" strokeWidth="2"/>
          <g fill="#70ddff"><rect x="10" y="12" width="48" height="10" rx="3"/><rect x="10" y="29" width="48" height="10" rx="3"/><rect x="10" y="46" width="48" height="10" rx="3"/></g>
        </g>
        <g transform="translate(302 274)">
          <rect x="0" y="0" width="68" height="77" rx="11" fill="url(#infra-rack)" stroke="#5da6e5" strokeWidth="2"/>
          <rect x="13" y="14" width="42" height="32" rx="6" fill="#b9e5ff"/>
          <path d="M23 26L31 33 23 40M35 40h9" stroke="#155da1" strokeWidth="3" strokeLinecap="round" fill="none"/>
        </g>
        <g transform="translate(582 98)">
          <rect width="78" height="81" rx="12" fill="url(#infra-rack)" stroke="#5da6e5" strokeWidth="2"/>
          <g fill="#70ddff"><rect x="13" y="14" width="52" height="12" rx="4"/><rect x="13" y="33" width="52" height="12" rx="4"/><rect x="13" y="52" width="52" height="12" rx="4"/></g>
        </g>
        <g transform="translate(580 271)">
          <rect width="86" height="63" rx="12" fill="#f5faff" stroke="#7dbcef" strokeWidth="2.5"/>
          <rect x="14" y="13" width="58" height="34" rx="6" fill="#1d67b2"/>
          <path d="M30 30h27M44 17v27" stroke="#90d7ff" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <g fill="#1478d6"><circle cx="264" cy="211" r="6"/><circle cx="556" cy="211" r="6"/></g>
      </svg>
      <div className="absolute bottom-4 left-5 right-5 z-20 flex items-center justify-between gap-3">
        <span className="rounded-lg border border-[#b4d6f1] bg-white/95 px-3 py-2 text-[11px] font-semibold text-[#326c9f] shadow-sm">{language==="de"?"Windows · Linux · Netzwerk · Container":"Windows · Linux · Şəbəkə · Konteynerlər"}</span>
        <span className="rounded-lg bg-[#dceeff] px-2 py-1.5 text-[10px] text-blue-800 font-semibold">{language==="de"?"Visualisierte Übungsumgebung":"Təsvir edilmiş məşq mühiti"}</span>
      </div>
    </div>
  );
}

export function AnimatedProjectWalkthrough({ language }: { language: Language }) {
  const steps = language === "de" ? [
    {title:"1 · Labor planen",name:"LAB-002 · Firmennetz",description:"Ziel, Umgebung und Status des Übungslabors festhalten.",type:"lab"},
    {title:"2 · Systeme verknüpfen",name:"dc01.lab.test · 192.168.20.10",description:"Domänencontroller, DNS und Linux-Server im selben Lab dokumentieren.",type:"network"},
    {title:"3 · DNS überprüfen",name:"Resolve-DnsName dc01.lab.test",description:"Den Prüfbefehl mit erwarteter Ausgabe und Kontext speichern.",type:"terminal"},
    {title:"4 · Fehler beheben",name:"DNS-Konfiguration korrigiert",description:"Ursache, Lösung und Ergebnis der Fehleranalyse nachvollziehbar dokumentieren.",type:"check"},
  ] : [
    {title:"1 · Laboratoriyanı planlaşdır",name:"LAB-002 · Müəssisə şəbəkəsi",description:"Məşqin məqsədini, mühitini və vəziyyətini qeyd et.",type:"lab"},
    {title:"2 · Sistemləri əlaqələndir",name:"dc01.lab.test · 192.168.20.10",description:"Domen kontrollerini, DNS və Linux serverini eyni laboratoriyada sənədləşdir.",type:"network"},
    {title:"3 · DNS-i yoxla",name:"Resolve-DnsName dc01.lab.test",description:"Yoxlama əmrini gözlənilən nəticəsi və izahı ilə saxla.",type:"terminal"},
    {title:"4 · Xətanı aradan qaldır",name:"DNS konfiqurasiyası düzəldildi",description:"Səbəbi, həll yolunu və nəticəni ardıcıl sənədləşdir.",type:"check"},
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive(i => (i + 1) % 4), 4200);
    return () => window.clearInterval(timer);
  }, []);
  const current = steps[active];
  return (
    <div className="fisi-card rounded-[24px] p-5 sm:p-6 overflow-hidden min-h-[332px]" aria-label={language==="de"?"Animierte Dokumentationsvorschau":"Animasiya ilə sənədləşmə nümunəsi"}>
      <div className="flex items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <span className="flex items-center gap-2 font-bold text-[#194f85] text-sm"><Network size={19}/>{language==="de"?"Musterprojekt · Büro-Netzwerk":"Nümunə layihə · Ofis şəbəkəsi"}</span>
        <span className="text-[11px] text-blue-700 font-semibold">{active + 1} / 4</span>
      </div>
      <div aria-live="off" className="min-h-[190px] py-6 grid sm:grid-cols-[1fr_auto] gap-4 sm:gap-6 items-center" key={active}>
        <div className="fisi-step-enter"><p className="text-[11px] tracking-widest text-blue-700 font-bold uppercase">{current.title}</p><h3 className="text-lg sm:text-xl font-extrabold text-[#173e65] mt-3 break-words">{current.name}</h3><p className="mt-3 text-xs sm:text-sm leading-6 text-[#557590]">{current.description}</p></div>
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#d4eaff] to-[#f7fbff] border border-[#b7d8f5] grid place-items-center text-blue-700 shadow-sm fisi-step-enter" aria-hidden="true">
          {current.type==="lab"&&<Server size={46} strokeWidth={1.5}/>}
          {current.type==="network"&&<Network size={46} strokeWidth={1.5}/>}
          {current.type==="terminal"&&<Terminal size={46} strokeWidth={1.5}/>}
          {current.type==="check"&&<ShieldCheck size={46} strokeWidth={1.5}/>}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2" role="group" aria-label={language==="de"?"Schritte wählen":"Addımı seç"}>
        {steps.map((step,i)=><button type="button" onClick={()=>setActive(i)} aria-label={step.title} aria-current={i===active?"step":undefined} key={step.title} className={`h-2.5 rounded-full transition-colors duration-300 ${active===i?"bg-blue-600":"bg-[#d6e7f6] hover:bg-[#a9d2ef]"}`}/>)}
      </div>
      <p className="mt-3 text-[11px] text-[#718da5]">{language==="de"?"Illustrative Daten; kein Zugriff auf reale Systeme.":"Məlumatlar nümunədir; real sistemlərə giriş yoxdur."}</p>
    </div>
  );
}
