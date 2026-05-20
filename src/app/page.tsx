"use client";

import { useEffect, useState } from "react";
import {
  FlaskConical,
  Server,
  Terminal,
  Bug,
  Container,
  BookOpen,
  ArrowRight,
  Info,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";

interface Stats {
  labore: number;
  systeme: number;
  befehle: number;
  fehleranalysen: number;
  dockerDienste: number;
}

export default function UebersichtPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(!supabaseConfigMissing);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;

    async function fetchStats() {
      try {
        const [labs, systems, commands, troubleshooting, docker] = await Promise.all([
          supabase!.from("fisi_labs").select("id", { count: "exact", head: true }),
          supabase!.from("fisi_systems").select("id", { count: "exact", head: true }),
          supabase!.from("fisi_commands").select("id", { count: "exact", head: true }),
          supabase!.from("fisi_troubleshooting_cases").select("id", { count: "exact", head: true }),
          supabase!.from("fisi_docker_services").select("id", { count: "exact", head: true }),
        ]);

        if (labs.error || systems.error || commands.error || troubleshooting.error || docker.error) {
          setError(true);
          return;
        }

        setStats({
          labore: labs.count ?? 0,
          systeme: systems.count ?? 0,
          befehle: commands.count ?? 0,
          fehleranalysen: troubleshooting.count ?? 0,
          dockerDienste: docker.count ?? 0,
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-[#111827] via-[#0f1623] to-[#0d1117] p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BookOpen size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">FISI LabBook</h1>
              <p className="text-sm text-blue-400/80 font-medium">
                Systemintegration Labor- und Troubleshooting-Plattform
              </p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-2xl">
            Eine praxisorientierte Plattform zur Dokumentation von IT-Laboren, Systemen, Befehlen,
            Docker-Diensten und Fehleranalysen im Bereich Fachinformatiker für Systemintegration.
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Dokumentationsübersicht
        </h2>
        {loading && <LoadingState />}
        {error && <ErrorState />}
        {!loading && !error && stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard label="Labore" value={stats.labore} icon={FlaskConical} href="/labore" accent="blue" />
            <StatCard label="Systeme" value={stats.systeme} icon={Server} href="/systeme" accent="cyan" />
            <StatCard label="Befehle" value={stats.befehle} icon={Terminal} href="/befehle" accent="violet" />
            <StatCard
              label="Fehleranalysen"
              value={stats.fehleranalysen}
              icon={Bug}
              href="/fehleranalyse"
              accent="amber"
            />
            <StatCard
              label="Docker-Dienste"
              value={stats.dockerDienste}
              icon={Container}
              href="/docker-dienste"
              accent="emerald"
            />
          </div>
        )}
      </div>

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
            {
              href: "/docker-dienste",
              label: "Docker-Dienste",
              desc: "Container-Dienste und Compose-Snippets",
              icon: Container,
            },
            {
              href: "/portfolio",
              label: "Portfolio",
              desc: "Projektzusammenfassung und Technologien",
              icon: BookOpen,
            },
          ].map(({ href, label, desc, icon: Icon }) => (
            <a
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
              <ArrowRight
                size={14}
                className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
