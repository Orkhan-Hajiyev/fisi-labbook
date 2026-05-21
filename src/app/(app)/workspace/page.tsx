"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LayoutGrid, FlaskConical, Server, Terminal, Bug, Container, StickyNote,
  Plus, Download, Printer, ChevronDown, ChevronRight, AlertCircle, CheckCircle,
  Lock,
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type {
  FisiUserLab,
  FisiUserSystem,
  FisiUserCommand,
  FisiUserTroubleshootingCase,
  FisiUserDockerService,
  FisiUserNote,
} from "@/lib/types";

// ── Types ─────────────────────────────────────────────────────────────────

interface WorkspaceData {
  labs: FisiUserLab[];
  systems: FisiUserSystem[];
  commands: FisiUserCommand[];
  troubleshooting: FisiUserTroubleshootingCase[];
  docker: FisiUserDockerService[];
  notes: FisiUserNote[];
}

type Notif = { type: "success" | "error"; message: string };

// ── Markdown generation ────────────────────────────────────────────────────

function generateMarkdown(data: WorkspaceData, displayName: string): string {
  const lines: string[] = [];
  const now = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

  lines.push(`# FISI LabBook – Workspace Export`);
  lines.push(`\nExportiert am: ${now}  `);
  lines.push(`Benutzer: ${displayName}\n`);

  lines.push(`---\n`);

  if (data.labs.length > 0) {
    lines.push(`## Labore (${data.labs.length})\n`);
    data.labs.forEach((lab) => {
      lines.push(`### ${lab.title}`);
      if (lab.status) lines.push(`**Status:** ${lab.status}`);
      if (lab.topic) lines.push(`**Thema:** ${lab.topic}`);
      if (lab.environment) lines.push(`**Umgebung:** ${lab.environment}`);
      if (lab.goal) lines.push(`**Ziel:** ${lab.goal}`);
      if (lab.description) lines.push(`\n${lab.description}`);
      lines.push(``);
    });
  }

  if (data.systems.length > 0) {
    lines.push(`## Systeme (${data.systems.length})\n`);
    data.systems.forEach((s) => {
      lines.push(`### ${s.hostname}`);
      if (s.os) lines.push(`**OS:** ${s.os}`);
      if (s.role) lines.push(`**Rolle:** ${s.role}`);
      if (s.ip_address) lines.push(`**IP:** ${s.ip_address}`);
      if (s.gateway) lines.push(`**Gateway:** ${s.gateway}`);
      if (s.dns) lines.push(`**DNS:** ${s.dns}`);
      if (s.domain_name) lines.push(`**Domäne:** ${s.domain_name}`);
      if (s.notes) lines.push(`\n${s.notes}`);
      lines.push(``);
    });
  }

  if (data.commands.length > 0) {
    lines.push(`## Befehle (${data.commands.length})\n`);
    data.commands.forEach((c) => {
      lines.push(`### \`${c.command}\``);
      if (c.platform) lines.push(`**Plattform:** ${c.platform}`);
      if (c.category) lines.push(`**Kategorie:** ${c.category}`);
      if (c.purpose) lines.push(`**Zweck:** ${c.purpose}`);
      if (c.example) lines.push(`\n**Beispiel:**\n\`\`\`\n${c.example}\n\`\`\``);
      if (c.typical_use_case) lines.push(`\n**Typischer Anwendungsfall:** ${c.typical_use_case}`);
      lines.push(``);
    });
  }

  if (data.troubleshooting.length > 0) {
    lines.push(`## Fehleranalysen (${data.troubleshooting.length})\n`);
    data.troubleshooting.forEach((t) => {
      lines.push(`### ${t.title}`);
      if (t.category) lines.push(`**Kategorie:** ${t.category}`);
      if (t.difficulty) lines.push(`**Schwierigkeit:** ${t.difficulty}`);
      if (t.symptoms) lines.push(`\n**Symptome:**\n${t.symptoms}`);
      if (t.checks) lines.push(`\n**Prüfschritte:**\n${t.checks}`);
      if (t.root_cause) lines.push(`\n**Ursache:**\n${t.root_cause}`);
      if (t.solution) lines.push(`\n**Lösung:**\n${t.solution}`);
      if (t.result) lines.push(`\n**Ergebnis:**\n${t.result}`);
      lines.push(``);
    });
  }

  if (data.docker.length > 0) {
    lines.push(`## Docker-Dienste (${data.docker.length})\n`);
    data.docker.forEach((d) => {
      lines.push(`### ${d.name}`);
      if (d.image) lines.push(`**Image:** ${d.image}`);
      if (d.port) lines.push(`**Port:** ${d.port}`);
      if (d.service_type) lines.push(`**Typ:** ${d.service_type}`);
      if (d.status) lines.push(`**Status:** ${d.status}`);
      if (d.purpose) lines.push(`**Zweck:** ${d.purpose}`);
      if (d.compose_snippet) lines.push(`\n**Compose:**\n\`\`\`yaml\n${d.compose_snippet}\n\`\`\``);
      if (d.notes) lines.push(`\n${d.notes}`);
      lines.push(``);
    });
  }

  if (data.notes.length > 0) {
    lines.push(`## Praxisnotizen (${data.notes.length})\n`);
    data.notes.forEach((n) => {
      lines.push(`### ${n.title}`);
      if (n.category) lines.push(`**Kategorie:** ${n.category}`);
      if (n.priority) lines.push(`**Priorität:** ${n.priority}`);
      if (n.status) lines.push(`**Status:** ${n.status}`);
      if (n.tags?.length) lines.push(`**Tags:** ${n.tags.join(", ")}`);
      if (n.content) lines.push(`\n${n.content}`);
      lines.push(``);
    });
  }

  return lines.join("\n");
}

function generateLabMarkdown(
  lab: FisiUserLab,
  linked: {
    systems: FisiUserSystem[];
    commands: FisiUserCommand[];
    troubleshooting: FisiUserTroubleshootingCase[];
    docker: FisiUserDockerService[];
    notes: FisiUserNote[];
  },
): string {
  const lines: string[] = [];
  const now = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

  lines.push(`# Labor: ${lab.title}`);
  lines.push(`\nExportiert am: ${now}\n`);
  lines.push(`---\n`);

  if (lab.status) lines.push(`**Status:** ${lab.status}`);
  if (lab.topic) lines.push(`**Thema:** ${lab.topic}`);
  if (lab.environment) lines.push(`**Umgebung:** ${lab.environment}`);
  if (lab.goal) lines.push(`**Ziel:** ${lab.goal}`);
  if (lab.description) lines.push(`\n${lab.description}`);
  lines.push(``);

  if (linked.systems.length > 0) {
    lines.push(`## Systeme\n`);
    linked.systems.forEach((s) => {
      lines.push(`### ${s.hostname}`);
      if (s.os) lines.push(`**OS:** ${s.os}`);
      if (s.role) lines.push(`**Rolle:** ${s.role}`);
      if (s.ip_address) lines.push(`**IP:** ${s.ip_address}`);
      if (s.gateway) lines.push(`**Gateway:** ${s.gateway}`);
      if (s.dns) lines.push(`**DNS:** ${s.dns}`);
      if (s.notes) lines.push(`\n${s.notes}`);
      lines.push(``);
    });
  }

  if (linked.commands.length > 0) {
    lines.push(`## Befehle\n`);
    linked.commands.forEach((c) => {
      lines.push(`### \`${c.command}\``);
      if (c.platform) lines.push(`**Plattform:** ${c.platform}`);
      if (c.purpose) lines.push(`**Zweck:** ${c.purpose}`);
      if (c.example) lines.push(`\n\`\`\`\n${c.example}\n\`\`\``);
      lines.push(``);
    });
  }

  if (linked.troubleshooting.length > 0) {
    lines.push(`## Fehleranalysen\n`);
    linked.troubleshooting.forEach((t) => {
      lines.push(`### ${t.title}`);
      if (t.symptoms) lines.push(`\n**Symptome:** ${t.symptoms}`);
      if (t.solution) lines.push(`**Lösung:** ${t.solution}`);
      lines.push(``);
    });
  }

  if (linked.docker.length > 0) {
    lines.push(`## Docker-Dienste\n`);
    linked.docker.forEach((d) => {
      lines.push(`### ${d.name}`);
      if (d.image) lines.push(`**Image:** ${d.image}`);
      if (d.compose_snippet) lines.push(`\n\`\`\`yaml\n${d.compose_snippet}\n\`\`\``);
      lines.push(``);
    });
  }

  if (linked.notes.length > 0) {
    lines.push(`## Praxisnotizen\n`);
    linked.notes.forEach((n) => {
      lines.push(`### ${n.title}`);
      if (n.content) lines.push(`\n${n.content}`);
      lines.push(``);
    });
  }

  return lines.join("\n");
}

// ── StatCard ───────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon, label, value, href, accent,
}: {
  icon: React.ElementType; label: string; value: number; href: string; accent: string;
}) {
  const accentMap: Record<string, string> = {
    blue:    "text-blue-400 bg-blue-500/10 border-blue-500/15",
    cyan:    "text-cyan-400 bg-cyan-500/10 border-cyan-500/15",
    violet:  "text-violet-400 bg-violet-500/10 border-violet-500/15",
    amber:   "text-amber-400 bg-amber-500/10 border-amber-500/15",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/15",
    slate:   "text-slate-400 bg-slate-500/10 border-slate-500/15",
  };
  const cls = accentMap[accent] ?? accentMap.slate;
  return (
    <Link href={href} className="block rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 p-4 transition-all duration-150 group">
      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-2 ${cls}`}>
        <Icon size={16} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </Link>
  );
}

// ── LabGroup ───────────────────────────────────────────────────────────────

function LabGroup({
  lab, systems, commands, troubleshooting, docker, notes,
}: {
  lab: FisiUserLab;
  systems: FisiUserSystem[];
  commands: FisiUserCommand[];
  troubleshooting: FisiUserTroubleshootingCase[];
  docker: FisiUserDockerService[];
  notes: FisiUserNote[];
}) {
  const [expanded, setExpanded] = useState(true);

  const linked = {
    systems: systems.filter((s) => s.lab_id === lab.id),
    commands: commands.filter((c) => (c.notes ?? "").toLowerCase().includes(lab.title.toLowerCase()) || (c.typical_use_case ?? "").toLowerCase().includes(lab.title.toLowerCase())),
    troubleshooting: troubleshooting.filter((t) => (t.category ?? "").toLowerCase().includes(lab.title.toLowerCase()) || t.title.toLowerCase().includes(lab.title.toLowerCase())),
    docker: docker.filter((d) => (d.notes ?? "").toLowerCase().includes(lab.title.toLowerCase()) || (d.purpose ?? "").toLowerCase().includes(lab.title.toLowerCase())),
    notes: notes.filter((n) => n.related_area === lab.title || (n.content ?? "").toLowerCase().includes(lab.title.toLowerCase())),
  };

  const total = linked.systems.length + linked.commands.length + linked.troubleshooting.length + linked.docker.length + linked.notes.length;

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
          <FlaskConical size={15} className="text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{lab.title}</p>
          <p className="text-[11px] text-slate-500">{total} verknüpfte Einträge</p>
        </div>
        {expanded ? <ChevronDown size={15} className="text-slate-500 shrink-0" /> : <ChevronRight size={15} className="text-slate-500 shrink-0" />}
      </button>

      {expanded && (
        <div className="px-5 pb-4 space-y-3 border-t border-white/5">
          {linked.systems.length > 0 && (
            <div className="pt-3">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Systeme</p>
              <div className="space-y-1">
                {linked.systems.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 text-xs text-slate-400">
                    <Server size={11} className="text-cyan-500 shrink-0" />
                    <code className="font-mono text-cyan-300">{s.hostname}</code>
                    {s.ip_address && <span className="text-slate-600">({s.ip_address})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {linked.commands.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Befehle</p>
              <div className="space-y-1">
                {linked.commands.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 text-xs text-slate-400">
                    <Terminal size={11} className="text-violet-500 shrink-0" />
                    <code className="font-mono text-violet-300">{c.command}</code>
                  </div>
                ))}
              </div>
            </div>
          )}
          {linked.troubleshooting.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Fehleranalysen</p>
              <div className="space-y-1">
                {linked.troubleshooting.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-xs text-slate-400">
                    <Bug size={11} className="text-amber-500 shrink-0" />
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          )}
          {linked.docker.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Docker-Dienste</p>
              <div className="space-y-1">
                {linked.docker.map((d) => (
                  <div key={d.id} className="flex items-center gap-2 text-xs text-slate-400">
                    <Container size={11} className="text-emerald-500 shrink-0" />
                    {d.name}
                    {d.image && <span className="text-slate-600">({d.image})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {linked.notes.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Praxisnotizen</p>
              <div className="space-y-1">
                {linked.notes.map((n) => (
                  <div key={n.id} className="flex items-center gap-2 text-xs text-slate-400">
                    <StickyNote size={11} className="text-blue-500 shrink-0" />
                    {n.title}
                  </div>
                ))}
              </div>
            </div>
          )}
          {total === 0 && (
            <p className="text-[11px] text-slate-600 pt-2">Noch keine verknüpften Inhalte.</p>
          )}
          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const md = generateLabMarkdown(lab, linked);
                const url = URL.createObjectURL(new Blob([md], { type: "text/markdown" }));
                const a = document.createElement("a");
                a.href = url;
                a.download = `labor-${lab.title.toLowerCase().replace(/\s+/g, "-")}.md`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-white/15 text-xs text-slate-400 hover:text-slate-200 transition-all"
            >
              <Download size={11} />
              Markdown exportieren
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const { user } = useAuth();
  const [data, setData] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState<Notif | null>(null);

  function toast(type: Notif["type"], message: string) {
    setNotif({ type, message });
    setTimeout(() => setNotif(null), 4000);
  }

  const loadData = useCallback(async () => {
    if (!user || !supabase) return;
    setLoading(true);
    const uid = user.id;
    const [labs, systems, commands, troubleshooting, docker, notes] = await Promise.all([
      supabase.from("fisi_user_labs").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("fisi_user_systems").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("fisi_user_commands").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("fisi_user_troubleshooting_cases").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("fisi_user_docker_services").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("fisi_user_notes").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
    ]);
    setData({
      labs: (labs.data ?? []) as FisiUserLab[],
      systems: (systems.data ?? []) as FisiUserSystem[],
      commands: (commands.data ?? []) as FisiUserCommand[],
      troubleshooting: (troubleshooting.data ?? []) as FisiUserTroubleshootingCase[],
      docker: (docker.data ?? []) as FisiUserDockerService[],
      notes: (notes.data ?? []) as FisiUserNote[],
    });
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user || supabaseConfigMissing) {
      const t = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [user, loadData]);

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  function handleExportMarkdown() {
    if (!data || !user) return;
    const displayName = (user.user_metadata?.name as string | undefined) || user.email || "Benutzer";
    const md = generateMarkdown(data, displayName);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fisi-labbook-workspace.md";
    a.click();
    URL.revokeObjectURL(url);
    toast("success", "Markdown-Export wurde heruntergeladen.");
  }

  function handlePrint() {
    window.print();
  }

  const isEmpty = data && data.labs.length === 0 && data.systems.length === 0 &&
    data.commands.length === 0 && data.troubleshooting.length === 0 &&
    data.docker.length === 0 && data.notes.length === 0;

  // Items not linked to any lab
  const unlinkedSystems = data?.systems.filter((s) => !s.lab_id) ?? [];

  return (
    <div className="print:text-black print:bg-white">
      {notif && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium max-w-xs print:hidden ${
          notif.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {notif.type === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {notif.message}
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6 print:hidden">
        <PageHeader
          icon={LayoutGrid}
          title="Workspace"
          description="Persönliche Gesamtübersicht aller Inhalte und Verknüpfungen"
        />
        {user && data && !isEmpty && (
          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-xs text-slate-400 hover:text-slate-200 transition-all"
            >
              <Download size={13} />
              Als Markdown exportieren
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-xs text-slate-400 hover:text-slate-200 transition-all"
            >
              <Printer size={13} />
              Als PDF drucken
            </button>
          </div>
        )}
      </div>

      {/* Print header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold">FISI LabBook – Workspace</h1>
        <p className="text-sm text-gray-500">
          {user ? ((user.user_metadata?.name as string | undefined) || user.email) : ""}
          {" · "}
          {new Date().toLocaleDateString("de-DE")}
        </p>
      </div>

      {/* Not logged in */}
      {!user && (
        <div className="rounded-xl border border-blue-500/10 bg-[#0f1623] p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-2">Anmeldung erforderlich</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            Der persönliche Workspace ist nur für angemeldete Benutzer verfügbar.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/login" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors">
              Einloggen
            </Link>
            <Link href="/registrieren" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-300 transition-colors">
              Kostenlos registrieren
            </Link>
          </div>
        </div>
      )}

      {user && loading && <LoadingState text="Workspace wird geladen…" />}

      {user && !loading && isEmpty && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mx-auto mb-4">
            <LayoutGrid size={20} className="text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-2">Noch keine persönlichen Inhalte vorhanden</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Starten Sie mit einem Labor, einem System oder einer Praxisnotiz.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/labore" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors">
              <Plus size={14} />Neues Labor erstellen
            </Link>
            <Link href="/praxisnotizen" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-300 transition-colors">
              <Plus size={14} />Neue Praxisnotiz erstellen
            </Link>
            <Link href="/befehle" className="px-4 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Zur Befehlsbibliothek →
            </Link>
          </div>
        </div>
      )}

      {user && !loading && data && !isEmpty && (
        <div className="space-y-8">
          {/* Summary cards */}
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Übersicht</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard label="Labore"          value={data.labs.length}            icon={FlaskConical} href="/labore"         accent="blue" />
              <StatCard label="Systeme"         value={data.systems.length}         icon={Server}       href="/systeme"        accent="cyan" />
              <StatCard label="Befehle"         value={data.commands.length}        icon={Terminal}     href="/befehle"        accent="violet" />
              <StatCard label="Fehleranalysen"  value={data.troubleshooting.length} icon={Bug}          href="/fehleranalyse"  accent="amber" />
              <StatCard label="Docker-Dienste"  value={data.docker.length}          icon={Container}    href="/docker-dienste" accent="emerald" />
              <StatCard label="Praxisnotizen"   value={data.notes.length}           icon={StickyNote}   href="/praxisnotizen"  accent="slate" />
            </div>
          </div>

          {/* Lab-based structure */}
          {data.labs.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Labore und verknüpfte Inhalte</h2>
              <div className="space-y-3">
                {data.labs.map((lab) => (
                  <LabGroup
                    key={lab.id}
                    lab={lab}
                    systems={data.systems}
                    commands={data.commands}
                    troubleshooting={data.troubleshooting}
                    docker={data.docker}
                    notes={data.notes}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Unlinked systems */}
          {unlinkedSystems.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Systeme – Nicht zugeordnet</h2>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                {unlinkedSystems.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 text-xs text-slate-400">
                    <Server size={12} className="text-cyan-500 shrink-0" />
                    <code className="font-mono text-cyan-300">{s.hostname}</code>
                    {s.ip_address && <span className="text-slate-600">({s.ip_address})</span>}
                    {s.os && <span className="text-slate-600">· {s.os}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Standalone items when no labs exist */}
          {data.labs.length === 0 && (
            <div className="space-y-6">
              {data.systems.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Meine Systeme</h2>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                    {data.systems.map((s) => (
                      <div key={s.id} className="flex items-center gap-2 text-xs text-slate-400">
                        <Server size={12} className="text-cyan-500 shrink-0" />
                        <code className="font-mono text-cyan-300">{s.hostname}</code>
                        {s.ip_address && <span className="text-slate-600">({s.ip_address})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {data.commands.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Meine Befehle</h2>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                    {data.commands.map((c) => (
                      <div key={c.id} className="flex items-center gap-2 text-xs text-slate-400">
                        <Terminal size={12} className="text-violet-500 shrink-0" />
                        <code className="font-mono text-violet-300">{c.command}</code>
                        {c.platform && <span className="text-slate-600">· {c.platform}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {data.troubleshooting.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Meine Fehleranalysen</h2>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                    {data.troubleshooting.map((t) => (
                      <div key={t.id} className="flex items-center gap-2 text-xs text-slate-400">
                        <Bug size={12} className="text-amber-500 shrink-0" />
                        {t.title}
                        {t.category && <span className="text-slate-600">· {t.category}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {data.docker.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Meine Docker-Dienste</h2>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                    {data.docker.map((d) => (
                      <div key={d.id} className="flex items-center gap-2 text-xs text-slate-400">
                        <Container size={12} className="text-emerald-500 shrink-0" />
                        {d.name}
                        {d.image && <span className="text-slate-600">· {d.image}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {data.notes.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Meine Praxisnotizen</h2>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2">
                    {data.notes.map((n) => (
                      <div key={n.id} className="flex items-center gap-2 text-xs text-slate-400">
                        <StickyNote size={12} className="text-blue-500 shrink-0" />
                        {n.title}
                        {n.category && <span className="text-slate-600">· {n.category}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="border-t border-white/5 pt-6 print:hidden">
            <div className="flex flex-wrap gap-3">
              <Link href="/labore"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors">
                <Plus size={14} />Neues Labor erstellen
              </Link>
              <Link href="/praxisnotizen"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-300 transition-colors">
                <Plus size={14} />Neue Praxisnotiz erstellen
              </Link>
              <Link href="/befehle"
                className="px-4 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-300 transition-colors">
                Zur Befehlsbibliothek →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
