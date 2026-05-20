"use client";

import { useEffect, useState } from "react";
import { Container, CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import type { FisiDockerService } from "@/lib/types";

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s === "running" || s === "aktiv" || s === "up") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
        <CheckCircle2 size={10} /> Aktiv
      </span>
    );
  }
  if (s === "stopped" || s === "inaktiv" || s === "down") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] bg-red-500/15 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full">
        <XCircle size={10} /> Inaktiv
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] bg-slate-500/15 text-slate-400 border border-slate-500/20 px-2.5 py-1 rounded-full">
      <Clock size={10} /> {status}
    </span>
  );
}

export default function DockerDienstePage() {
  const [services, setServices] = useState<FisiDockerService[]>([]);
  const [loading, setLoading] = useState(!supabaseConfigMissing);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;
    supabase
      .from("fisi_docker_services")
      .select("*")
      .order("name", { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError(true);
        else setServices(data ?? []);
        setLoading(false);
      });
  }, []);

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  return (
    <div>
      <PageHeader
        icon={Container}
        title="Docker-Dienste"
        description="Dokumentierte Container-Dienste mit Images, Ports und Compose-Snippets"
      />

      {loading && <LoadingState />}
      {error && <ErrorState />}
      {!loading && !error && services.length === 0 && (
        <EmptyState
          title="Keine Docker-Dienste vorhanden"
          description="Es wurden noch keine Dienste dokumentiert."
        />
      )}
      {!loading && !error && services.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-150 p-5 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
                    <Container size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{svc.name}</h3>
                    {svc.service_type && (
                      <p className="text-[11px] text-slate-500">{svc.service_type}</p>
                    )}
                  </div>
                </div>
                <StatusBadge status={svc.status} />
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-2">
                {svc.image && (
                  <MetaField label="Image">
                    <code className="text-xs font-mono text-slate-300">{svc.image}</code>
                  </MetaField>
                )}
                {svc.port && (
                  <MetaField label="Port">
                    <div className="flex items-center gap-1">
                      <ExternalLink size={10} className="text-slate-500" />
                      <code className="text-xs font-mono text-cyan-300">{svc.port}</code>
                    </div>
                  </MetaField>
                )}
              </div>

              {/* Purpose */}
              {svc.purpose && (
                <p className="text-xs text-slate-400 leading-relaxed">{svc.purpose}</p>
              )}

              {/* Compose snippet */}
              {svc.compose_snippet && (
                <div>
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                    Docker Compose
                  </p>
                  <div className="rounded-lg bg-[#0a0c10] border border-white/5 overflow-hidden">
                    <div className="px-3 py-1.5 bg-white/[0.03] border-b border-white/5 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500/60" />
                      <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                      <span className="text-[10px] text-slate-600 ml-1">docker-compose.yml</span>
                    </div>
                    <pre className="p-4 text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
                      <code>{svc.compose_snippet}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Notes */}
              {svc.notes && (
                <p className="text-xs text-slate-500 leading-relaxed border-t border-white/5 pt-3">
                  {svc.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MetaField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white/[0.02] border border-white/5 px-3 py-2">
      <p className="text-[10px] text-slate-600 mb-0.5">{label}</p>
      {children}
    </div>
  );
}
