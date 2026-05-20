"use client";

import { useEffect, useState } from "react";
import {
  FlaskConical, Server, Terminal, Bug, Container, BookOpen,
  StickyNote, ArrowRight, Info, Plus,
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

  const [demoStats, setDemoStats] = useState<DemoStats | null>(null);
  const [demoLoading, setDemoLoading] = useState(!supabaseConfigMissing);
  const [demoError, setDemoError] = useState(false);

  const [personalStats, setPersonalStats] = useState<PersonalStats | null>(null);
  const [personalStatsError, setPersonalStatsError] = useState(false);
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
    if (!user || !supabase) return;
    Promise.all([
      supabase!.from("fisi_user_labs").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase!.from("fisi_user_systems").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase!.from("fisi_user_commands").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase!.from("fisi_user_troubleshooting_cases").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase!.from("fisi_user_docker_services").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase!.from("fisi_user_notes").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]).then(([labs, systems, commands, troubleshooting, docker, notes]) => {
      if (labs.error || systems.error || commands.error || troubleshooting.error || docker.error || notes.error) {
        setPersonalStatsError(true);
      } else {
        setPersonalStats({
          labore: labs.count ?? 0,
          systeme: systems.count ?? 0,
          befehle: commands.count ?? 0,
          fehleranalysen: troubleshooting.count ?? 0,
          dockerDienste: docker.count ?? 0,
          notizen: notes.count ?? 0,
        });
      }
    });
  }, [user]);

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
      <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-[#111827] via-[#0f1623] to-[#0d1117] p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 pointer-events-none" />
        <div className="relative">
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-cyan-500/20 bg-cyan-500/5 text-cyan-500/70">
              OrikOS-Ökosystemprojekt
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#161b27] border border-white/10 shadow-lg shadow-black/50 flex items-center justify-center shrink-0">
              <span className="text-xl font-black tracking-tight bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-none select-none">
                FL
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">FISI LabBook</h1>
              <p className="text-sm text-blue-400/80 font-medium">
                Systemintegration Labor- und Troubleshooting-Plattform
              </p>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed max-w-2xl mb-4">
            Eine praxisorientierte Plattform zur Dokumentation von IT-Laboren, Systemen, Befehlen,
            Docker-Diensten und Fehleranalysen im Bereich Fachinformatiker für Systemintegration.
          </p>

          <div className="border-t border-white/5 pt-4">
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              Ein OrikOS-Projekt innerhalb der OrikLab-Webplattform – für praxisnahe
              Systemintegration, technische Dokumentation und strukturierte Fehleranalyse.
            </p>
          </div>
        </div>
      </div>

      {/* Demo stats */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
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
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Persönlicher Arbeitsbereich
          </h2>

          {personalStatsLoading && <LoadingState />}
          {personalStatsError && <ErrorState />}

          {!personalStatsLoading && !personalStatsError && personalStats && personalIsEmpty && (
            <div className="rounded-xl border border-blue-500/10 bg-[#0f1623] p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mx-auto mb-4">
                <FlaskConical size={20} className="text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">Willkommen in Ihrem Arbeitsbereich</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-6">
                Starten Sie Ihre persönliche Dokumentation. Erstellen Sie Labore, dokumentieren Sie Systeme,
                sammeln Sie Befehle und halten Sie Troubleshooting-Erfahrungen fest.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/labore"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors">
                  <Plus size={14} />Erstes Labor erstellen
                </Link>
                <Link href="/praxisnotizen"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-slate-300 transition-colors">
                  <Plus size={14} />Praxisnotiz erstellen
                </Link>
                <Link href="/labore"
                  className="px-4 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-300 transition-colors">
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
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0 mt-0.5">
            <Info size={15} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white mb-2">Über diese Plattform</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Diese Plattform dient der strukturierten Dokumentation praktischer IT-Laborumgebungen,
              technischer Systeme, administrativer Befehle und typischer Fehleranalysen im Bereich
              Systemintegration.
            </p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
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
              className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/20 transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                <div>
                  <p className="text-sm font-medium text-slate-200">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
