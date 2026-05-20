"use client";

import { useEffect, useState } from "react";
import { FlaskConical, Calendar, CheckCircle2, Clock, Archive, Circle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import type { FisiLab } from "@/lib/types";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

type StatusConfig = {
  label: string;
  className: string;
  icon: React.ReactNode;
};

function getStatusConfig(status: string | null): StatusConfig {
  switch (status) {
    case "planned":
      return { label: "Geplant", className: "bg-slate-500/15 text-slate-400 border-slate-500/20", icon: <Circle size={10} /> };
    case "in_progress":
      return { label: "In Bearbeitung", className: "bg-blue-500/15 text-blue-400 border-blue-500/20", icon: <Clock size={10} /> };
    case "completed":
      return { label: "Abgeschlossen", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: <CheckCircle2 size={10} /> };
    case "archived":
      return { label: "Archiviert", className: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: <Archive size={10} /> };
    default:
      return { label: status ?? "—", className: "bg-white/5 text-slate-400 border-white/10", icon: <Circle size={10} /> };
  }
}

export default function LaborePage() {
  const [labs, setLabs] = useState<FisiLab[]>([]);
  const [loading, setLoading] = useState(!supabaseConfigMissing);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;
    supabase
      .from("fisi_labs")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(true);
        else setLabs(data ?? []);
        setLoading(false);
      });
  }, []);

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  return (
    <div>
      <PageHeader
        icon={FlaskConical}
        title="Labore"
        description="Dokumentierte IT-Laborumgebungen im Bereich Systemintegration"
      />

      {loading && <LoadingState />}
      {error && <ErrorState />}
      {!loading && !error && labs.length === 0 && (
        <EmptyState
          title="Keine Labore vorhanden"
          description="Es wurden noch keine Labor-Einträge angelegt."
        />
      )}
      {!loading && !error && labs.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {labs.map((lab) => {
            const status = getStatusConfig(lab.status);
            return (
              <div
                key={lab.id}
                className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.035] hover:border-white/10 transition-all duration-150 p-5 space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white leading-snug">{lab.title}</h3>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${status.className}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-3">
                  {lab.topic && (
                    <span className="text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/15 px-2 py-0.5 rounded-md">
                      {lab.topic}
                    </span>
                  )}
                  {lab.environment && (
                    <span className="text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/15 px-2 py-0.5 rounded-md">
                      {lab.environment}
                    </span>
                  )}
                </div>

                {/* Fields */}
                <div className="space-y-2.5">
                  {lab.goal && (
                    <FieldRow label="Ziel" value={lab.goal} />
                  )}
                  {lab.description && (
                    <FieldRow label="Beschreibung" value={lab.description} multiline />
                  )}
                </div>

                {/* Dates */}
                {(lab.started_at || lab.completed_at) && (
                  <div className="flex flex-wrap gap-4 pt-2 border-t border-white/5">
                    {lab.started_at && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={11} />
                        <span>Start: {formatDate(lab.started_at)}</span>
                      </div>
                    )}
                    {lab.completed_at && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <CheckCircle2 size={11} />
                        <span>Abschluss: {formatDate(lab.completed_at)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FieldRow({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className={multiline ? "space-y-1" : "flex gap-2"}>
      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider shrink-0">
        {label}
      </span>
      <p className={`text-xs text-slate-300 leading-relaxed ${!multiline ? "flex-1" : ""}`}>{value}</p>
    </div>
  );
}
