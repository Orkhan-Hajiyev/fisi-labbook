"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ImpressumPage() {
  const { language } = useLanguage();
  const de = language === "de";
  return <div className="mx-auto max-w-4xl px-5 sm:px-7 py-10 sm:py-14">
    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline"><ArrowLeft size={16}/>{de ? "Zur Startseite" : "Ana səhifəyə qayıt"}</Link>
    <header className="mt-8 rounded-3xl border border-[#c9dff3] bg-gradient-to-br from-[#e8f3ff] to-white p-7 sm:p-9">
      <p className="text-xs font-black tracking-widest text-blue-700">FISI LABBOOK · {de ? "RECHTLICHE ANGABEN" : "HÜQUQİ MƏLUMAT"}</p>
      <h1 className="mt-3 text-3xl font-extrabold text-[#143b65]">{de ? "Impressum" : "Hüquqi məlumat"}</h1>
      <p className="mt-3 text-sm leading-7 text-[#526f8a]">{de ? "Angaben zur Verantwortung für FISI LabBook und zur Kontaktaufnahme." : "FISI LabBook-un operatoru və əlaqə vasitələri haqqında məlumat."}</p>
    </header>
    <div className="mt-7 space-y-6">
      <section className="rounded-2xl border border-blue-100 bg-white p-6">
        <h2 className="text-lg font-bold text-[#173f67]">{de ? "Verantwortliche Person" : "Məsul şəxs"}</h2>
        <p className="mt-3 text-sm text-[#446581]">Orkhan Hajiyev</p>
        <p className="mt-2 text-sm text-[#446581]">{de ? "FISI LabBook ist ein persönliches IT-Praxis- und Dokumentationsprojekt im Umfeld von OrikLab; eine eingetragene Gesellschaft unter diesem Namen wird damit nicht behauptet." : "FISI LabBook OrikLab çərçivəsində fərdi IT praktikası və sənədləşmə layihəsidir; bu adla qeydiyyatdan keçmiş şirkət olduğu iddia edilmir."}</p>
        <a href="https://www.oriklab.com/impressum" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline">{de ? "Vollständige Betreiber- und Adressangaben bei OrikLab" : "Operatorun tam ünvan və hüquqi məlumatları — OrikLab"}<ExternalLink size={15}/></a>
      </section>
      <section className="rounded-2xl border border-blue-100 bg-white p-6">
        <h2 className="text-lg font-bold text-[#173f67]">{de ? "Kontakt" : "Əlaqə"}</h2>
        <p className="mt-3 text-sm text-[#446581]">{de ? "Allgemeine Anfragen:" : "Ümumi müraciətlər:"} <a className="font-semibold text-blue-700" href="mailto:info@oriklab.com">info@oriklab.com</a></p>
        <p className="mt-2 text-sm text-[#446581]">{de ? "Hilfe zur Anwendung:" : "Tətbiq üzrə dəstək:"} <a className="font-semibold text-blue-700" href="mailto:support@oriklab.com">support@oriklab.com</a></p>
      </section>
      <section className="rounded-2xl border border-blue-100 bg-white p-6">
        <h2 className="text-lg font-bold text-[#173f67]">{de ? "Datenschutz" : "Məxfilik"}</h2>
        <p className="mt-2 text-sm leading-7 text-[#526f8a]">{de ? "Informationen zur Datenverarbeitung von FISI LabBook findest du in der anwendungsspezifischen Datenschutzerklärung." : "FISI LabBook-da şəxsi məlumatların emalı haqqında məlumat tətbiqə məxsus məxfilik səhifəsində verilir."}</p>
        <Link href="/datenschutz" className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline">{de ? "Datenschutzhinweise lesen" : "Məxfilik məlumatlarını oxu"}</Link>
      </section>
    </div>
  </div>;
}
