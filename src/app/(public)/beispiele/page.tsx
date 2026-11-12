"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Container, FlaskConical, Layers3, LockKeyhole, Server, Terminal, Wrench } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const copy = {
  de: {
    tag:"AUSGEFÜLLTER BEISPIEL-WORKSPACE · LESEMODUS",
    title:"Ein vollständiger FISI-Fall – Schritt für Schritt erklärt.",
    lead:"Hier zeigen zusammenhängende, erfundene Beispieldaten, wie ein Netzwerk-Labor in FISI LabBook dokumentiert werden kann. Alle Felder sind zur Veranschaulichung ausgefüllt; die Einträge werden nicht in dein Konto übernommen.",
    back:"Zur Startseite", demo:"Eingeschränkte Demo öffnen", signup:"Kostenlos eigenen Workspace erstellen",
    project:"Beispielprojekt: Büro-Netzwerk mit Windows, Linux und Docker",
    caution:"Ausschließlich Beispieldaten: keine Verbindung zu echten Servern, keine produktiven Zugangsdaten und keine tatsächliche Systemüberwachung.",
    sections:[
      {label:"01 · IT-Labor",title:"Netzwerk-Labor anlegen",intro:"Ein Labor beschreibt Ausgangslage, Ziel, Umgebung und Ergebnis. So bleibt die Übung auch Wochen später nachvollziehbar.", fields:[["Labor-ID","LAB-002"],["Titel","Kleines Firmennetz einrichten"],["Thema","Active Directory, DNS, DHCP und VLAN"],["Umgebung","Virtuelle Testumgebung (Hyper-V)"],["Ziel","Clients in VLAN 20 können den Domänencontroller per DNS finden."],["Status","Abgeschlossen"]],detail:"Prüfschritt: nslookup dc01.lab.test zeigt im Übungsnetz auf 192.168.20.10."},
      {label:"02 · Systeme",title:"Systeme dokumentieren",intro:"Alle Geräte und Dienste erhalten klare Rollen und Adressen. Die Werte sind bewusst nur für dieses Übungsbeispiel gewählt.",fields:[["Domänencontroller","dc01.lab.test · Windows Server · 192.168.20.10"],["Linux-Server","web01.lab.test · Ubuntu Server · 192.168.20.20"],["Docker-Host","docker01.lab.test · 192.168.20.30"],["Router / Gateway","192.168.20.1"],["DNS-Server","192.168.20.10"],["Netz / VLAN","192.168.20.0/24 · VLAN 20"]],detail:"Zusammenhang: Der Client benutzt den internen DNS-Server, damit er AD-Dienste im Lab findet."},
      {label:"03 · Befehle",title:"Befehle mit Kontext speichern",intro:"Zu einem Befehl gehören Plattform, Zweck und das erwartete Ergebnis – nicht nur die Syntax.",fields:[["Plattform","Windows PowerShell"],["Befehl","Resolve-DnsName dc01.lab.test"],["Kategorie","Netzwerk / DNS"],["Zweck","Prüfen, ob der Domänencontroller aufgelöst wird"],["Erwartetes Ergebnis","192.168.20.10"],["Verwendung","DNS-Test nach der Serverkonfiguration"]],detail:"Ausführung nur innerhalb der eigenen Testumgebung; die Seite führt keine Befehle aus."},
      {label:"04 · Fehleranalyse",title:"Fehler strukturiert beheben",intro:"Das Muster macht Diagnose, Ursache, Lösung und Kontrolle transparent.",fields:[["Symptom","Client findet dc01.lab.test nicht"],["Betroffener Dienst","DNS / Active Directory"],["Diagnose","ipconfig /all und nslookup prüfen"],["Ursache","Falscher DNS-Server in der Client-Konfiguration"],["Lösung","DNS-Server auf 192.168.20.10 setzen"],["Ergebnis","Namensauflösung im Lab erfolgreich"]],detail:"Lernprinzip: Erst Ursache verifizieren, danach Änderung durchführen und erneut testen."},
      {label:"05 · Docker-Dienste",title:"Container mit Parametern erfassen",intro:"Docker-Dokumentation sollte Image, Container, Ports und Startverfahren zusammenhalten.",fields:[["Dienst","Nginx Webserver"],["Host","docker01.lab.test"],["Image","nginx:stable"],["Container","web-lab"],["Portzuordnung","8080:80"],["Start","docker run -d --name web-lab -p 8080:80 nginx:stable"]],detail:"Im Beispiel ist der Webserver über http://192.168.20.30:8080 aus dem Übungsnetz vorgesehen."},
      {label:"06 · Praxisnotizen",title:"Erkenntnisse festhalten",intro:"Persönliche Notizen verbinden Konfiguration, Tests und den nächsten Lernschritt.",fields:[["Titel","DNS und Domänenzugriff überprüfen"],["Bereich","Netzwerk / Windows Server"],["Beobachtung","DNS-Auswahl am Client beeinflusst die AD-Suche."],["Ergebnis","Fehler nach Anpassung des DNS-Servers behoben"],["Nächster Schritt","GPO testen und Benutzerrechte dokumentieren"],["Verknüpftes Labor","LAB-002"]],detail:"Diese Notiz ist nur ein Beispiel. Eigene Notizen lassen sich nach Registrierung speichern."},
    ],
    footerTitle:"Bereit für deinen eigenen FISI-Workspace?",
    footerText:"In der kostenlosen Vollversion kannst du eigene Labore, Systeme, Befehle und Notizen anlegen und verwalten.",
    linkRef:"Zur passenden Demo-Rubrik", smallPrint:"Beispielanzeige: Die ausgefüllten Werte werden nicht an Supabase übertragen und nicht als tatsächliche Kundendaten ausgegeben.",
  },
  az: {
    tag:"TAM DOLDURULMUŞ NÜMUNƏ İŞ MÜHİTİ · YALNIZ BAXIŞ",
    title:"Tam hazırlanmış sistem inteqrasiyası nümunəsi — addım-addım izahla.",
    lead:"Bu səhifədə bir şəbəkə laboratoriyasının FISI LabBook-da necə sənədləşdirildiyi əlaqəli, uydurma nümunə məlumatlarla göstərilir. Bütün xanalar izah məqsədilə doldurulub; bu qeydlər sənin hesabına köçürülmür.",
    back:"Ana səhifəyə qayıt",demo:"Məhdud demonu aç",signup:"Pulsuz şəxsi iş mühiti yarat",
    project:"Nümunə layihə: Windows, Linux və Docker ilə ofis şəbəkəsi",
    caution:"Bu səhifədə yalnız nümunə məlumatları göstərilir: real serverlərə qoşulmur, işlək sistemləri izləmir və həqiqi giriş məlumatları saxlamır.",
    sections:[
      {label:"01 · IT laboratoriyası",title:"Şəbəkə laboratoriyasını yarat",intro:"Laboratoriyada başlanğıc vəziyyəti, məqsəd, mühit və nəticə qeyd olunur. Bu, təcrübəni sonradan da anlamağa kömək edir.",fields:[["Laboratoriya ID-si","LAB-002"],["Başlıq","Kiçik müəssisə şəbəkəsinin qurulması"],["Mövzu","Active Directory, DNS, DHCP və VLAN"],["Mühit","Virtual test mühiti (Hyper-V)"],["Məqsəd","VLAN 20-dəki klientlər domen kontrollerini DNS vasitəsilə tapsın."],["Status","Tamamlanıb"]],detail:"Yoxlama: nslookup dc01.lab.test nümunə şəbəkədə 192.168.20.10 ünvanını qaytarır."},
      {label:"02 · Sistemlər",title:"Sistemləri sənədləşdir",intro:"Hər cihazın və xidmətin aydın rolu, ünvanı olur. Göstərilən ünvanlar yalnız bu test nümunəsinə aiddir.",fields:[["Domen kontrolleri","dc01.lab.test · Windows Server · 192.168.20.10"],["Linux server","web01.lab.test · Ubuntu Server · 192.168.20.20"],["Docker host","docker01.lab.test · 192.168.20.30"],["Router / Gateway","192.168.20.1"],["DNS server","192.168.20.10"],["Şəbəkə / VLAN","192.168.20.0/24 · VLAN 20"]],detail:"Əlaqə: Klient daxili DNS serverindən istifadə edərək laboratoriyadakı AD xidmətlərini tapa bilir."},
      {label:"03 · Əmrlər",title:"Əmrləri izahı ilə saxla",intro:"Əmr qeydinə təkcə sintaksis yox, platforma, məqsəd və gözlənilən nəticə də daxil edilməlidir.",fields:[["Platforma","Windows PowerShell"],["Əmr","Resolve-DnsName dc01.lab.test"],["Kateqoriya","Şəbəkə / DNS"],["Məqsəd","Domen kontrollerinin adının həllini yoxlamaq"],["Gözlənilən nəticə","192.168.20.10"],["İstifadə yeri","Server konfiqurasiyasından sonra DNS testi"]],detail:"Əmri yalnız öz test mühitində icra et; bu səhifə heç bir komanda işlətmir."},
      {label:"04 · Xəta təhlili",title:"Xətanı sistemli həll et",intro:"Bu nümunə diaqnostikanı, səbəbi, düzəlişi və son yoxlamanı ardıcıl göstərir.",fields:[["Əlamət","Klient dc01.lab.test ünvanını tapa bilmir"],["Xidmət","DNS / Active Directory"],["Diaqnostika","ipconfig /all və nslookup yoxla"],["Səbəb","Klientdə yanlış DNS server ünvanı"],["Həll","DNS serveri 192.168.20.10 olaraq təyin et"],["Nəticə","Nümunə laboratoriyasında ad həlli uğurludur"]],detail:"Prinsip: Əvvəl səbəbi təsdiqlə, sonra dəyişiklik et və yenidən yoxla."},
      {label:"05 · Docker xidmətləri",title:"Konteyneri parametrləri ilə qeyd et",intro:"Docker sənədində image, container, portlar və başlatma üsulu birlikdə saxlanmalıdır.",fields:[["Xidmət","Nginx veb-server"],["Host","docker01.lab.test"],["Image","nginx:stable"],["Konteyner","web-lab"],["Port uyğunluğu","8080:80"],["Başlatma əmri","docker run -d --name web-lab -p 8080:80 nginx:stable"]],detail:"Nümunədə veb-serverin test şəbəkəsindən http://192.168.20.30:8080 vasitəsilə açılması nəzərdə tutulur."},
      {label:"06 · Praktiki qeydlər",title:"Öyrəndiklərini sənədləşdir",intro:"Şəxsi qeydlər konfiqurasiya, test və növbəti öyrənmə addımı arasında əlaqə yaradır.",fields:[["Başlıq","DNS və domen bağlantısının yoxlanması"],["Sahə","Şəbəkə / Windows Server"],["Müşahidə","Klientin DNS seçimi AD axtarışına təsir edir."],["Nəticə","DNS ünvanı düzəldildikdən sonra xəta aradan qalxdı"],["Növbəti addım","GPO testləri və istifadəçi hüquqları"],["Əlaqəli laboratoriya","LAB-002"]],detail:"Bu, yalnız nümunə qeyddir. Öz qeydlərini qeydiyyatdan sonra saxlaya bilərsən."},
    ],
    footerTitle:"Öz şəxsi IT iş mühitini yaratmağa hazırsan?",
    footerText:"Pulsuz tam versiyada şəxsi laboratoriyalarını, sistemlərini, əmrlərini və qeydlərini yarada və idarə edə bilərsən.",
    linkRef:"Uyğun demo bölməsinə keç",smallPrint:"Nümunə görünüşü: Bu məlumatlar verilənlər bazasına göndərilmir və real istifadəçi məlumatları kimi təqdim olunmur.",
  }
} as const;

const icons=[FlaskConical,Server,Terminal,Wrench,Container,BookOpen];
const links=["/labore","/systeme","/befehle","/fehleranalyse","/docker-dienste","/praxisnotizen"];

export default function ExampleWorkspacePage() {
  const {language}=useLanguage();
  const t=copy[language];
  return <div className="max-w-7xl mx-auto px-5 sm:px-7 py-10 sm:py-14">
    <Link href="/" className="text-sm font-bold text-blue-700 hover:underline">← {t.back}</Link>
    <div className="mt-7 p-6 sm:p-8 rounded-[24px] border border-blue-200 bg-gradient-to-br from-[#e8f4ff] via-white to-[#f1f8ff]">
      <p className="uppercase text-xs font-bold tracking-[.12em] text-blue-700 flex items-center gap-2"><Layers3 size={17}/>{t.tag}</p>
      <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#15365e] max-w-4xl">{t.title}</h1>
      <p className="mt-4 text-sm leading-7 text-[#55738e] max-w-4xl">{t.lead}</p>
      <div className="flex flex-wrap gap-3 mt-6"><Link href="/dashboard" className="rounded-xl px-4 py-2.5 text-white text-sm font-bold bg-blue-700 hover:bg-blue-800">{t.demo} <ArrowRight size={15} className="inline"/></Link><Link href="/registrieren" className="rounded-xl px-4 py-2.5 bg-white border border-blue-200 text-blue-700 text-sm font-bold hover:bg-blue-50">{t.signup}</Link></div>
    </div>
    <div role="note" className="mt-5 rounded-xl px-4 py-3 border border-blue-200 bg-blue-50 text-sm text-[#385e80] flex gap-3"><LockKeyhole size={19} className="shrink-0 text-blue-700"/>{t.caution}</div>
    <h2 className="text-xl font-extrabold text-[#153f67] mt-9 mb-5">{t.project}</h2>
    <div className="grid lg:grid-cols-2 gap-5">
      {t.sections.map((section,i)=>{const Icon=icons[i];return <article key={section.label} className="fisi-card rounded-[22px] overflow-hidden flex flex-col">
        <div className="p-5 sm:p-6 border-b border-blue-100 bg-[#f8fbff]">
          <p className="text-xs font-bold text-blue-700 flex items-center gap-2"><Icon size={19}/>{section.label}</p>
          <h3 className="mt-3 text-xl font-extrabold text-[#173e66]">{section.title}</h3>
          <p className="text-sm leading-relaxed mt-2 text-[#5d778d]">{section.intro}</p>
        </div>
        <dl className="px-5 sm:px-6 py-3 flex-1">
          {section.fields.map(([k,v])=><div key={k} className="grid grid-cols-[110px_1fr] sm:grid-cols-[150px_1fr] gap-3 py-2.5 border-b border-blue-50 last:border-0"><dt className="text-xs font-bold text-[#4b7191]">{k}</dt><dd className="text-xs sm:text-sm font-medium text-[#193d60] break-words">{v}</dd></div>)}
        </dl>
        <p className="mx-5 sm:mx-6 mb-4 p-3 bg-[#edf6ff] rounded-xl text-xs leading-relaxed text-[#38688d]"><CheckCircle2 size={15} className="inline mr-2 text-blue-700"/>{section.detail}</p>
        <Link href={links[i]} className="mx-5 sm:mx-6 mb-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">{t.linkRef}<ArrowRight size={15}/></Link>
      </article>})}
    </div>
    <div className="mt-9 rounded-[22px] bg-[#e8f4ff] border border-blue-200 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
      <div><h2 className="text-xl font-extrabold text-[#123d66]">{t.footerTitle}</h2><p className="mt-2 text-sm text-[#54738e]">{t.footerText}</p></div>
      <Link href="/registrieren" className="px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold text-center whitespace-nowrap">{t.signup}</Link>
    </div>
    <p className="mt-5 text-center text-xs text-[#6d879d]">{t.smallPrint}</p>
  </div>;
}
