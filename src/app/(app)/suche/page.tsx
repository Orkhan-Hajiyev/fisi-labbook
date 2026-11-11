"use client";

import { useState, useCallback, useRef } from "react";
import {
  Search, FlaskConical, Server, Terminal, Bug, Container, StickyNote,
  Lock, X,
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import { buildSearchOrFilter } from "@/lib/search-filter";
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
    blue:    "text-blue-700",
    cyan:    "text-cyan-700",
    violet:  "text-violet-700",
    amber:   "text-amber-700",
    emerald: "text-emerald-700",
    slate:   "text-slate-600",
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className={accentMap[accent] ?? "text-slate-600"} />
        <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{title}</h3>
        <span className="text-[10px] bg-blue-50 text-slate-600 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <Link key={item.id} href={href}
            className="block rounded-xl border border-slate-200 bg-blue-50 hover:border-slate-200 hover:bg-blue-50 p-4 transition-all duration-150">
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
  const [searchedTerm, setSearchedTerm] = useState("");
  const [searchOwner, setSearchOwner] = useState<string | null>(null);
  const [searchError, setSearchError] = useState(false);
  const requestId = useRef(0);

  // A previous user's results must never appear after an account switch.
  const visibleResults = searchOwner === user?.id ? results : null;
  const visibleSearched = searched && searchOwner === user?.id;

  const total = visibleResults
    ? visibleResults.labs.length + visibleResults.systems.length + visibleResults.commands.length +
      visibleResults.troubleshooting.length + visibleResults.docker.length + visibleResults.notes.length
    : 0;

  const runSearch = useCallback(async (q: string) => {
    if (!user || !supabase || !q.trim()) return;
    const currentRequest = ++requestId.current;
    const normalizedQuery = q.trim().slice(0, 120);
    setLoading(true);
    setSearched(false);
    setSearchError(false);
    setResults(null);

    const uid = user.id;

    try {
      const [labs, systems, commands, troubleshooting, docker, notes] = await Promise.all([
        supabase.from("fisi_user_labs").select("*").eq("user_id", uid)
          .or(buildSearchOrFilter(["title", "topic", "goal", "description", "environment"], normalizedQuery)),
        supabase.from("fisi_user_systems").select("*").eq("user_id", uid)
          .or(buildSearchOrFilter(["hostname", "os", "role", "ip_address", "dns", "domain_name", "notes"], normalizedQuery)),
        supabase.from("fisi_user_commands").select("*").eq("user_id", uid)
          .or(buildSearchOrFilter(["command", "platform", "category", "purpose", "example", "typical_use_case", "notes"], normalizedQuery)),
        supabase.from("fisi_user_troubleshooting_cases").select("*").eq("user_id", uid)
          .or(buildSearchOrFilter(["title", "category", "symptoms", "checks", "root_cause", "solution", "result"], normalizedQuery)),
        supabase.from("fisi_user_docker_services").select("*").eq("user_id", uid)
          .or(buildSearchOrFilter(["name", "image", "purpose", "notes", "service_type"], normalizedQuery)),
        supabase.from("fisi_user_notes").select("*").eq("user_id", uid)
          .or(buildSearchOrFilter(["title", "content", "category", "related_area"], normalizedQuery)),
      ]);

      // Supabase resolves failed requests with an error instead of throwing.
      if ([labs, systems, commands, troubleshooting, docker, notes].some((response) => response.error)) {
        throw new Error("Workspace search failed");
      }
      if (currentRequest !== requestId.current) return;

      setResults({
        labs: (labs.data ?? []) as FisiUserLab[],
        systems: (systems.data ?? []) as FisiUserSystem[],
        commands: (commands.data ?? []) as FisiUserCommand[],
        troubleshooting: (troubleshooting.data ?? []) as FisiUserTroubleshootingCase[],
        docker: (docker.data ?? []) as FisiUserDockerService[],
        notes: (notes.data ?? []) as FisiUserNote[],
      });
      setSearchOwner(uid);
      setSearchedTerm(normalizedQuery);
      setSearched(true);
    } catch {
      if (currentRequest === requestId.current) setSearchError(true);
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [user]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") runSearch(query);
  }

  function clearSearch() {
    requestId.current += 1;
    setQuery("");
    setResults(null);
    setSearched(false);
    setSearchOwner(null);
    setSearchError(false);
    setLoading(false);
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
        <div className="rounded-xl border border-blue-500/10 bg-white p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-blue-700" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Anmeldung erforderlich</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto mb-5">
            Die globale Suche ist für angemeldete Benutzer verfügbar.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/login" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors">
              Einloggen
            </Link>
            <Link href="/registrieren" className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-50 border border-slate-200 text-sm text-slate-700 transition-colors">
              Kostenlos registrieren
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search input */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
            <input
              type="text"
              aria-label="Persönlichen Workspace durchsuchen"
              maxLength={120}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Gesamten Workspace durchsuchen…"
              className="w-full pl-11 pr-24 py-3 rounded-xl bg-blue-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/40 focus:bg-blue-50 transition-all"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {query && (
                <button onClick={clearSearch} aria-label="Suche löschen" className="p-1 text-slate-500 hover:text-slate-600 transition-colors">
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

          {!loading && searchError && <ErrorState message="Die Suche ist fehlgeschlagen. Bitte versuche es erneut." />}

          {!loading && visibleSearched && total === 0 && (
            <div className="rounded-xl border border-slate-200 bg-blue-50 p-10 text-center">
              <Search size={28} className="text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-600">Keine Ergebnisse gefunden.</p>
              <p className="text-xs text-slate-500 mt-1">Versuchen Sie einen anderen Suchbegriff.</p>

            </div>
          )}

          {!loading && visibleSearched && total > 0 && (
            <div className="space-y-6">
              <p className="text-xs text-slate-600">
                <span className="text-slate-900 font-semibold">{total}</span>{" "}
                Ergebnisse für{" "}
                <span className="text-blue-700">&bdquo;{searchedTerm}&ldquo;</span>
              </p>

              <ResultSection
                icon={FlaskConical} title="Labore" items={visibleResults!.labs} href="/labore" accent="blue"
                renderItem={(lab) => (
                  <div>
                    <p className="text-sm font-medium text-slate-900">{highlight(lab.title, searchedTerm)}</p>
                    {lab.topic && <p className="text-xs text-slate-600 mt-0.5">{highlight(lab.topic, searchedTerm)}</p>}
                    {lab.goal && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{highlight(lab.goal, searchedTerm)}</p>}
                  </div>
                )}
              />

              <ResultSection
                icon={Server} title="Systeme" items={visibleResults!.systems} href="/systeme" accent="cyan"
                renderItem={(sys) => (
                  <div>
                    <p className="text-sm font-medium text-slate-900 font-mono">{highlight(sys.hostname, searchedTerm)}</p>
                    <div className="flex flex-wrap gap-3 mt-1">
                      {sys.ip_address && <span className="text-xs text-slate-600">{highlight(sys.ip_address, searchedTerm)}</span>}
                      {sys.os && <span className="text-xs text-slate-600">{highlight(sys.os, searchedTerm)}</span>}
                      {sys.role && <span className="text-xs text-slate-600">{highlight(sys.role, searchedTerm)}</span>}
                    </div>
                  </div>
                )}
              />

              <ResultSection
                icon={Terminal} title="Befehle" items={visibleResults!.commands} href="/befehle" accent="violet"
                renderItem={(cmd) => (
                  <div>
                    <code className="text-sm font-mono text-violet-800">{highlight(cmd.command, searchedTerm)}</code>
                    {cmd.purpose && <p className="text-xs text-slate-600 mt-0.5">{highlight(cmd.purpose, searchedTerm)}</p>}
                    {cmd.platform && <span className="text-[11px] text-slate-500">{cmd.platform}</span>}
                  </div>
                )}
              />

              <ResultSection
                icon={Bug} title="Fehleranalysen" items={visibleResults!.troubleshooting} href="/fehleranalyse" accent="amber"
                renderItem={(t) => (
                  <div>
                    <p className="text-sm font-medium text-slate-900">{highlight(t.title, searchedTerm)}</p>
                    {t.symptoms && <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{highlight(t.symptoms, searchedTerm)}</p>}
                    {t.category && <span className="text-[11px] text-slate-500">{t.category}</span>}
                  </div>
                )}
              />

              <ResultSection
                icon={Container} title="Docker-Dienste" items={visibleResults!.docker} href="/docker-dienste" accent="emerald"
                renderItem={(d) => (
                  <div>
                    <p className="text-sm font-medium text-slate-900">{highlight(d.name, searchedTerm)}</p>
                    {d.image && <p className="text-xs text-slate-600 mt-0.5 font-mono">{highlight(d.image, searchedTerm)}</p>}
                    {d.purpose && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{highlight(d.purpose, searchedTerm)}</p>}
                  </div>
                )}
              />

              <ResultSection
                icon={StickyNote} title="Praxisnotizen" items={visibleResults!.notes} href="/praxisnotizen" accent="slate"
                renderItem={(n) => (
                  <div>
                    <p className="text-sm font-medium text-slate-900">{highlight(n.title, searchedTerm)}</p>
                    {n.content && <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{highlight(n.content, searchedTerm)}</p>}
                    {n.category && <span className="text-[11px] text-slate-500">{n.category}</span>}
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
