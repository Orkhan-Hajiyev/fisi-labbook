"use client";

import { T, useT } from "@/components/TranslatedText";

import { useEffect, useState } from "react";
import {
  FlaskConical, Server, Terminal, Bug, Container, BookOpen,
  StickyNote, ArrowRight, Info, Plus, } from "lucide-react";
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
  const translateUI = useT();
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
      {/* Logged-in dashboard is a personal workspace, not the public marketing hero. */}
      {user ? (
        <section className="fisi-hero rounded-[24px] p-6 sm:p-8">
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-blue-700 mb-2">FISI LabBook · Persönlicher Workspace</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#153a5c]">Willkommen zurück{user.user_metadata?.name ? `, ${String(user.user_metadata.name).split(" ")[0]}` : ""}!</h1>
              <p className="mt-2 text-sm text-[#50718b] max-w-xl">Deine IT-Dokumentation, eigenen Labore und Praxisnotizen an einem Ort. Die nachfolgenden Kennzahlen beziehen sich auf deinen eigenen Account.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/workspace" className="px-4 py-2.5 rounded-xl bg-[#176cba] text-white font-bold text-sm hover:bg-[#0b599f]"><T>Mein Workspace</T><ArrowRight size={15} className="inline ml-1" /></Link>
              <Link href="/beispiele" className="px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-blue-700 font-bold text-sm hover:bg-blue-50">Beispiele ansehen</Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="fisi-hero fisi-tech-grid rounded-[24px] p-6 sm:p-8">
          <p className="text-[11px] text-blue-700 font-bold uppercase tracking-[.14em] mb-2">FISI LabBook · Eingeschränkte Demo</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#153a5c]">IT-Labore und Beispiele entdecken</h1>
          <p className="text-sm text-[#50718b] mt-3 max-w-2xl">Ohne Registrierung kannst du öffentlich freigegebene Beispiele ansehen. Für eigene Labore, Notizen und vollständige Workspace-Funktionen ist ein kostenloses Konto erforderlich.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link href="/beispiele" className="px-4 py-2.5 rounded-xl bg-[#176cba] text-white text-sm font-bold">Gefüllten Beispiel-Workspace ansehen →</Link>
            <Link href="/registrieren" className="px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-blue-800 text-sm font-bold">Kostenlos registrieren</Link>
          </div>
        </section>
      )}

      {!user && (
      <div>
      {/* Demo stats */}
      <div>
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
          Dokumentationsübersicht
        </h2>
        {demoLoading && <LoadingState />}
        {demoError && <ErrorState />}
        {!demoLoading && !demoError && demoStats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard label={translateUI("Labore")} value={demoStats.labore} icon={FlaskConical} href="/labore" accent="blue" />
            <StatCard label={translateUI("Systeme")} value={demoStats.systeme} icon={Server} href="/systeme" accent="cyan" />
            <StatCard label={translateUI("Befehle")} value={demoStats.befehle} icon={Terminal} href="/befehle" accent="violet" />
            <StatCard label={translateUI("Fehleranalysen")} value={demoStats.fehleranalysen} icon={Bug} href="/fehleranalyse" accent="amber" />
            <StatCard label={translateUI("Docker-Dienste")} value={demoStats.dockerDienste} icon={Container} href="/docker-dienste" accent="emerald" />
          </div>
        )}
      </div>
      </div>
      )}
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
              <StatCard label={translateUI("Meine Labore")} value={personalStats.labore} icon={FlaskConical} href="/labore" accent="blue" />
              <StatCard label={translateUI("Meine Systeme")} value={personalStats.systeme} icon={Server} href="/systeme" accent="cyan" />
              <StatCard label={translateUI("Meine Befehle")} value={personalStats.befehle} icon={Terminal} href="/befehle" accent="violet" />
              <StatCard label={translateUI("Fehleranalysen")} value={personalStats.fehleranalysen} icon={Bug} href="/fehleranalyse" accent="amber" />
              <StatCard label={translateUI("Docker-Dienste")} value={personalStats.dockerDienste} icon={Container} href="/docker-dienste" accent="emerald" />
              <StatCard label={translateUI("Notizen")} value={personalStats.notizen} icon={StickyNote} href="/praxisnotizen" accent="blue" />
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
            { href: "/labore", label: translateUI("Labore"), desc: "Dokumentierte IT-Laborumgebungen", icon: FlaskConical },
            { href: "/systeme", label: translateUI("Systeme"), desc: "Infrastruktur- und Systemdokumentation", icon: Server },
            { href: "/befehle", label: translateUI("Befehle"), desc: "Admin-Befehlsreferenz mit Beispielen", icon: Terminal },
            { href: "/fehleranalyse", label: translateUI("Fehleranalyse"), desc: "Troubleshooting-Fälle strukturiert", icon: Bug },
            { href: "/docker-dienste", label: translateUI("Docker-Dienste"), desc: "Container-Dienste und Compose-Snippets", icon: Container },
            { href: "/praxisnotizen", label: translateUI("Praxisnotizen"), desc: "Persönlicher Notiz- und Aufgabenbereich", icon: StickyNote },
            { href: "/portfolio", label: translateUI("Portfolio"), desc: "Projektzusammenfassung und Technologien", icon: BookOpen },
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
