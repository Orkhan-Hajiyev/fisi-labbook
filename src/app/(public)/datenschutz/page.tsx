"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const copy = {
  de: {
    heading: "Datenschutzhinweise für FISI LabBook",
    subtitle: "Transparenz über Konten, IT-Dokumentation und eingesetzte Dienste.",
    sections: [
      ["1. Verantwortlichkeit und Kontakt", "FISI LabBook wird als persönliches Projekt von Orkhan Hajiyev betrieben. Die vollständigen Betreiberangaben sind im Impressum verlinkt. Bei Datenschutzfragen: info@oriklab.com."],
      ["2. Hosting und technische Zugriffsdaten", "Die Anwendung wird auf der Plattform Vercel bereitgestellt. Bei Seitenaufrufen können technisch erforderliche Verbindungsdaten wie IP-Adresse, Anfragezeit und Geräte- oder Browserinformationen verarbeitet werden, um die Website bereitzustellen und abzusichern."],
      ["3. Registrierung und Anmeldung", "Die Registrierung und Anmeldung erfolgen mit Supabase Auth. Dabei werden die eingegebene E-Mail-Adresse, ein Passwort für die Anmeldung und der angegebene Name verarbeitet. Bestätigungs-E-Mails können Teil des Registrierungsablaufs sein. Zugangsdaten werden nicht als öffentlich lesbare Laboreinträge angelegt."],
      ["4. Persönliche Inhalte", "Angemeldete Personen können eigene Labore, Systeme, Befehle, Fehleranalysen, Docker-Dienste und Praxisnotizen speichern und verwalten. Diese Inhalte werden über Supabase gespeichert und mit dem jeweiligen Benutzerkonto verknüpft. Trage keine echten Kennwörter, Zugangsschlüssel oder sonstige vertrauliche Kundendaten in Übungsfelder ein."],
      ["5. Öffentliche Demo und Beispielbereich", "Der öffentliche Beispielbereich zeigt illustrative Daten. Die dort präsentierten Musterinhalte sind nicht mit deinem persönlichen Konto verknüpft."],
      ["6. Spracheinstellungen und Sitzung", "Die ausgewählte Sprache wird im lokalen Browserspeicher gespeichert. Supabase Auth verwendet technisch erforderliche browserseitige Sitzungsmechanismen für die Anmeldung."],
      ["7. Deine Datenschutzrechte", "Du kannst Auskunft, Berichtigung oder Löschung personenbezogener Daten sowie weitere gesetzlich bestehende Rechte über info@oriklab.com geltend machen. Ferner besteht nach Maßgabe des Datenschutzrechts die Möglichkeit, dich bei einer zuständigen Datenschutzaufsichtsbehörde zu beschweren."],
    ],
    checkTitle: "Vor der öffentlichen Freigabe zu vervollständigen",
    checkText: "Eine abschließende rechtliche Prüfung dieser Datenschutzhinweise steht noch aus. Insbesondere sind die tatsächlich eingesetzte Supabase-Region, Aufbewahrungs- und Löschfristen, Rechtsgrundlagen, mögliche Auftragsverarbeiter und Drittlandtransfers sowie der Prozess zur Konto- und Datenlöschung anhand der produktiven Konfiguration zu bestätigen.",
  },
  az: {
    heading: "FISI LabBook üçün məxfilik məlumatları",
    subtitle: "Hesablar, IT sənədləri və istifadə olunan texniki xidmətlər haqqında şəffaf məlumat.",
    sections: [
      ["1. Məsul şəxs və əlaqə", "FISI LabBook Orkhan Hajiyev tərəfindən fərdi layihə kimi idarə olunur. Operatorun tam məlumatlarına hüquqi məlumat səhifəsindən keçmək olar. Məxfilik məsələləri üçün: info@oriklab.com."],
      ["2. Hosting və texniki giriş məlumatları", "Tətbiq Vercel infrastrukturu üzərində yerləşdirilir. Sayt açılarkən səhifənin işləməsi və təhlükəsizliyi üçün IP ünvanı, sorğunun vaxtı, brauzer və cihaz haqqında texniki məlumatlar emal edilə bilər."],
      ["3. Qeydiyyat və hesaba giriş", "Qeydiyyat və giriş Supabase Auth vasitəsilə həyata keçirilir. Bu zaman e-poçt ünvanı, giriş şifrəsi və daxil etdiyin ad emal olunur. Qeydiyyat prosesində təsdiq e-poçtu göndərilə bilər. Giriş məlumatları açıq laboratoriya qeydləri şəklində saxlanmır."],
      ["4. Şəxsi məzmun", "Qeydiyyatlı istifadəçilər öz laboratoriyalarını, sistemlərini, əmrlərini, xəta təhlillərini, Docker xidmətlərini və praktiki qeydlərini yarada və idarə edə bilərlər. Bu məlumatlar Supabase-də saxlanılır və müvafiq istifadəçi hesabına bağlanır. Təlim xanalarına real şifrələr, giriş açarları və məxfi müştəri məlumatları daxil etmə."],
      ["5. Açıq demo və nümunələr", "Açıq nümunə bölməsində yalnız izah məqsədli məlumatlar göstərilir. Nümunə qeydləri şəxsi hesabına aid deyil."],
      ["6. Dil seçimi və giriş sessiyası", "Seçdiyin dil brauzerin yerli yaddaşında saxlanılır. Supabase Auth hesaba giriş üçün texniki sessiya mexanizmlərindən istifadə edir."],
      ["7. Məlumatların qorunması üzrə hüquqların", "Şəxsi məlumatlarına baxış, düzəliş, silinmə və qanunla nəzərdə tutulmuş digər hüquqların üçün info@oriklab.com ünvanına müraciət edə bilərsən. Müvafiq məlumatların qorunması üzrə nəzarət orqanına şikayət etmək hüququ da mövcuddur."],
    ],
    checkTitle: "İctimai yayımdan əvvəl tamamlanmalıdır",
    checkText: "Bu mətnin yekun hüquqi yoxlaması hələ aparılmalıdır. Supabase məlumat mərkəzinin faktiki regionu, məlumatların saxlanma və silinmə müddətləri, hüquqi əsaslar, məlumat emal edən tərəflər, ölkələrarası ötürmə və hesabın silinmə prosesi real istehsal parametrlərinə uyğun təsdiqlənməlidir.",
  },
} as const;

export default function DatenschutzPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const de = language === "de";
  return <div className="mx-auto max-w-4xl px-5 sm:px-7 py-10 sm:py-14">
    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline"><ArrowLeft size={16}/>{de ? "Zur Startseite" : "Ana səhifəyə qayıt"}</Link>
    <header className="mt-8 rounded-3xl border border-[#c9dff3] bg-gradient-to-br from-[#e8f3ff] to-white p-7 sm:p-9">
      <p className="flex items-center gap-2 text-xs font-black tracking-widest text-blue-700"><ShieldCheck size={17}/>FISI LABBOOK</p>
      <h1 className="mt-3 text-3xl font-extrabold text-[#143b65]">{t.heading}</h1>
      <p className="mt-3 text-sm leading-7 text-[#526f8a]">{t.subtitle}</p>
    </header>
    <div className="mt-7 space-y-4">{t.sections.map(([title,content])=><section key={title} className="rounded-2xl border border-blue-100 bg-white p-6"><h2 className="text-lg font-bold text-[#173f67]">{title}</h2><p className="mt-3 text-sm leading-7 text-[#526f8a]">{content}</p></section>)}</div>
    <div role="note" className="mt-6 rounded-2xl border border-[#f3dba5] bg-[#fffaf0] p-6"><h2 className="text-base font-bold text-[#805a15]">{t.checkTitle}</h2><p className="mt-2 text-sm leading-7 text-[#77602f]">{t.checkText}</p></div>
    <p className="mt-6 text-sm text-[#526f8a]">{de ? "Für Betreiberangaben siehe" : "Operator məlumatları üçün bax:"} <Link className="font-semibold text-blue-700 hover:underline" href="/impressum">{de ? "Impressum" : "Hüquqi məlumat"}</Link>.</p>
  </div>;
}
