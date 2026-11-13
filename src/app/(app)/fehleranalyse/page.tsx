"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { demoText } from "@/lib/demo-i18n";

import { T, useT, translate } from "@/components/TranslatedText";

import { useEffect, useState, useMemo } from "react";
import {
  Bug, AlertCircle, Search as SearchIcon, Lightbulb, Target, Tag,
  Plus, Pencil, Trash2, CheckCircle, Copy, Lock,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import EmptyPersonalState from "@/components/EmptyPersonalState";
import ReferenceSection from "@/components/ReferenceSection";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import TroubleshootingForm, { type TroubleshootingFormData } from "@/components/TroubleshootingForm";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { FisiTroubleshootingCase, FisiUserTroubleshootingCase } from "@/lib/types";

type DifficultyConfig = { label: string; className: string };

function getDifficultyConfig(d: string | null): DifficultyConfig {
  switch (d?.toLowerCase()) {
    case "einfach":
    case "leicht":
    case "easy":
      return { label: d === "einfach" ? "Einfach" : "Leicht", className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20" };
    case "mittel":
    case "medium":
      return { label: "Mittel", className: "bg-amber-500/15 text-amber-700 border-amber-500/20" };
    case "fortgeschritten":
    case "schwer":
    case "hard":
      return { label: d === "schwer" ? "Schwer" : "Fortgeschritten", className: "bg-red-500/15 text-red-700 border-red-500/20" };
    default:
      return { label: d ?? "—", className: "bg-blue-50 text-slate-600 border-slate-200" };
  }
}

function Step({
  icon: Icon, label, value, accent = "slate",
}: {
  icon: React.ElementType; label: string; value: string | null; accent?: string;
}) {
  if (!value) return null;
  const colors: Record<string, string> = {
    slate: "bg-slate-500/10 border-slate-500/20 text-slate-600",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-700",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-700",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700",
  };
  return (
    <div className="flex gap-3">
      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${colors[accent] ?? colors.slate}`}>
        <Icon size={13} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1"><T>{label}</T></p>
        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{value}</p>
      </div>
    </div>
  );
}

type NotifType = { kind: "success" | "error"; message: string };

function UserTroubleshootingCard({
  item, onEdit, onDelete,
}: {
  item: FisiUserTroubleshootingCase;
  onEdit: (i: FisiUserTroubleshootingCase) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const diff = getDifficultyConfig(item.difficulty);
  const translateUI = useT();

  return (
    <div className="rounded-xl border border-blue-500/10 bg-white p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
          {item.category && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 mt-1">
              <Tag size={10} />{item.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {item.difficulty && (
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${diff.className}`}>
              {translateUI(diff.label)}
            </span>
          )}
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-700"><T>Löschen?</T></span>
              <button onClick={() => onDelete(item.id)}
                className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-700 hover:bg-red-500/25 text-xs font-medium transition-colors"><T>Ja</T></button>
              <button onClick={() => setConfirmDelete(false)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 text-slate-600 hover:bg-blue-50 text-xs font-medium transition-colors"><T>Nein</T></button>
            </div>
          ) : (
            <>
              <button onClick={() => onEdit(item)} aria-label="Bearbeiten"
                className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-500/10 transition-colors">
                <Pencil size={13} />
              </button>
              <button onClick={() => setConfirmDelete(true)} aria-label="Löschen"
                className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-500/10 transition-colors">
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Step icon={AlertCircle} label="Symptome" value={item.symptoms} accent="amber" />
        <Step icon={SearchIcon} label="Prüfschritte" value={item.checks} accent="blue" />
        <Step icon={Lightbulb} label="Ursache" value={item.root_cause} accent="slate" />
        <Step icon={Target} label="Lösung" value={item.solution} accent="emerald" />
      </div>

      {item.result && (
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/15 px-4 py-3">
          <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1"><T>Ergebnis</T></p>
          <p className="text-xs text-emerald-800 leading-relaxed">{item.result}</p>
        </div>
      )}
    </div>
  );
}

function DemoCaseCard({ c, user, onCopied }: {
  c: FisiTroubleshootingCase;
  user: import("@supabase/supabase-js").User | null;
  onCopied: (msg: string) => void;
}) {
  const diff = getDifficultyConfig(c.difficulty);
  const [copying, setCopying] = useState(false);
  const { language } = useLanguage();

  async function handleCopy() {
    if (!user || !supabase) return;
    setCopying(true);
    const { error: err } = await supabase.from("fisi_user_troubleshooting_cases").insert({
      user_id: user.id,
      title: c.title,
      category: c.category,
      difficulty: c.difficulty,
      symptoms: c.symptoms,
      checks: c.checks,
      root_cause: c.root_cause,
      solution: c.solution,
      result: c.result,
    });
    setCopying(false);
    if (err) { onCopied(language === "de" ? "Fehler beim Übernehmen." : "Şablon köçürülmədi."); return; }
    onCopied(language === "de" ? "Vorlage wurde in Ihren persönlichen Arbeitsbereich übernommen." : "Şablon şəxsi iş mühitinə köçürüldü.");
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-blue-50 hover:border-slate-200 transition-all duration-150 p-5 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{demoText(c.title, language)}</h3>
          {c.category && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 mt-1">
              <Tag size={10} />{demoText(c.category, language)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {c.difficulty && (
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${diff.className}`}>
              {translate(diff.label, language)}
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Step icon={AlertCircle} label="Symptome" value={demoText(c.symptoms, language)} accent="amber" />
        <Step icon={SearchIcon} label="Prüfschritte" value={demoText(c.checks, language)} accent="blue" />
        <Step icon={Lightbulb} label="Ursache" value={demoText(c.root_cause, language)} accent="slate" />
        <Step icon={Target} label="Lösung" value={demoText(c.solution, language)} accent="emerald" />
      </div>
      {c.result && (
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/15 px-4 py-3">
          <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-1"><T>Ergebnis</T></p>
          <p className="text-xs text-emerald-800 leading-relaxed">{demoText(c.result, language)}</p>
        </div>
      )}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Demo</span>
        {user ? (
          <button onClick={handleCopy} disabled={copying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/35 text-xs font-medium text-blue-700 hover:text-blue-800 transition-all disabled:opacity-50">
            <Copy size={11} />
            {copying ? (language === "de" ? "Wird übernommen…" : "Köçürülür…") : (language === "de" ? "Als Vorlage übernehmen" : "Şablon kimi götür")}
          </button>
        ) : (
          <button disabled className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 cursor-not-allowed">
            <Lock size={11} /><T>Anmeldung erforderlich</T></button>
        )}
      </div>
    </div>
  );
}

// ── ChecklistHelper ────────────────────────────────────────────────────────

const CHECKLISTS: Record<string, string[]> = {
  "DNS-Problem": [
    "1. IP-Konfiguration mit ipconfig /all prüfen",
    "2. DNS-Server kontrollieren (auf DC zeigen?)",
    "3. Domänencontroller anpingen",
    "4. nslookup für Domänennamen ausführen",
    "5. DNS-Zonen und Einträge prüfen",
    "6. Event Viewer auf DNS-Fehler prüfen (DNS Server, System)",
    "7. DNS-Dienst neu starten: net stop dns && net start dns",
    "8. DNS-Cache leeren: ipconfig /flushdns",
  ],
  "Domänenbeitritt": [
    "1. Netzwerkverbindung prüfen (ping zu DC)",
    "2. DNS-Server auf Domänencontroller zeigen lassen",
    "3. Zeit/Datum zwischen Client und DC prüfen (max. 5 Min. Abweichung)",
    "4. Domänennamen mit nslookup testen",
    "5. Erreichbarkeit des DC prüfen: nltest /dsgetdc:<domäne>",
    "6. Firewall-Ports prüfen (TCP 88, 135, 389, 445)",
    "7. Computerkonto im AD prüfen (ggf. zurücksetzen)",
    "8. Domänenbeitritt erneut versuchen und Ereignisprotokoll prüfen",
  ],
  "DHCP-Problem": [
    "1. IP-Konfiguration mit ipconfig /all prüfen (APIPA-Adresse 169.254.x.x?)",
    "2. DHCP-Dienst auf dem Server prüfen (sc query dhcpserver)",
    "3. DHCP-Leases und Bereichsgrenzen kontrollieren",
    "4. Netzwerkkabel und Switchport prüfen",
    "5. Firewall-Regeln für DHCP prüfen (UDP 67/68)",
    "6. ipconfig /release && ipconfig /renew ausführen",
    "7. DHCP-Konflikt prüfen (doppelte IP?)",
    "8. DHCP-Ereignislog prüfen: Ereignisanzeige → System",
  ],
  "Active Directory Replikation": [
    "1. Replikationsstatus prüfen: repadmin /replsummary",
    "2. Replikationsfehler anzeigen: repadmin /showrepl",
    "3. DC-Konnektivität prüfen: dcdiag /test:connectivity",
    "4. Netlogon-Dienst prüfen: sc query netlogon",
    "5. DNS-Konfiguration auf allen DCs prüfen",
    "6. Zeitsynchronisation prüfen: w32tm /query /status",
    "7. Firewall zwischen DCs prüfen (TCP/UDP 389, 636, 3268, 49152–65535)",
    "8. AD-Replikation erzwingen: repadmin /syncall /AdeP",
  ],
  "Gruppenrichtlinie / GPO": [
    "1. GPO-Anwendung prüfen: gpresult /r",
    "2. Detailliertes HTML-Ergebnis: gpresult /h C:\\gp.html",
    "3. GPO-Aktualisierung erzwingen: gpupdate /force",
    "4. Netzwerkverbindung zum DC prüfen",
    "5. Computerrichtlinien und Benutzerrichtlinien getrennt prüfen",
    "6. Sicherheitsfilterung der GPO prüfen (Benutzer/Computer in Gruppe?)",
    "7. WMI-Filter der GPO prüfen",
    "8. Ereignisprotokoll: Anwendung → Gruppenrichtlinie-Ereignisse",
  ],
  "Windows-Dienst startet nicht": [
    "1. Dienststatus prüfen: sc query <dienstname>",
    "2. Ereignisprotokoll prüfen: Ereignisanzeige → System → Fehler",
    "3. Dienstabhängigkeiten prüfen: sc qc <dienstname>",
    "4. Abhängige Dienste starten und erneut versuchen",
    "5. Anmeldekonto des Dienstes prüfen (Kennwort abgelaufen?)",
    "6. Berechtigungen auf Programmverzeichnis prüfen",
    "7. Dienst manuell starten: net start <dienstname>",
    "8. Systemdateiintegrität prüfen: sfc /scannow",
  ],
  "Linux-Dienst startet nicht": [
    "1. Dienststatus prüfen: systemctl status <dienst>",
    "2. Logs lesen: journalctl -u <dienst> -n 50 --no-pager",
    "3. Konfigurationsdatei auf Syntaxfehler prüfen",
    "4. Portkonflikt prüfen: ss -tulpen | grep <port>",
    "5. Berechtigungen auf Konfig- und Log-Dateien prüfen",
    "6. Abhängige Dienste prüfen (z. B. Datenbank, Netzwerk)",
    "7. Dienst manuell mit Ausgabe starten: <dienstpfad> --debug",
    "8. SELinux/AppArmor-Logs prüfen: ausearch -m avc -ts today",
  ],
  "Webserver nicht erreichbar": [
    "1. Dienststatus prüfen: systemctl status nginx / apache2",
    "2. Ports prüfen: ss -tulpen | grep -E '80|443'",
    "3. Firewall-Regeln prüfen: ufw status / iptables -L",
    "4. Logs prüfen: /var/log/nginx/error.log oder /var/log/apache2/error.log",
    "5. Konfiguration validieren: nginx -t / apachectl configtest",
    "6. TLS-Zertifikat auf Ablauf prüfen: openssl s_client -connect host:443",
    "7. DNS-Auflösung des Domänennamens prüfen: nslookup <domain>",
    "8. Upstream/Backend-Verbindung prüfen (Proxy, App-Server)",
  ],
  "Docker-Problem": [
    "1. docker ps -a – Containerstatus prüfen",
    "2. docker logs <container> – Fehlerausgabe lesen",
    "3. docker inspect <container> – Netzwerk und Mounts prüfen",
    "4. Portbelegung mit netstat / ss prüfen",
    "5. docker compose config – Compose-Datei validieren",
    "6. Docker-Daemon-Status prüfen: systemctl status docker",
    "7. Volumes und Berechtigungen prüfen",
    "8. Image neu bauen und Container neu starten",
  ],
  "SSH-Problem": [
    "1. SSH-Dienst auf dem Server prüfen: systemctl status ssh",
    "2. Firewall-Regeln für Port 22 prüfen",
    "3. Verbindung mit Verbose-Ausgabe testen: ssh -vvv user@host",
    "4. authorized_keys und Dateiberechtigungen prüfen (chmod 600)",
    "5. /var/log/auth.log auf Fehlermeldungen prüfen",
    "6. SSH-Daemon-Konfiguration prüfen: sshd -T",
    "7. Netzwerkverbindung zum Server prüfen",
    "8. SSH-Schlüsselpaar neu generieren falls beschädigt",
  ],
  "Netzwerk allgemein": [
    "1. Physische Verbindung prüfen (Kabel, Switch, WLAN)",
    "2. IP-Konfiguration prüfen: ipconfig /all oder ip a",
    "3. Standard-Gateway anpingen",
    "4. DNS-Auflösung testen: nslookup <domain> / Resolve-DnsName <domain>",
    "5. Routing-Pfad verfolgen: tracert / traceroute",
    "6. Firewall-Regeln auf Client und Server prüfen",
    "7. ARP-Cache prüfen: arp -a",
    "8. NIC-Fehler prüfen: ifconfig / ip -s link",
  ],
};

const CHECKLISTS_AZ: Record<string, string[]> = {
  "DNS-Problem": [
    "1. IP konfiqurasiyasını ipconfig /all ilə yoxla",
    "2. DNS serverinin domen kontrollerinə (DC) yönləndiyini yoxla",
    "3. Domen kontrollerinə ping göndər",
    "4. Domen adını nslookup ilə yoxla",
    "5. DNS zonalarını və qeydlərini yoxla",
    "6. Event Viewer-də DNS xətalarını yoxla (DNS Server, System)",
    "7. DNS xidmətini yenidən başlat: net stop dns && net start dns",
    "8. DNS keşini təmizlə: ipconfig /flushdns"
  ],
  "Domänenbeitritt": [
    "1. Şəbəkə əlaqəsini yoxla (DC-yə ping)",
    "2. DNS serverini domen kontrollerinə yönləndir",
    "3. Klient və DC arasında tarix/saat fərqini yoxla (maksimum 5 dəqiqə)",
    "4. Domen adını nslookup ilə yoxla",
    "5. DC-nin əlçatanlığını yoxla: nltest /dsgetdc:<domäne>",
    "6. Firewall portlarını yoxla (TCP 88, 135, 389, 445)",
    "7. AD-də kompüter hesabını yoxla (lazımdırsa sıfırla)",
    "8. Domenə yenidən qoşul və hadisə jurnalını yoxla"
  ],
  "DHCP-Problem": [
    "1. IP konfiqurasiyasını ipconfig /all ilə yoxla (APIPA 169.254.x.x varmı?)",
    "2. Serverdə DHCP xidmətini yoxla (sc query dhcpserver)",
    "3. DHCP icarələrini (leases) və ünvan diapazonunu yoxla",
    "4. Şəbəkə kabelini və switch portunu yoxla",
    "5. DHCP üçün firewall qaydalarını yoxla (UDP 67/68)",
    "6. ipconfig /release && ipconfig /renew əmrlərini icra et",
    "7. DHCP konfliktini yoxla (təkrarlanan IP?)",
    "8. DHCP hadisə jurnalını yoxla: Event Viewer → System"
  ],
  "Active Directory Replikation": [
    "1. Replikasiya vəziyyətini yoxla: repadmin /replsummary",
    "2. Replikasiya xətalarını göstər: repadmin /showrepl",
    "3. DC bağlantısını yoxla: dcdiag /test:connectivity",
    "4. Netlogon xidmətini yoxla: sc query netlogon",
    "5. Bütün domen kontrollerlərində DNS konfiqurasiyasını yoxla",
    "6. Saat sinxronizasiyasını yoxla: w32tm /query /status",
    "7. DC-lər arasındakı firewall qaydalarını yoxla (TCP/UDP 389, 636, 3268, 49152–65535)",
    "8. AD replikasiyasını məcburi başlat: repadmin /syncall /AdeP"
  ],
  "Gruppenrichtlinie / GPO": [
    "1. GPO tətbiqini yoxla: gpresult /r",
    "2. Ətraflı HTML hesabatı yarat: gpresult /h C:\\gp.html",
    "3. GPO yenilənməsini məcburi başlat: gpupdate /force",
    "4. Domen kontrollerinə şəbəkə bağlantısını yoxla",
    "5. Kompüter və istifadəçi siyasətlərini ayrılıqda yoxla",
    "6. GPO təhlükəsizlik filtrlərini yoxla (istifadəçi/kompüter qrupdadırmı?)",
    "7. GPO-nun WMI filtrini yoxla",
    "8. Hadisə jurnalını yoxla: Application → Group Policy"
  ],
  "Windows-Dienst startet nicht": [
    "1. Xidmətin vəziyyətini yoxla: sc query <dienstname>",
    "2. Hadisə jurnalındakı xətaları yoxla: Event Viewer → System",
    "3. Xidmətin asılılıqlarını yoxla: sc qc <dienstname>",
    "4. Asılı xidmətləri başlat və yenidən cəhd et",
    "5. Xidmət hesabını yoxla (şifrəsinin vaxtı bitibmi?)",
    "6. Proqram qovluğuna giriş hüquqlarını yoxla",
    "7. Xidməti əl ilə başlat: net start <dienstname>",
    "8. Sistem fayllarının bütövlüyünü yoxla: sfc /scannow"
  ],
  "Linux-Dienst startet nicht": [
    "1. Xidmət vəziyyətini yoxla: systemctl status <dienst>",
    "2. Jurnal qeydlərini oxu: journalctl -u <dienst> -n 50 --no-pager",
    "3. Konfiqurasiya faylında sintaksis xətalarını yoxla",
    "4. Port konfliktini yoxla: ss -tulpen | grep <port>",
    "5. Konfiqurasiya və jurnal fayllarının icazələrini yoxla",
    "6. Asılı xidmətləri yoxla (məsələn, verilənlər bazası və şəbəkə)",
    "7. Xidməti diaqnostik çıxışla əl ilə başlat: <dienstpfad> --debug",
    "8. SELinux/AppArmor jurnalını yoxla: ausearch -m avc -ts today"
  ],
  "Webserver nicht erreichbar": [
    "1. Veb-server xidmətinin vəziyyətini yoxla: systemctl status nginx / apache2",
    "2. Portları yoxla: ss -tulpen | grep -E '80|443'",
    "3. Firewall qaydalarını yoxla: ufw status / iptables -L",
    "4. Jurnalları yoxla: /var/log/nginx/error.log və ya /var/log/apache2/error.log",
    "5. Konfiqurasiyanı yoxla: nginx -t / apachectl configtest",
    "6. TLS sertifikatının etibarlılıq müddətini yoxla: openssl s_client -connect host:443",
    "7. Domenin DNS həllini yoxla: nslookup <domain>",
    "8. Upstream/backend bağlantısını yoxla (proxy, tətbiq serveri)"
  ],
  "Docker-Problem": [
    "1. docker ps -a ilə konteynerin vəziyyətini yoxla",
    "2. docker logs <container> ilə xəta jurnalını oxu",
    "3. docker inspect <container> ilə şəbəkəni və mount-ları yoxla",
    "4. netstat / ss ilə portların istifadəsini yoxla",
    "5. docker compose config ilə Compose faylını yoxla",
    "6. Docker daemonunun vəziyyətini yoxla: systemctl status docker",
    "7. Volume-ları və giriş icazələrini yoxla",
    "8. Image-i yenidən qur və konteyneri yenidən başlat"
  ],
  "SSH-Problem": [
    "1. Serverdə SSH xidmətini yoxla: systemctl status ssh",
    "2. Port 22 üçün firewall qaydalarını yoxla",
    "3. Ətraflı çıxışla bağlantını yoxla: ssh -vvv user@host",
    "4. authorized_keys faylını və icazələri yoxla (chmod 600)",
    "5. /var/log/auth.log faylında xətaları yoxla",
    "6. SSH daemon konfiqurasiyasını yoxla: sshd -T",
    "7. Serverə şəbəkə bağlantısını yoxla",
    "8. Zədələnibsə SSH açar cütünü yenidən yarat"
  ],
  "Netzwerk allgemein": [
    "1. Fiziki bağlantını yoxla (kabel, switch, WLAN)",
    "2. IP konfiqurasiyasını yoxla: ipconfig /all və ya ip a",
    "3. Standart gateway-ə ping göndər",
    "4. DNS həllini yoxla: nslookup <domain> / Resolve-DnsName <domain>",
    "5. Marşrutu izlə: tracert / traceroute",
    "6. Klient və serverdə firewall qaydalarını yoxla",
    "7. ARP keşini yoxla: arp -a",
    "8. Şəbəkə kartının (NIC) xətalarını yoxla: ifconfig / ip -s link"
  ]
};

function ChecklistHelper({ onInsert }: { onInsert: (checklist: string) => void }) {
  const translateUI = useT();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const types = Object.keys(CHECKLISTS);
  const activeCL = selected ? (language === "az" ? CHECKLISTS_AZ[selected] : CHECKLISTS[selected]) : null;

  return (
    <div className="mb-5">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-xs font-medium text-amber-700 hover:text-amber-800 transition-all"
        >
          <SearchIcon size={13} />
          Checkliste verwenden
        </button>
      ) : (
        <div className="rounded-xl border border-amber-500/15 bg-[#fff7ed] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wider"><T>Troubleshooting-Checkliste</T></h3>
            <button onClick={() => { setOpen(false); setSelected(null); }} className="text-slate-600 hover:text-slate-700 transition-colors">
              <Plus size={14} className="rotate-45" />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-600 uppercase tracking-wider"><T>Problemtyp auswählen</T></label>
            <div className="flex flex-wrap gap-1.5">
              {types.map((t) => (
                <button key={t} onClick={() => setSelected(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selected === t
                      ? "bg-amber-600/80 text-slate-900"
                      : "bg-blue-50 text-slate-600 hover:bg-blue-50 hover:text-slate-800"
                  }`}>
                  {translateUI(t)}
                </button>
              ))}
            </div>
          </div>

          {activeCL && (
            <div className="space-y-2">
              <div className="rounded-lg bg-blue-50 border border-slate-200 p-4 space-y-1.5">
                {activeCL.map((step, i) => (
                  <p key={i} className="text-xs text-slate-700">{step}</p>
                ))}
              </div>
              <button
                onClick={() => { onInsert(activeCL.join("\n")); setOpen(false); setSelected(null); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600/80 hover:bg-amber-500/80 text-xs font-semibold text-slate-900 transition-colors"
              >
                In Prüfschritte einfügen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FehleranalysePage() {
  const translateUI = useT();
  const { user } = useAuth();

  const [cases, setCases] = useState<FisiTroubleshootingCase[]>([]);
  const [demoLoading, setDemoLoading] = useState(!supabaseConfigMissing);
  const [demoError, setDemoError] = useState(false);

  const [userCases, setUserCases] = useState<FisiUserTroubleshootingCase[] | null>(null);
  const [userCasesError, setUserCasesError] = useState(false);
  const userCasesLoading = !!user && userCases === null && !userCasesError;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editItem, setEditItem] = useState<FisiUserTroubleshootingCase | null>(null);
  const [checklistPrefill, setChecklistPrefill] = useState<string | undefined>(undefined);
  const [userQuery, setUserQuery] = useState("");
  const [notif, setNotif] = useState<NotifType | null>(null);

  function toast(kind: NotifType["kind"], message: string) {
    setNotif({ kind, message });
    setTimeout(() => setNotif(null), 4000);
  }

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;
    supabase
      .from("fisi_troubleshooting_cases")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setDemoError(true);
        else setCases(data ?? []);
        setDemoLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user || !supabase) return;
    supabase
      .from("fisi_user_troubleshooting_cases")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setUserCasesError(true);
        else setUserCases(data ?? []);
      });
  }, [user]);

  const filteredUserCases = useMemo(() => {
    if (!userQuery.trim() || !userCases) return userCases ?? [];
    const q = userQuery.toLowerCase();
    return userCases.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      (c.category ?? "").toLowerCase().includes(q) ||
      (c.difficulty ?? "").toLowerCase().includes(q)
    );
  }, [userCases, userQuery]);

  async function handleCreate(data: TroubleshootingFormData) {
    if (!supabase || !user) return;
    const { data: row, error: err } = await supabase
      .from("fisi_user_troubleshooting_cases")
      .insert({ ...data, user_id: user.id })
      .select()
      .single();
    if (err) throw err;
    setUserCases((prev) => [row, ...(prev ?? [])]);
    setShowCreateForm(false);
    toast("success", "Fehleranalyse erstellt.");
  }

  async function handleUpdate(data: TroubleshootingFormData) {
    if (!supabase || !editItem) return;
    const { data: row, error: err } = await supabase
      .from("fisi_user_troubleshooting_cases")
      .update(data)
      .eq("id", editItem.id)
      .eq("user_id", editItem.user_id)
      .select()
      .single();
    if (err) throw err;
    setUserCases((prev) => (prev ?? []).map((c) => (c.id === row.id ? row : c)));
    setEditItem(null);
    toast("success", "Fehleranalyse aktualisiert.");
  }

  async function handleDelete(id: string) {
    if (!supabase || !user) return;
    const { error: err } = await supabase
      .from("fisi_user_troubleshooting_cases")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (err) { toast("error", "Fehler beim Löschen."); return; }
    setUserCases((prev) => (prev ?? []).filter((c) => c.id !== id));
    toast("success", "Fehleranalyse gelöscht.");
  }

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  return (
    <div>
      {notif && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium transition-all ${
          notif.kind === "success"
            ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-800"
            : "bg-red-500/15 border-red-500/20 text-red-800"
        }`}>
          {notif.kind === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {translateUI(notif.message)}
        </div>
      )}

      <PageHeader
        icon={Bug}
        title={translateUI("Fehleranalyse")}
        description={translateUI("Strukturierte Troubleshooting-Fälle: Problem, Prüfung, Ursache, Lösung")}
      />

      {/* Personal workspace */}
      {user && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider"><T>Meine Fehleranalysen</T></h2>
            {!showCreateForm && (
              <button onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors">
                <Plus size={13} />Fehleranalyse hinzufügen
              </button>
            )}
          </div>

          {showCreateForm && (
            <div className="mb-5">
              <TroubleshootingForm
                prefill={checklistPrefill ? { checks: checklistPrefill } : undefined}
                key={checklistPrefill ?? "new"}
                onSave={handleCreate}
                onCancel={() => { setShowCreateForm(false); setChecklistPrefill(undefined); }}
              />
            </div>
          )}

          {userCasesLoading && <LoadingState />}
          {userCasesError && <ErrorState />}
          {!userCasesLoading && !userCasesError && userCases !== null && (
            <>
              {userCases.length > 0 && (
                <div className="mb-4 relative">
                  <SearchIcon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder={translateUI("Titel, Kategorie oder Schwierigkeit suchen...")}
                    className="w-full max-w-xl pl-10 pr-4 py-2.5 rounded-xl bg-blue-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              )}
              {userCases.length === 0 && !showCreateForm && (
                <EmptyPersonalState
                  title={translateUI("Noch keine Fehleranalysen")}
                  description={translateUI("Dokumentieren Sie Troubleshooting-Fälle strukturiert mit Symptomen, Prüfschritten, Ursache und Lösung.")}
                  buttonLabel="Fehleranalyse hinzufügen"
                  onAction={() => setShowCreateForm(true)}
                />
              )}
              {userCases.length > 0 && filteredUserCases.length === 0 && (
                <EmptyState title={translateUI("Keine Treffer")} description={`Kein Fall gefunden für "${userQuery}".`} />
              )}
              {filteredUserCases.length > 0 && (
                <div className="space-y-5">
                  {filteredUserCases.map((item) => (
                    <UserTroubleshootingCard key={item.id} item={item} onEdit={setEditItem} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Hilfen & Vorlagen */}
      {user && (
        <div className="mb-10">
          <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4"><T>Hilfen & Vorlagen</T></h2>
          <ChecklistHelper onInsert={(cl) => {
            setChecklistPrefill(cl);
            setShowCreateForm(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} />
        </div>
      )}

      {/* Reference section */}
      <ReferenceSection title={translateUI("Referenz-Fehleranalysen")}>
        {demoLoading && <LoadingState />}
        {demoError && <ErrorState />}
        {!demoLoading && !demoError && cases.length === 0 && (
          <EmptyState title={translateUI("Keine Fehleranalysen vorhanden")} description={translateUI("Es wurden noch keine Troubleshooting-Fälle angelegt.")} />
        )}
        {!demoLoading && !demoError && cases.length > 0 && (
          <div className="space-y-5">
            {cases.map((c) => (
              <DemoCaseCard key={c.id} c={c} user={user}
                onCopied={(msg) => toast("success", msg)} />
            ))}
          </div>
        )}
      </ReferenceSection>

      {/* Edit modal */}
      {editItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TroubleshootingForm
              item={editItem}
              onSave={handleUpdate}
              onCancel={() => setEditItem(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
