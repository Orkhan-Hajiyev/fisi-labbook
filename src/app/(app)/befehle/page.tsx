"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Terminal, Search, Monitor, Tag, Plus, Pencil, Trash2,
  CheckCircle, AlertCircle, Copy, Lock,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import EmptyPersonalState from "@/components/EmptyPersonalState";
import ReferenceSection from "@/components/ReferenceSection";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import CommandForm, { type CommandFormData } from "@/components/CommandForm";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { FisiCommand, FisiUserCommand } from "@/lib/types";

function InlineCode({ children }: { children: string }) {
  return (
    <pre className="rounded-lg bg-[#0a0c10] border border-white/5 px-4 py-3 text-sm text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

type NotifType = { kind: "success" | "error"; message: string };

function UserCommandCard({
  cmd,
  onEdit,
  onDelete,
}: {
  cmd: FisiUserCommand;
  onEdit: (c: FisiUserCommand) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="rounded-xl border border-blue-500/10 bg-[#0f1623] p-5 space-y-4 relative">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/15 px-3 py-1 rounded-lg">
            <Terminal size={13} className="text-blue-400" />
            <code className="text-sm font-mono font-semibold text-blue-300">{cmd.command}</code>
          </div>
          {cmd.platform && (
            <span className="flex items-center gap-1 text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/15 px-2.5 py-1 rounded-lg">
              <Monitor size={10} />{cmd.platform}
            </span>
          )}
          {cmd.category && (
            <span className="flex items-center gap-1 text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/15 px-2.5 py-1 rounded-lg">
              <Tag size={10} />{cmd.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400">Löschen?</span>
              <button onClick={() => onDelete(cmd.id)}
                className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 text-xs font-medium transition-colors">
                Ja
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 text-xs font-medium transition-colors">
                Nein
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => onEdit(cmd)} aria-label="Bearbeiten"
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                <Pencil size={13} />
              </button>
              <button onClick={() => setConfirmDelete(true)} aria-label="Löschen"
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {cmd.purpose && (
        <p className="text-sm text-slate-300 leading-relaxed">{cmd.purpose}</p>
      )}

      {cmd.example && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Beispiel</p>
          <InlineCode>{cmd.example}</InlineCode>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cmd.typical_use_case && (
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Typischer Anwendungsfall</p>
            <p className="text-xs text-slate-400 leading-relaxed">{cmd.typical_use_case}</p>
          </div>
        )}
        {cmd.notes && (
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Notizen</p>
            <p className="text-xs text-slate-400 leading-relaxed">{cmd.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DemoCommandCard({ cmd, user, onCopied }: {
  cmd: FisiCommand;
  user: import("@supabase/supabase-js").User | null;
  onCopied: (msg: string) => void;
}) {
  const [copying, setCopying] = useState(false);

  async function handleCopy() {
    if (!user || !supabase) return;
    setCopying(true);
    const { error: err } = await supabase.from("fisi_user_commands").insert({
      user_id: user.id,
      command: cmd.command,
      platform: cmd.platform,
      category: cmd.category,
      purpose: cmd.purpose,
      example: cmd.example,
      typical_use_case: cmd.typical_use_case,
      notes: cmd.notes,
    });
    setCopying(false);
    if (err) { onCopied("Fehler beim Übernehmen."); return; }
    onCopied("Vorlage wurde in Ihren persönlichen Arbeitsbereich übernommen.");
  }

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-150 p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/15 px-3 py-1 rounded-lg">
          <Terminal size={13} className="text-emerald-400" />
          <code className="text-sm font-mono font-semibold text-emerald-300">{cmd.command}</code>
        </div>
        {cmd.platform && (
          <span className="flex items-center gap-1 text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/15 px-2.5 py-1 rounded-lg">
            <Monitor size={10} />{cmd.platform}
          </span>
        )}
        {cmd.category && (
          <span className="flex items-center gap-1 text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/15 px-2.5 py-1 rounded-lg">
            <Tag size={10} />{cmd.category}
          </span>
        )}
      </div>
      {cmd.purpose && <p className="text-sm text-slate-300 leading-relaxed">{cmd.purpose}</p>}
      {cmd.example && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Beispiel</p>
          <InlineCode>{cmd.example}</InlineCode>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cmd.typical_use_case && (
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Typischer Anwendungsfall</p>
            <p className="text-xs text-slate-400 leading-relaxed">{cmd.typical_use_case}</p>
          </div>
        )}
        {cmd.notes && (
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Notizen</p>
            <p className="text-xs text-slate-400 leading-relaxed">{cmd.notes}</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-[10px] text-slate-700 uppercase tracking-wider font-medium">Demo</span>
        {user ? (
          <button onClick={handleCopy} disabled={copying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/35 text-xs font-medium text-blue-400 hover:text-blue-300 transition-all disabled:opacity-50">
            <Copy size={11} />
            {copying ? "Wird übernommen…" : "Als Vorlage übernehmen"}
          </button>
        ) : (
          <button disabled className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 text-[11px] text-slate-600 cursor-not-allowed">
            <Lock size={11} />
            Anmeldung erforderlich
          </button>
        )}
      </div>
    </div>
  );
}

// ── CommandHelper ─────────────────────────────────────────────────────────

const CMD_SUGGESTIONS: Record<string, Record<string, Array<{
  command: string; platform: string; category: string; purpose: string; example?: string; typical_use_case?: string;
}>>> = {
  Windows: {
    Netzwerk: [
      { command: "ipconfig /all", platform: "Windows", category: "Netzwerk", purpose: "Alle Netzwerkadapter und IP-Konfiguration anzeigen", example: "ipconfig /all", typical_use_case: "IP-Adresse, DNS-Server und Gateway ermitteln" },
      { command: "ipconfig /flushdns", platform: "Windows", category: "DNS", purpose: "DNS-Cache leeren", example: "ipconfig /flushdns", typical_use_case: "Veraltete DNS-Einträge entfernen" },
      { command: "ping <ziel>", platform: "Windows", category: "Netzwerk", purpose: "Erreichbarkeit eines Hosts prüfen", example: "ping 8.8.8.8", typical_use_case: "Netzwerkverbindung testen" },
      { command: "tracert <ziel>", platform: "Windows", category: "Netzwerk", purpose: "Netzwerkpfad zu einem Ziel verfolgen", example: "tracert google.com", typical_use_case: "Routing-Probleme diagnostizieren" },
      { command: "nslookup <domain>", platform: "Windows", category: "DNS", purpose: "DNS-Auflösung eines Domänennamens prüfen", example: "nslookup server.local", typical_use_case: "DNS-Probleme debuggen" },
      { command: "netstat -an", platform: "Windows", category: "Netzwerk", purpose: "Aktive Verbindungen und offene Ports anzeigen", example: "netstat -an | findstr :3389", typical_use_case: "Offene Ports prüfen" },
      { command: "arp -a", platform: "Windows", category: "Netzwerk", purpose: "ARP-Cache anzeigen (IP zu MAC)", example: "arp -a", typical_use_case: "Netzwerkgeräte im LAN identifizieren" },
    ],
    Dienste: [
      { command: "net start", platform: "Windows", category: "Dienste", purpose: "Alle laufenden Windows-Dienste anzeigen", example: "net start", typical_use_case: "Gestartete Dienste auflisten" },
      { command: "sc query <dienst>", platform: "Windows", category: "Dienste", purpose: "Status eines Windows-Dienstes abfragen", example: "sc query wuauserv", typical_use_case: "Dienststatus prüfen" },
      { command: "net start <dienst>", platform: "Windows", category: "Dienste", purpose: "Windows-Dienst starten", example: "net start spooler", typical_use_case: "Druckspooler starten" },
      { command: "net stop <dienst>", platform: "Windows", category: "Dienste", purpose: "Windows-Dienst stoppen", example: "net stop spooler", typical_use_case: "Dienst beenden" },
      { command: "sc qc <dienst>", platform: "Windows", category: "Dienste", purpose: "Dienstkonfiguration und Abhängigkeiten anzeigen", example: "sc qc Netlogon", typical_use_case: "Starttyp und Abhängigkeiten prüfen" },
    ],
    System: [
      { command: "systeminfo", platform: "Windows", category: "System", purpose: "Systeminformationen anzeigen", example: "systeminfo", typical_use_case: "Betriebssystem, RAM und Patches prüfen" },
      { command: "tasklist", platform: "Windows", category: "System", purpose: "Laufende Prozesse anzeigen", example: "tasklist | findstr chrome", typical_use_case: "Prozesse suchen" },
      { command: "gpupdate /force", platform: "Windows", category: "Gruppenrichtlinie", purpose: "Gruppenrichtlinien sofort erzwingen", example: "gpupdate /force", typical_use_case: "GP-Änderungen sofort anwenden" },
      { command: "gpresult /r", platform: "Windows", category: "Gruppenrichtlinie", purpose: "Angewandte Gruppenrichtlinien anzeigen", example: "gpresult /r", typical_use_case: "Prüfen welche GPOs für Benutzer/Computer gelten" },
      { command: "gpresult /h C:\\gp.html", platform: "Windows", category: "Gruppenrichtlinie", purpose: "GP-Ergebnis als HTML-Bericht speichern", example: "gpresult /h C:\\gp.html && start C:\\gp.html", typical_use_case: "Detaillierte GP-Diagnose" },
      { command: "eventvwr", platform: "Windows", category: "Diagnose", purpose: "Ereignisanzeige öffnen", example: "eventvwr", typical_use_case: "Fehlerprotokolle prüfen" },
      { command: "sfc /scannow", platform: "Windows", category: "System", purpose: "Systemdateiintegrität prüfen und reparieren", example: "sfc /scannow", typical_use_case: "Beschädigte Systemdateien reparieren" },
    ],
    "Active Directory": [
      { command: "dcdiag", platform: "Windows", category: "Active Directory", purpose: "Diagnose des Domänencontrollers", example: "dcdiag /test:connectivity /v", typical_use_case: "DC-Gesundheit prüfen" },
      { command: "repadmin /replsummary", platform: "Windows", category: "Active Directory", purpose: "Zusammenfassung der AD-Replikation anzeigen", example: "repadmin /replsummary", typical_use_case: "Replikationsstatus aller DCs überprüfen" },
      { command: "repadmin /showrepl", platform: "Windows", category: "Active Directory", purpose: "Replikationsdetails und Fehler anzeigen", example: "repadmin /showrepl", typical_use_case: "Replikationsfehler diagnostizieren" },
      { command: "repadmin /syncall /AdeP", platform: "Windows", category: "Active Directory", purpose: "AD-Replikation erzwingen", example: "repadmin /syncall /AdeP", typical_use_case: "Replikation nach Fehler anstoßen" },
      { command: "nltest /dsgetdc:<domäne>", platform: "Windows", category: "Active Directory", purpose: "Domänencontroller für eine Domäne ermitteln", example: "nltest /dsgetdc:firma.local", typical_use_case: "Erreichbaren DC finden" },
      { command: "nltest /sc_verify:<domäne>", platform: "Windows", category: "Active Directory", purpose: "Sicherheitskanal zum DC prüfen", example: "nltest /sc_verify:firma.local", typical_use_case: "Vertrauensstellung prüfen" },
      { command: "net accounts", platform: "Windows", category: "Active Directory", purpose: "Kontorichtlinien anzeigen (Kennwort, Sperrung)", example: "net accounts /domain", typical_use_case: "Kennwortrichtlinien der Domäne lesen" },
    ],
  },
  PowerShell: {
    Dienste: [
      { command: "Get-Service", platform: "PowerShell", category: "Dienste", purpose: "Alle installierten Dienste anzeigen", example: "Get-Service", typical_use_case: "Übersicht über Dienste" },
      { command: "Get-Service <name>", platform: "PowerShell", category: "Dienste", purpose: "Status eines bestimmten Dienstes abfragen", example: "Get-Service spooler", typical_use_case: "Dienststatus prüfen" },
      { command: "Restart-Service <name>", platform: "PowerShell", category: "Dienste", purpose: "Dienst neu starten", example: "Restart-Service spooler", typical_use_case: "Dienst neu initialisieren" },
      { command: "Start-Service <name>", platform: "PowerShell", category: "Dienste", purpose: "Dienst starten", example: "Start-Service Netlogon", typical_use_case: "Gestoppten Dienst aktivieren" },
      { command: "Stop-Service <name>", platform: "PowerShell", category: "Dienste", purpose: "Dienst stoppen", example: "Stop-Service spooler", typical_use_case: "Dienst sauber beenden" },
      { command: "Get-EventLog -LogName System -Newest 20", platform: "PowerShell", category: "Diagnose", purpose: "Letzte 20 Systemereignisse anzeigen", example: "Get-EventLog -LogName System -Newest 20", typical_use_case: "Systemprotokolle prüfen" },
    ],
    Netzwerk: [
      { command: "Test-NetConnection <host>", platform: "PowerShell", category: "Netzwerk", purpose: "Verbindung zu Host testen", example: "Test-NetConnection 8.8.8.8", typical_use_case: "Erreichbarkeit prüfen" },
      { command: "Test-NetConnection <host> -Port <port>", platform: "PowerShell", category: "Netzwerk", purpose: "TCP-Port-Erreichbarkeit prüfen", example: "Test-NetConnection dc01 -Port 389", typical_use_case: "Portfreigabe testen (z. B. LDAP)" },
      { command: "Get-NetIPConfiguration", platform: "PowerShell", category: "Netzwerk", purpose: "Netzwerkkonfiguration anzeigen", example: "Get-NetIPConfiguration", typical_use_case: "IP-Einstellungen lesen" },
      { command: "Resolve-DnsName <domain>", platform: "PowerShell", category: "DNS", purpose: "DNS-Auflösung testen", example: "Resolve-DnsName google.com", typical_use_case: "DNS-Probleme diagnostizieren" },
      { command: "Clear-DnsClientCache", platform: "PowerShell", category: "DNS", purpose: "DNS-Cache leeren", example: "Clear-DnsClientCache", typical_use_case: "Veraltete DNS-Auflösung zurücksetzen" },
    ],
    Benutzer: [
      { command: "Get-LocalUser", platform: "PowerShell", category: "Benutzer", purpose: "Lokale Benutzer anzeigen", example: "Get-LocalUser", typical_use_case: "Benutzerverwaltung" },
      { command: "Get-ADUser -Identity <user>", platform: "PowerShell", category: "Active Directory", purpose: "Active Directory Benutzer abfragen", example: "Get-ADUser -Identity jdoe -Properties *", typical_use_case: "AD-Benutzerinfo und Attribute lesen" },
      { command: "Get-ADComputer -Identity <name>", platform: "PowerShell", category: "Active Directory", purpose: "AD-Computerkonto abfragen", example: "Get-ADComputer -Identity PC01 -Properties *", typical_use_case: "Computerkontodetails prüfen" },
      { command: "Get-ADGroupMember <gruppe>", platform: "PowerShell", category: "Active Directory", purpose: "Mitglieder einer AD-Gruppe anzeigen", example: "Get-ADGroupMember 'Domain Admins'", typical_use_case: "Gruppenberechtigungen prüfen" },
      { command: "Search-ADAccount -LockedOut", platform: "PowerShell", category: "Active Directory", purpose: "Gesperrte AD-Konten anzeigen", example: "Search-ADAccount -LockedOut | Select Name", typical_use_case: "Gesperrte Benutzer finden" },
      { command: "Unlock-ADAccount -Identity <user>", platform: "PowerShell", category: "Active Directory", purpose: "Gesperrtes AD-Konto entsperren", example: "Unlock-ADAccount -Identity jdoe", typical_use_case: "Benutzerkonto nach Sperrung freigeben" },
    ],
    Gruppenrichtlinie: [
      { command: "Get-GPO -All", platform: "PowerShell", category: "Gruppenrichtlinie", purpose: "Alle GPOs im AD anzeigen", example: "Get-GPO -All | Select DisplayName, GpoStatus", typical_use_case: "GPO-Übersicht" },
      { command: "Get-GPResultantSetOfPolicy", platform: "PowerShell", category: "Gruppenrichtlinie", purpose: "Angewandte Richtlinien als XML abrufen", example: "Get-GPResultantSetOfPolicy -ReportType Html -Path C:\\rsop.html", typical_use_case: "RSoP-Bericht erstellen" },
    ],
  },
  Linux: {
    Dienste: [
      { command: "systemctl status <dienst>", platform: "Linux", category: "Dienste", purpose: "Status eines systemd-Dienstes anzeigen", example: "systemctl status ssh", typical_use_case: "Dienstzustand prüfen" },
      { command: "systemctl start <dienst>", platform: "Linux", category: "Dienste", purpose: "Dienst starten", example: "systemctl start nginx", typical_use_case: "Dienst aktivieren" },
      { command: "systemctl restart <dienst>", platform: "Linux", category: "Dienste", purpose: "Dienst neu starten", example: "systemctl restart nginx", typical_use_case: "Konfigurationsänderungen anwenden" },
      { command: "journalctl -u <dienst>", platform: "Linux", category: "Diagnose", purpose: "Logs eines Dienstes anzeigen", example: "journalctl -u ssh -f", typical_use_case: "Dienstfehler analysieren" },
    ],
    Netzwerk: [
      { command: "ip a", platform: "Linux", category: "Netzwerk", purpose: "Alle Netzwerkinterfaces anzeigen", example: "ip a", typical_use_case: "IP-Adressen ermitteln" },
      { command: "ss -tulpen", platform: "Linux", category: "Netzwerk", purpose: "Offene Ports und Sockets anzeigen", example: "ss -tulpen", typical_use_case: "Lauschende Dienste prüfen" },
      { command: "ping -c 4 <ziel>", platform: "Linux", category: "Netzwerk", purpose: "Erreichbarkeit prüfen", example: "ping -c 4 8.8.8.8", typical_use_case: "Netzwerkverbindung testen" },
      { command: "nmap -sV <host>", platform: "Linux", category: "Netzwerk", purpose: "Offene Ports und Dienste scannen", example: "nmap -sV 192.168.1.1", typical_use_case: "Netzwerk-Audit" },
    ],
    System: [
      { command: "top", platform: "Linux", category: "System", purpose: "Systemauslastung in Echtzeit anzeigen", example: "top", typical_use_case: "CPU- und RAM-Nutzung überwachen" },
      { command: "df -h", platform: "Linux", category: "System", purpose: "Festplattennutzung anzeigen", example: "df -h", typical_use_case: "Speicherplatz prüfen" },
      { command: "tail -f /var/log/syslog", platform: "Linux", category: "Diagnose", purpose: "Systemlog live verfolgen", example: "tail -f /var/log/syslog", typical_use_case: "Echtzeit-Fehleranalyse" },
    ],
  },
  Docker: {
    Container: [
      { command: "docker ps", platform: "Docker", category: "Container", purpose: "Laufende Container anzeigen", example: "docker ps", typical_use_case: "Containerübersicht" },
      { command: "docker ps -a", platform: "Docker", category: "Container", purpose: "Alle Container anzeigen (auch gestoppte)", example: "docker ps -a", typical_use_case: "Gestoppte Container prüfen" },
      { command: "docker logs <container>", platform: "Docker", category: "Diagnose", purpose: "Logs eines Containers anzeigen", example: "docker logs nginx", typical_use_case: "Fehler im Container debuggen" },
      { command: "docker exec -it <container> bash", platform: "Docker", category: "Container", purpose: "Interaktive Shell im Container öffnen", example: "docker exec -it myapp bash", typical_use_case: "Container von innen untersuchen" },
      { command: "docker compose up -d", platform: "Docker", category: "Container", purpose: "Alle Dienste im Hintergrund starten", example: "docker compose up -d", typical_use_case: "Compose-Umgebung starten" },
      { command: "docker compose down", platform: "Docker", category: "Container", purpose: "Alle Dienste stoppen und entfernen", example: "docker compose down", typical_use_case: "Umgebung herunterfahren" },
    ],
    Diagnose: [
      { command: "docker stats", platform: "Docker", category: "Diagnose", purpose: "Ressourcennutzung der Container in Echtzeit", example: "docker stats", typical_use_case: "Performanceüberwachung" },
      { command: "docker inspect <container>", platform: "Docker", category: "Diagnose", purpose: "Detailinformationen zu einem Container", example: "docker inspect nginx", typical_use_case: "Netzwerk und Mounts prüfen" },
    ],
  },
  Git: {
    System: [
      { command: "git status", platform: "Git", category: "System", purpose: "Arbeitsstatus anzeigen", example: "git status", typical_use_case: "Geänderte Dateien prüfen" },
      { command: "git add .", platform: "Git", category: "System", purpose: "Alle Änderungen für Commit vorbereiten", example: "git add .", typical_use_case: "Änderungen stagen" },
      { command: "git commit -m \"message\"", platform: "Git", category: "System", purpose: "Commit erstellen", example: "git commit -m \"fix: dns config\"", typical_use_case: "Änderungen sichern" },
      { command: "git push origin main", platform: "Git", category: "System", purpose: "Commits zum Remote pushen", example: "git push origin main", typical_use_case: "Änderungen hochladen" },
      { command: "git log --oneline", platform: "Git", category: "System", purpose: "Commit-Historie anzeigen", example: "git log --oneline -10", typical_use_case: "Letzte Commits überblicken" },
    ],
  },
};

interface CommandSuggestion {
  command: string; platform: string; category: string; purpose: string; example?: string; typical_use_case?: string;
}

function CommandHelper({ onSelect }: { onSelect: (s: CommandSuggestion) => void }) {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState("Windows");
  const [category, setCategory] = useState("");

  const platforms = Object.keys(CMD_SUGGESTIONS);
  const categories = Object.keys(CMD_SUGGESTIONS[platform] ?? {});
  const activeCat = category && CMD_SUGGESTIONS[platform]?.[category] ? category : categories[0] ?? "";
  const suggestions = CMD_SUGGESTIONS[platform]?.[activeCat] ?? [];

  return (
    <div className="mb-5">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-xs font-medium text-blue-400 hover:text-blue-300 transition-all"
        >
          <Terminal size={13} />
          Befehl vorschlagen
        </button>
      ) : (
        <div className="rounded-xl border border-blue-500/15 bg-[#0d1420] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Befehl vorschlagen</h3>
            <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
              <Plus size={14} className="rotate-45" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider">Plattform</label>
              <div className="flex flex-wrap gap-1.5">
                {platforms.map((p) => (
                  <button key={p} onClick={() => { setPlatform(p); setCategory(""); }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      platform === p
                        ? "bg-blue-600 text-white"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                    }`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider">Kategorie</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activeCat === c
                      ? "bg-violet-600/80 text-white"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Vorschläge – klicken zum Übernehmen</p>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => { onSelect(s); setOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all group">
                  <code className="text-sm font-mono text-emerald-300 group-hover:text-emerald-200">{s.command}</code>
                  {s.purpose && <p className="text-xs text-slate-500 mt-0.5">{s.purpose}</p>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BefehlePageContent() {
  const { user } = useAuth();

  const [commands, setCommands] = useState<FisiCommand[]>([]);
  const [demoLoading, setDemoLoading] = useState(!supabaseConfigMissing);
  const [demoError, setDemoError] = useState(false);
  const [demoQuery, setDemoQuery] = useState("");

  const [userCommands, setUserCommands] = useState<FisiUserCommand[] | null>(null);
  const [userCommandsError, setUserCommandsError] = useState(false);
  const userCommandsLoading = !!user && userCommands === null && !userCommandsError;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editCmd, setEditCmd] = useState<FisiUserCommand | null>(null);
  const [helperPrefill, setHelperPrefill] = useState<Partial<import("@/components/CommandForm").CommandFormData> | undefined>(undefined);
  const [userQuery, setUserQuery] = useState("");
  const [notif, setNotif] = useState<NotifType | null>(null);

  function toast(kind: NotifType["kind"], message: string) {
    setNotif({ kind, message });
    setTimeout(() => setNotif(null), 4000);
  }

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;
    supabase
      .from("fisi_commands")
      .select("*")
      .order("category", { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setDemoError(true);
        else setCommands(data ?? []);
        setDemoLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user || !supabase) return;
    supabase
      .from("fisi_user_commands")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setUserCommandsError(true);
        else setUserCommands(data ?? []);
      });
  }, [user]);

  const filteredDemo = useMemo(() => {
    if (!demoQuery.trim()) return commands;
    const q = demoQuery.toLowerCase();
    return commands.filter((c) =>
      c.command.toLowerCase().includes(q) ||
      (c.platform ?? "").toLowerCase().includes(q) ||
      (c.category ?? "").toLowerCase().includes(q) ||
      (c.purpose ?? "").toLowerCase().includes(q)
    );
  }, [commands, demoQuery]);

  const filteredUserCommands = useMemo(() => {
    if (!userQuery.trim() || !userCommands) return userCommands ?? [];
    const q = userQuery.toLowerCase();
    return userCommands.filter((c) =>
      c.command.toLowerCase().includes(q) ||
      (c.platform ?? "").toLowerCase().includes(q) ||
      (c.category ?? "").toLowerCase().includes(q) ||
      (c.purpose ?? "").toLowerCase().includes(q)
    );
  }, [userCommands, userQuery]);

  async function handleCreate(data: CommandFormData) {
    if (!supabase || !user) return;
    const { data: row, error: err } = await supabase
      .from("fisi_user_commands")
      .insert({ ...data, user_id: user.id })
      .select()
      .single();
    if (err) throw err;
    setUserCommands((prev) => [row, ...(prev ?? [])]);
    setShowCreateForm(false);
    toast("success", "Befehl erstellt.");
  }

  async function handleUpdate(data: CommandFormData) {
    if (!supabase || !editCmd) return;
    const { data: row, error: err } = await supabase
      .from("fisi_user_commands")
      .update(data)
      .eq("id", editCmd.id)
      .eq("user_id", editCmd.user_id)
      .select()
      .single();
    if (err) throw err;
    setUserCommands((prev) => (prev ?? []).map((c) => (c.id === row.id ? row : c)));
    setEditCmd(null);
    toast("success", "Befehl aktualisiert.");
  }

  async function handleDelete(id: string) {
    if (!supabase || !user) return;
    const { error: err } = await supabase
      .from("fisi_user_commands")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (err) { toast("error", "Fehler beim Löschen."); return; }
    setUserCommands((prev) => (prev ?? []).filter((c) => c.id !== id));
    toast("success", "Befehl gelöscht.");
  }

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  return (
    <div>
      {notif && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium transition-all ${
          notif.kind === "success"
            ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-300"
            : "bg-red-500/15 border-red-500/20 text-red-300"
        }`}>
          {notif.kind === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {notif.message}
        </div>
      )}

      <PageHeader
        icon={Terminal}
        title="Befehle"
        description="Administrativer Befehlsreferenz mit Beispielen und Anwendungsfällen"
      />

      {/* Personal workspace */}
      {user && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meine Befehle</h2>
            {!showCreateForm && (
              <button onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors">
                <Plus size={13} />Befehl hinzufügen
              </button>
            )}
          </div>

          {showCreateForm && (
            <div className="mb-5">
              <CommandForm
                prefill={helperPrefill}
                key={JSON.stringify(helperPrefill)}
                onSave={handleCreate}
                onCancel={() => { setShowCreateForm(false); setHelperPrefill(undefined); }}
              />
            </div>
          )}

          {userCommandsLoading && <LoadingState />}
          {userCommandsError && <ErrorState />}
          {!userCommandsLoading && !userCommandsError && userCommands !== null && (
            <>
              {userCommands.length > 0 && (
                <div className="mb-4 relative">
                  <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Befehl, Plattform oder Kategorie suchen..."
                    className="w-full max-w-xl pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              )}
              {userCommands.length === 0 && !showCreateForm && (
                <EmptyPersonalState
                  title="Noch keine Befehle"
                  description="Fügen Sie Ihren ersten Befehl hinzu – mit Plattform, Beispiel und Anwendungsfall."
                  buttonLabel="Befehl hinzufügen"
                  onAction={() => setShowCreateForm(true)}
                />
              )}
              {userCommands.length > 0 && filteredUserCommands.length === 0 && (
                <EmptyState title="Keine Treffer" description={`Kein Befehl gefunden für "${userQuery}".`} />
              )}
              {filteredUserCommands.length > 0 && (
                <div className="space-y-4">
                  {filteredUserCommands.map((cmd) => (
                    <UserCommandCard key={cmd.id} cmd={cmd} onEdit={setEditCmd} onDelete={handleDelete} />
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
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Hilfen &amp; Vorlagen</h2>
          <CommandHelper onSelect={(s) => {
            setHelperPrefill({ command: s.command, platform: s.platform, category: s.category, purpose: s.purpose, example: s.example, typical_use_case: s.typical_use_case });
            setShowCreateForm(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} />
        </div>
      )}

      {/* Reference section */}
      <ReferenceSection title="Referenz-Befehle">
        <div className="mb-5 relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={demoQuery}
            onChange={(e) => setDemoQuery(e.target.value)}
            placeholder="Befehl, Plattform oder Kategorie suchen..."
            className="w-full max-w-xl pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all"
          />
          {demoQuery && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-slate-500">
              {filteredDemo.length} Treffer
            </span>
          )}
        </div>

        {demoLoading && <LoadingState />}
        {demoError && <ErrorState />}
        {!demoLoading && !demoError && commands.length === 0 && (
          <EmptyState title="Keine Befehle vorhanden" description="Es wurden noch keine Befehle angelegt." />
        )}
        {!demoLoading && !demoError && commands.length > 0 && filteredDemo.length === 0 && (
          <EmptyState title="Keine Treffer" description={`Kein Befehl gefunden für "${demoQuery}".`} />
        )}
        {!demoLoading && !demoError && filteredDemo.length > 0 && (
          <div className="space-y-4">
            {filteredDemo.map((cmd) => (
              <DemoCommandCard key={cmd.id} cmd={cmd} user={user}
                onCopied={(msg) => toast("success", msg)} />
            ))}
          </div>
        )}
      </ReferenceSection>

      {/* Edit modal */}
      {editCmd && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CommandForm
              command={editCmd}
              onSave={handleUpdate}
              onCancel={() => setEditCmd(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
