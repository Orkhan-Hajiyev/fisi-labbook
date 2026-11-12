"use client";

import { T, useT } from "@/components/TranslatedText";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { language } = useLanguage();
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
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-blue-700 mb-2"><T>FISI LabBook · Persönlicher Workspace</T></p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#153a5c]">{language === "de" ? "Willkommen zurück" : "Yenidən xoş gəlmisən"}{user.user_metadata?.name ? `, ${String(user.user_metadata.name).split(" ")[0]}` : ""}!</h1>
              <p className="mt-2 text-sm text-[#50718b] max-w-xl">{language === "de" ? "Deine IT-Dokumentation, eigenen Labore und Praxisnotizen an einem Ort. Die nachfolgenden Kennzahlen beziehen sich auf deinen eigenen Account." : "IT sənədlərin, şəxsi laboratoriyaların və praktiki qeydlərin bir yerdədir. Aşağıdakı göstəricilər yalnız sənin hesabına aiddir."}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/workspace" className="px-4 py-2.5 rounded-xl bg-[#176cba] text-white font-bold text-sm hover:bg-[#0b599f]"><T>Mein Workspace</T><ArrowRight size={15} className="inline ml-1" /></Link>
              <Link href="/beispiele" className="px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-blue-700 font-bold text-sm hover:bg-blue-50"><T>Beispiele ansehen</T></Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="fisi-hero fisi-tech-grid rounded-[24px] p-6 sm:p-8">
          <p className="text-[11px] text-blue-700 font-bold uppercase tracking-[.14em] mb-2"><T>FISI LabBook · Eingeschränkte Demo</T></p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#153a5c]"><T>IT-Labore und Beispiele entdecken</T></h1>
          <p className="text-sm text-[#50718b] mt-3 max-w-2xl">{language === "de" ? "Ohne Registrierung kannst du öffentlich freigegebene Beispiele ansehen. Für eigene Labore, Notizen und vollständige Workspace-Funktionen ist ein kostenloses Konto erforderlich." : "Qeydiyyatsız açıq nümunələrə baxa bilərsən. Şəxsi laboratoriyalar, qeydlər və bütün iş mühiti funksiyaları üçün pulsuz hesab lazımdır."}</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link href="/beispiele" className="px-4 py-2.5 rounded-xl bg-[#176cba] text-white text-sm font-bold"><T>Gefüllten Beispiel-Workspace ansehen →</T></Link>
            <Link href="/registrieren" className="px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-blue-800 text-sm font-bold"><T>Kostenlos registrieren</T></Link>
          </div>
        </section>
      )}

      {!user && (
      <div>
      {/* Demo stats */}
      <div>
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
          <T>Dokumentationsübersicht</T>
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
            <T>Persönlicher Arbeitsbereich</T>
          </h2>

          {personalStatsLoading && <LoadingState />}
          {personalStatsError && <ErrorState />}

          {!personalStatsLoading && !personalStatsError && personalStats && personalIsEmpty && (
            <div className="rounded-xl border border-blue-500/10 bg-white p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mx-auto mb-4">
                <FlaskConical size={20} className="text-blue-700" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2"><T>Willkommen in Ihrem Arbeitsbereich</T></h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto mb-6">
                {language === "de" ? "Starte deine persönliche Dokumentation. Erstelle Labore, dokumentiere Systeme, sammle Befehle und halte Erfahrungen aus der Fehleranalyse fest." : "Şəxsi sənədləşdirməyə başla. Laboratoriyalar yarat, sistemləri sənədləşdir, əmrləri topla və xəta təhlili təcrübələrini qeyd et."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/labore"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors">
                  <Plus size={14} /><T>Erstes Labor erstellen</T>
                </Link>
                <Link href="/praxisnotizen"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-50 border border-slate-200 text-sm font-medium text-slate-700 transition-colors">
                  <Plus size={14} /><T>Praxisnotiz erstellen</T>
                </Link>
                <Link href="/labore"
                  className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-700 transition-colors">
                  <T>Beispielinhalte ansehen →</T>
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
            <h2 className="text-sm font-semibold text-slate-900 mb-2"><T>Über diese Plattform</T></h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {language === "de" ? "Diese Plattform dient der strukturierten Dokumentation praktischer IT-Laborumgebungen, technischer Systeme, administrativer Befehle und typischer Fehleranalysen im Bereich Systemintegration." : "Bu platforma sistem inteqrasiyası üzrə praktiki IT laboratoriyalarını, texniki sistemləri, inzibati əmrləri və tipik xəta halları haqqında məlumatları ardıcıl sənədləşdirmək üçün nəzərdə tutulub."}
            </p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
          <T>Schnellzugriff</T>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: "/labore", label: translateUI("Labore"), desc: translateUI("Dokumentierte IT-Laborumgebungen"), icon: FlaskConical },
            { href: "/systeme", label: translateUI("Systeme"), desc: translateUI("Infrastruktur- und Systemdokumentation"), icon: Server },
            { href: "/befehle", label: translateUI("Befehle"), desc: translateUI("Admin-Befehlsreferenz mit Beispielen"), icon: Terminal },
            { href: "/fehleranalyse", label: translateUI("Fehleranalyse"), desc: translateUI("Troubleshooting-Fälle strukturiert"), icon: Bug },
            { href: "/docker-dienste", label: translateUI("Docker-Dienste"), desc: translateUI("Container-Dienste und Compose-Snippets"), icon: Container },
            { href: "/praxisnotizen", label: translateUI("Praxisnotizen"), desc: translateUI("Persönlicher Notiz- und Aufgabenbereich"), icon: StickyNote },
            { href: "/portfolio", label: translateUI("Portfolio"), desc: translateUI("Projektzusammenfassung und Technologien"), icon: BookOpen },
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
