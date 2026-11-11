"use client";

import { useEffect, useState } from "react";
import {
  FlaskConical, Server, Terminal, Bug, Container, BookOpen,
  StickyNote, ArrowRight, Info, Plus, Network, Router, ShieldCheck, CircleCheck,
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface DemoStats {
  labore: number;
  systeme: number;
  befehle: number;
  fehleranalysen: number;
  dockerDienste: number;
}

interface PersonalStats {
  labore: number;
  systeme: number;
  befehle: number;
  fehleranalysen: number;
  dockerDienste: number;
  notizen: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const userId = user?.id;

  const [demoStats, setDemoStats] = useState<DemoStats | null>(null);
  const [demoLoading, setDemoLoading] = useState(!supabaseConfigMissing);
  const [demoError, setDemoError] = useState(false);

  const [personalStatsResult, setPersonalStatsResult] = useState<{ userId: string; data: PersonalStats } | null>(null);
  const [personalStatsErrorFor, setPersonalStatsErrorFor] = useState<string | null>(null);
  // Keep data scoped to the account that initiated the request.
  const personalStats = personalStatsResult && personalStatsResult.userId === user?.id ? personalStatsResult.data : null;
  const personalStatsError = !!user && personalStatsErrorFor === user.id;
  const personalStatsLoading = !!user && personalStats === null && !personalStatsError;

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;
    Promise.all([
      supabase!.from("fisi_labs").select("id", { count: "exact", head: true }),
      supabase!.from("fisi_systems").select("id", { count: "exact", head: true }),
      supabase!.from("fisi_commands").select("id", { count: "exact", head: true }),
      supabase!.from("fisi_troubleshooting_cases").select("id", { count: "exact", head: true }),
      supabase!.from("fisi_docker_services").select("id", { count: "exact", head: true }),
    ]).then(([labs, systems, commands, troubleshooting, docker]) => {
      if (labs.error || systems.error || commands.error || troubleshooting.error || docker.error) {
        setDemoError(true);
      } else {
        setDemoStats({
          labore: labs.count ?? 0,
          systeme: systems.count ?? 0,
          befehle: commands.count ?? 0,
          fehleranalysen: troubleshooting.count ?? 0,
          dockerDienste: docker.count ?? 0,
        });
      }
      setDemoLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!userId || !supabase) return;
    let cancelled = false;
    Promise.all([
      supabase!.from("fisi_user_labs").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase!.from("fisi_user_systems").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase!.from("fisi_user_commands").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase!.from("fisi_user_troubleshooting_cases").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase!.from("fisi_user_docker_services").select("id", { count: "exact", head: true }).eq("user_id", userId),
      supabase!.from("fisi_user_notes").select("id", { count: "exact", head: true }).eq("user_id", userId),
    ]).then(([labs, systems, commands, troubleshooting, docker, notes]) => {
      if (cancelled) return;
      if (labs.error || systems.error || commands.error || troubleshooting.error || docker.error || notes.error) {
        setPersonalStatsErrorFor(userId);
      } else {
        setPersonalStatsResult({ userId, data: {
          labore: labs.count ?? 0,
          systeme: systems.count ?? 0,
          befehle: commands.count ?? 0,
          fehleranalysen: troubleshooting.count ?? 0,
          dockerDienste: docker.count ?? 0,
          notizen: notes.count ?? 0,
        } });
      }
    });
    return () => { cancelled = true; };
  }, [userId]);

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  const personalIsEmpty = personalStats !== null &&
    personalStats.labore === 0 &&
    personalStats.systeme === 0 &&
    personalStats.befehle === 0 &&
    personalStats.fehleranalysen === 0 &&
    personalStats.dockerDienste === 0 &&
    personalStats.notizen === 0;

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="fisi-hero fisi-tech-grid relative rounded-[24px] overflow-hidden p-6 sm:p-8 lg:p-9">
        <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] border border-blue-200 bg-white/85 text-[#1b69a8] mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#20a6d2]" />
              OrikLab · Systemintegration
            </span>
            <h1 className="text-3xl sm:text-[38px] font-extrabold tracking-[-0.035em] text-[#153a5c] leading-tight mb-3">
              Dein IT-Labor.<br /><span className="text-[#1476bd]">Alles dokumentiert.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#4b657d] leading-relaxed max-w-xl mb-6">
              Systeme verstehen, Netzwerke aufbauen, Befehle sichern und Fehler systematisch lösen –
              in einem Workspace für deine FISI-Praxis.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 border border-blue-100 text-[11px] font-semibold text-[#2b6088]"><Network size={13} /> Netzwerk</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 border border-blue-100 text-[11px] font-semibold text-[#2b6088]"><Server size={13} /> Systeme</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 border border-blue-100 text-[11px] font-semibold text-[#2b6088]"><Terminal size={13} /> Terminal & Logs</span>
            </div>
            <Link href="/labore" className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-[#176cba] hover:bg-[#105c9f] shadow-lg shadow-blue-500/15 transition-colors">
              Labore entdecken <ArrowRight size={15} />
            </Link>
          </div>

          <div className="relative rounded-[20px] border border-[#cee2f6] bg-white/90 shadow-[0_22px_55px_-35px_rgba(33,103,163,0.35)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-[#e3edf8] pb-3 mb-5">
              <div className="flex items-center gap-2 text-[11px] font-bold text-[#335c7b] tracking-[0.08em] uppercase"><Network size={15} className="text-blue-600" /> Netzwerk-Labor</div>
              <span className="text-[10px] text-[#66849d] bg-[#edf6ff] rounded-md px-2 py-1">Beispiel-Topologie</span>
            </div>
            <div className="grid grid-cols-[1fr_0.4fr_1fr_0.4fr_1fr] items-center text-center gap-1 mb-5">
              <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700"><Router size={22} /></div><span className="text-[10px] font-semibold text-slate-600">Router</span></div>
              <div className="h-px bg-[#a9cbe8] relative -mt-5"><span className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-blue-400" /></div>
              <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700"><Network size={22} /></div><span className="text-[10px] font-semibold text-slate-600">Switch</span></div>
              <div className="h-px bg-[#a9cbe8] relative -mt-5"><span className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-cyan-400" /></div>
              <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700"><Server size={22} /></div><span className="text-[10px] font-semibold text-slate-600">Server</span></div>
            </div>
            <div className="rounded-xl bg-[#143550] px-4 py-3 font-mono text-[11px] leading-relaxed text-[#cdeaff] shadow-inner">
              <span className="text-[#78d4fa]">PS C:\&gt;</span> Test-NetConnection server.lab<br />
              <span className="text-[#7bdfb4]">#</span> Netzwerk prüfen · Ergebnis dokumentieren
            </div>
            <div className="flex items-center gap-2 mt-4 text-[11px] text-[#65829c]"><ShieldCheck size={14} className="text-[#198cbd]" /> Praxisnah lernen und nachvollziehbar festhalten <CircleCheck size={13} className="text-[#22a0bd] ml-auto" /></div>
          </div>
        </div>
      </div>

      {/* Demo stats */}
      <div>
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
          Dokumentationsübersicht
        </h2>
        {demoLoading && <LoadingState />}
        {demoError && <ErrorState />}
        {!demoLoading && !demoError && demoStats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard label="Labore" value={demoStats.labore} icon={FlaskConical} href="/labore" accent="blue" />
            <StatCard label="Systeme" value={demoStats.systeme} icon={Server} href="/systeme" accent="cyan" />
            <StatCard label="Befehle" value={demoStats.befehle} icon={Terminal} href="/befehle" accent="violet" />
            <StatCard label="Fehleranalysen" value={demoStats.fehleranalysen} icon={Bug} href="/fehleranalyse" accent="amber" />
            <StatCard label="Docker-Dienste" value={demoStats.dockerDienste} icon={Container} href="/docker-dienste" accent="emerald" />
          </div>
        )}
      </div>

      {/* Personal workspace – logged-in only */}
      {user && (
        <div>
          <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
            Persönlicher Arbeitsbereich
          </h2>

          {personalStatsLoading && <LoadingState />}
          {personalStatsError && <ErrorState />}

          {!personalStatsLoading && !personalStatsError && personalStats && personalIsEmpty && (
            <div className="rounded-xl border border-blue-500/10 bg-white p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mx-auto mb-4">
                <FlaskConical size={20} className="text-blue-700" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Willkommen in Ihrem Arbeitsbereich</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto mb-6">
                Starten Sie Ihre persönliche Dokumentation. Erstellen Sie Labore, dokumentieren Sie Systeme,
                sammeln Sie Befehle und halten Sie Troubleshooting-Erfahrungen fest.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/labore"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors">
                  <Plus size={14} />Erstes Labor erstellen
                </Link>
                <Link href="/praxisnotizen"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-50 border border-slate-200 text-sm font-medium text-slate-700 transition-colors">
                  <Plus size={14} />Praxisnotiz erstellen
                </Link>
                <Link href="/labore"
                  className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-700 transition-colors">
                  Beispielinhalte ansehen →
                </Link>
              </div>
            </div>
          )}

          {!personalStatsLoading && !personalStatsError && personalStats && !personalIsEmpty && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard label="Meine Labore" value={personalStats.labore} icon={FlaskConical} href="/labore" accent="blue" />
              <StatCard label="Meine Systeme" value={personalStats.systeme} icon={Server} href="/systeme" accent="cyan" />
              <StatCard label="Meine Befehle" value={personalStats.befehle} icon={Terminal} href="/befehle" accent="violet" />
              <StatCard label="Fehleranalysen" value={personalStats.fehleranalysen} icon={Bug} href="/fehleranalyse" accent="amber" />
              <StatCard label="Docker-Dienste" value={personalStats.dockerDienste} icon={Container} href="/docker-dienste" accent="emerald" />
              <StatCard label="Notizen" value={personalStats.notizen} icon={StickyNote} href="/praxisnotizen" accent="blue" />
            </div>
          )}
        </div>
      )}

      {/* Purpose section */}
      <div className="rounded-xl border border-slate-200 bg-blue-50 p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0 mt-0.5">
            <Info size={15} className="text-blue-700" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Über diese Plattform</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Diese Plattform dient der strukturierten Dokumentation praktischer IT-Laborumgebungen,
              technischer Systeme, administrativer Befehle und typischer Fehleranalysen im Bereich
              Systemintegration.
            </p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
          Schnellzugriff
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: "/labore", label: "Labore", desc: "Dokumentierte IT-Laborumgebungen", icon: FlaskConical },
            { href: "/systeme", label: "Systeme", desc: "Infrastruktur- und Systemdokumentation", icon: Server },
            { href: "/befehle", label: "Befehle", desc: "Admin-Befehlsreferenz mit Beispielen", icon: Terminal },
            { href: "/fehleranalyse", label: "Fehleranalyse", desc: "Troubleshooting-Fälle strukturiert", icon: Bug },
            { href: "/docker-dienste", label: "Docker-Dienste", desc: "Container-Dienste und Compose-Snippets", icon: Container },
            { href: "/praxisnotizen", label: "Praxisnotizen", desc: "Persönlicher Notiz- und Aufgabenbereich", icon: StickyNote },
            { href: "/portfolio", label: "Portfolio", desc: "Projektzusammenfassung und Technologien", icon: BookOpen },
          ].map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-blue-50 hover:bg-blue-50 hover:border-blue-500/20 transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-slate-600 group-hover:text-blue-700 transition-colors" />
                <div>
                  <p className="text-sm font-medium text-slate-800">{label}</p>
                  <p className="text-xs text-slate-600">{desc}</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-500 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
