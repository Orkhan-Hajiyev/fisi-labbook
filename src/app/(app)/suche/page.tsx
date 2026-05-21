"use client";

import { useState, useCallback } from "react";
import {
  Search, FlaskConical, Server, Terminal, Bug, Container, StickyNote,
  Lock, X,
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

interface SearchResults {
  labs: FisiUserLab[];
  systems: FisiUserSystem[];
  commands: FisiUserCommand[];
  troubleshooting: FisiUserTroubleshootingCase[];
  docker: FisiUserDockerService[];
  notes: FisiUserNote[];
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-blue-500/30 text-blue-200 rounded px-0.5">{part}</mark>
      : part
  );
}

function ResultSection<T extends { id: string }>({
  icon: Icon, title, items, href, accent, renderItem,
}: {
  icon: React.ElementType;
  title: string;
  items: T[];
  href: string;
  accent: string;
  renderItem: (item: T) => React.ReactNode;
}) {
  if (items.length === 0) return null;

  const accentMap: Record<string, string> = {
    blue:    "text-blue-400",
    cyan:    "text-cyan-400",
    violet:  "text-violet-400",
    amber:   "text-amber-400",
    emerald: "text-emerald-400",
    slate:   "text-slate-400",
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className={accentMap[accent] ?? "text-slate-400"} />
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
        <span className="text-[10px] bg-white/5 text-slate-500 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <Link key={item.id} href={href}
            className="block rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] p-4 transition-all duration-150">
            {renderItem(item)}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SuchePage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const total = results
    ? results.labs.length + results.systems.length + results.commands.length +
      results.troubleshooting.length + results.docker.length + results.notes.length
    : 0;

  const runSearch = useCallback(async (q: string) => {
    if (!user || !supabase || !q.trim()) return;
    setLoading(true);
    setSearched(true);

    const uid = user.id;
    const term = `%${q}%`;

    const [labs, systems, commands, troubleshooting, docker, notes] = await Promise.all([
      supabase.from("fisi_user_labs").select("*").eq("user_id", uid)
        .or(`title.ilike.${term},topic.ilike.${term},goal.ilike.${term},description.ilike.${term},environment.ilike.${term}`),
      supabase.from("fisi_user_systems").select("*").eq("user_id", uid)
        .or(`hostname.ilike.${term},os.ilike.${term},role.ilike.${term},ip_address.ilike.${term},dns.ilike.${term},domain_name.ilike.${term},notes.ilike.${term}`),
      supabase.from("fisi_user_commands").select("*").eq("user_id", uid)
        .or(`command.ilike.${term},platform.ilike.${term},category.ilike.${term},purpose.ilike.${term},example.ilike.${term},typical_use_case.ilike.${term},notes.ilike.${term}`),
      supabase.from("fisi_user_troubleshooting_cases").select("*").eq("user_id", uid)
        .or(`title.ilike.${term},category.ilike.${term},symptoms.ilike.${term},checks.ilike.${term},root_cause.ilike.${term},solution.ilike.${term},result.ilike.${term}`),
      supabase.from("fisi_user_docker_services").select("*").eq("user_id", uid)
        .or(`name.ilike.${term},image.ilike.${term},purpose.ilike.${term},notes.ilike.${term},service_type.ilike.${term}`),
      supabase.from("fisi_user_notes").select("*").eq("user_id", uid)
        .or(`title.ilike.${term},content.ilike.${term},category.ilike.${term},related_area.ilike.${term}`),
    ]);

    setResults({
      labs: (labs.data ?? []) as FisiUserLab[],
      systems: (systems.data ?? []) as FisiUserSystem[],
      commands: (commands.data ?? []) as FisiUserCommand[],
      troubleshooting: (troubleshooting.data ?? []) as FisiUserTroubleshootingCase[],
      docker: (docker.data ?? []) as FisiUserDockerService[],
      notes: (notes.data ?? []) as FisiUserNote[],
    });
    setLoading(false);
  }, [user]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") runSearch(query);
  }

  function clearSearch() {
    setQuery("");
    setResults(null);
    setSearched(false);
  }

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  return (
    <div>
      <PageHeader
        icon={Search}
        title="Globale Suche"
        description="Gesamten persönlichen Workspace durchsuchen"
      />

      {!user ? (
        <div className="rounded-xl border border-blue-500/10 bg-[#0f1623] p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-blue-400" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-2">Anmeldung erforderlich</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            Die globale Suche ist für angemeldete Benutzer verfügbar.
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
      ) : (
        <div className="space-y-6">
          {/* Search input */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Gesamten Workspace durchsuchen…"
              className="w-full pl-11 pr-24 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {query && (
                <button onClick={clearSearch} className="p-1 text-slate-600 hover:text-slate-400 transition-colors">
                  <X size={14} />
                </button>
              )}
              <button
                onClick={() => runSearch(query)}
                disabled={!query.trim()}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white transition-colors"
              >
                Suchen
              </button>
            </div>
          </div>

          {loading && <LoadingState text="Suche läuft…" />}

          {!loading && searched && total === 0 && (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-10 text-center">
              <Search size={28} className="text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Keine Ergebnisse gefunden.</p>
              <p className="text-xs text-slate-600 mt-1">Versuchen Sie einen anderen Suchbegriff.</p>

            </div>
          )}

          {!loading && searched && total > 0 && (
            <div className="space-y-6">
              <p className="text-xs text-slate-500">
                <span className="text-white font-semibold">{total}</span>{" "}
                Ergebnisse für{" "}
                <span className="text-blue-400">&bdquo;{query}&ldquo;</span>
              </p>

              <ResultSection
                icon={FlaskConical} title="Labore" items={results!.labs} href="/labore" accent="blue"
                renderItem={(lab) => (
                  <div>
                    <p className="text-sm font-medium text-white">{highlight(lab.title, query)}</p>
                    {lab.topic && <p className="text-xs text-slate-500 mt-0.5">{highlight(lab.topic, query)}</p>}
                    {lab.goal && <p className="text-xs text-slate-600 mt-1 line-clamp-1">{highlight(lab.goal, query)}</p>}
                  </div>
                )}
              />

              <ResultSection
                icon={Server} title="Systeme" items={results!.systems} href="/systeme" accent="cyan"
                renderItem={(sys) => (
                  <div>
                    <p className="text-sm font-medium text-white font-mono">{highlight(sys.hostname, query)}</p>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {sys.ip_address && <span className="text-xs text-slate-500">{highlight(sys.ip_address, query)}</span>}
                      {sys.os && <span className="text-xs text-slate-500">{highlight(sys.os, query)}</span>}
                      {sys.role && <span className="text-xs text-slate-500">{highlight(sys.role, query)}</span>}
                    </div>
                  </div>
                )}
              />

              <ResultSection
                icon={Terminal} title="Befehle" items={results!.commands} href="/befehle" accent="violet"
                renderItem={(cmd) => (
                  <div>
                    <code className="text-sm font-mono text-violet-300">{highlight(cmd.command, query)}</code>
                    {cmd.purpose && <p className="text-xs text-slate-500 mt-0.5">{highlight(cmd.purpose, query)}</p>}
                    {cmd.platform && <span className="text-[11px] text-slate-600">{cmd.platform}</span>}
                  </div>
                )}
              />

              <ResultSection
                icon={Bug} title="Fehleranalysen" items={results!.troubleshooting} href="/fehleranalyse" accent="amber"
                renderItem={(t) => (
                  <div>
                    <p className="text-sm font-medium text-white">{highlight(t.title, query)}</p>
                    {t.symptoms && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{highlight(t.symptoms, query)}</p>}
                    {t.category && <span className="text-[11px] text-slate-600">{t.category}</span>}
                  </div>
                )}
              />

              <ResultSection
                icon={Container} title="Docker-Dienste" items={results!.docker} href="/docker-dienste" accent="emerald"
                renderItem={(d) => (
                  <div>
                    <p className="text-sm font-medium text-white">{highlight(d.name, query)}</p>
                    {d.image && <p className="text-xs text-slate-500 mt-0.5 font-mono">{highlight(d.image, query)}</p>}
                    {d.purpose && <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{highlight(d.purpose, query)}</p>}
                  </div>
                )}
              />

              <ResultSection
                icon={StickyNote} title="Praxisnotizen" items={results!.notes} href="/praxisnotizen" accent="slate"
                renderItem={(n) => (
                  <div>
                    <p className="text-sm font-medium text-white">{highlight(n.title, query)}</p>
                    {n.content && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{highlight(n.content, query)}</p>}
                    {n.category && <span className="text-[11px] text-slate-600">{n.category}</span>}
                  </div>
                )}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
