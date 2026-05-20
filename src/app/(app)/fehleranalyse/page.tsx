"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Bug, AlertCircle, Search as SearchIcon, Lightbulb, Target, Tag,
  Plus, Pencil, Trash2, CheckCircle,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import EmptyPersonalState from "@/components/EmptyPersonalState";
import ReferenceSection from "@/components/ReferenceSection";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import TroubleshootingForm, { type TroubleshootingFormData } from "@/components/TroubleshootingForm";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { FisiTroubleshootingCase, FisiUserTroubleshootingCase } from "@/lib/types";

type DifficultyConfig = { label: string; className: string };

function getDifficultyConfig(d: string | null): DifficultyConfig {
  switch (d?.toLowerCase()) {
    case "einfach":
    case "leicht":
    case "easy":
      return { label: d === "einfach" ? "Einfach" : "Leicht", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" };
    case "mittel":
    case "medium":
      return { label: "Mittel", className: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
    case "fortgeschritten":
    case "schwer":
    case "hard":
      return { label: d === "schwer" ? "Schwer" : "Fortgeschritten", className: "bg-red-500/15 text-red-400 border-red-500/20" };
    default:
      return { label: d ?? "—", className: "bg-white/5 text-slate-400 border-white/10" };
  }
}

function Step({
  icon: Icon, label, value, accent = "slate",
}: {
  icon: React.ElementType; label: string; value: string | null; accent?: string;
}) {
  if (!value) return null;
  const colors: Record<string, string> = {
    slate: "bg-slate-500/10 border-slate-500/20 text-slate-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  };
  return (
    <div className="flex gap-3">
      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${colors[accent] ?? colors.slate}`}>
        <Icon size={13} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{value}</p>
      </div>
    </div>
  );
}

type NotifType = { kind: "success" | "error"; message: string };

function UserTroubleshootingCard({
  item, onEdit, onDelete,
}: {
  item: FisiUserTroubleshootingCase;
  onEdit: (i: FisiUserTroubleshootingCase) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const diff = getDifficultyConfig(item.difficulty);

  return (
    <div className="rounded-xl border border-blue-500/10 bg-[#0f1623] p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white">{item.title}</h3>
          {item.category && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <Tag size={10} />{item.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {item.difficulty && (
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${diff.className}`}>
              {diff.label}
            </span>
          )}
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400">Löschen?</span>
              <button onClick={() => onDelete(item.id)}
                className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 text-xs font-medium transition-colors">
                Ja
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 text-xs font-medium transition-colors">
                Nein
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => onEdit(item)} aria-label="Bearbeiten"
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                <Pencil size={13} />
              </button>
              <button onClick={() => setConfirmDelete(true)} aria-label="Löschen"
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Step icon={AlertCircle} label="Symptome" value={item.symptoms} accent="amber" />
        <Step icon={SearchIcon} label="Prüfschritte" value={item.checks} accent="blue" />
        <Step icon={Lightbulb} label="Ursache" value={item.root_cause} accent="slate" />
        <Step icon={Target} label="Lösung" value={item.solution} accent="emerald" />
      </div>

      {item.result && (
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/15 px-4 py-3">
          <p className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider mb-1">Ergebnis</p>
          <p className="text-xs text-emerald-300 leading-relaxed">{item.result}</p>
        </div>
      )}
    </div>
  );
}

function DemoCaseCard({ c }: { c: FisiTroubleshootingCase }) {
  const diff = getDifficultyConfig(c.difficulty);
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-150 p-5 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white">{c.title}</h3>
          {c.category && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 mt-1">
              <Tag size={10} />{c.category}
            </span>
          )}
        </div>
        {c.difficulty && (
          <span className={`shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full border ${diff.className}`}>
            {diff.label}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Step icon={AlertCircle} label="Symptome" value={c.symptoms} accent="amber" />
        <Step icon={SearchIcon} label="Prüfschritte" value={c.checks} accent="blue" />
        <Step icon={Lightbulb} label="Ursache" value={c.root_cause} accent="slate" />
        <Step icon={Target} label="Lösung" value={c.solution} accent="emerald" />
      </div>
      {c.result && (
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/15 px-4 py-3">
          <p className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider mb-1">Ergebnis</p>
          <p className="text-xs text-emerald-300 leading-relaxed">{c.result}</p>
        </div>
      )}
    </div>
  );
}

export default function FehleranalysePage() {
  const { user } = useAuth();

  const [cases, setCases] = useState<FisiTroubleshootingCase[]>([]);
  const [demoLoading, setDemoLoading] = useState(!supabaseConfigMissing);
  const [demoError, setDemoError] = useState(false);

  const [userCases, setUserCases] = useState<FisiUserTroubleshootingCase[] | null>(null);
  const [userCasesError, setUserCasesError] = useState(false);
  const userCasesLoading = !!user && userCases === null && !userCasesError;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editItem, setEditItem] = useState<FisiUserTroubleshootingCase | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [notif, setNotif] = useState<NotifType | null>(null);

  function toast(kind: NotifType["kind"], message: string) {
    setNotif({ kind, message });
    setTimeout(() => setNotif(null), 4000);
  }

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;
    supabase
      .from("fisi_troubleshooting_cases")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setDemoError(true);
        else setCases(data ?? []);
        setDemoLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user || !supabase) return;
    supabase
      .from("fisi_user_troubleshooting_cases")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setUserCasesError(true);
        else setUserCases(data ?? []);
      });
  }, [user]);

  const filteredUserCases = useMemo(() => {
    if (!userQuery.trim() || !userCases) return userCases ?? [];
    const q = userQuery.toLowerCase();
    return userCases.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      (c.category ?? "").toLowerCase().includes(q) ||
      (c.difficulty ?? "").toLowerCase().includes(q)
    );
  }, [userCases, userQuery]);

  async function handleCreate(data: TroubleshootingFormData) {
    if (!supabase || !user) return;
    const { data: row, error: err } = await supabase
      .from("fisi_user_troubleshooting_cases")
      .insert({ ...data, user_id: user.id })
      .select()
      .single();
    if (err) throw err;
    setUserCases((prev) => [row, ...(prev ?? [])]);
    setShowCreateForm(false);
    toast("success", "Fehleranalyse erstellt.");
  }

  async function handleUpdate(data: TroubleshootingFormData) {
    if (!supabase || !editItem) return;
    const { data: row, error: err } = await supabase
      .from("fisi_user_troubleshooting_cases")
      .update(data)
      .eq("id", editItem.id)
      .eq("user_id", editItem.user_id)
      .select()
      .single();
    if (err) throw err;
    setUserCases((prev) => (prev ?? []).map((c) => (c.id === row.id ? row : c)));
    setEditItem(null);
    toast("success", "Fehleranalyse aktualisiert.");
  }

  async function handleDelete(id: string) {
    if (!supabase || !user) return;
    const { error: err } = await supabase
      .from("fisi_user_troubleshooting_cases")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (err) { toast("error", "Fehler beim Löschen."); return; }
    setUserCases((prev) => (prev ?? []).filter((c) => c.id !== id));
    toast("success", "Fehleranalyse gelöscht.");
  }

  if (supabaseConfigMissing) return <SupabaseMissingBanner />;

  return (
    <div>
      {notif && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium transition-all ${
          notif.kind === "success"
            ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-300"
            : "bg-red-500/15 border-red-500/20 text-red-300"
        }`}>
          {notif.kind === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {notif.message}
        </div>
      )}

      <PageHeader
        icon={Bug}
        title="Fehleranalyse"
        description="Strukturierte Troubleshooting-Fälle: Problem, Prüfung, Ursache, Lösung"
      />

      {/* Personal workspace */}
      {user && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meine Fehleranalysen</h2>
            {!showCreateForm && (
              <button onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors">
                <Plus size={13} />Fehleranalyse hinzufügen
              </button>
            )}
          </div>

          {showCreateForm && (
            <div className="mb-5">
              <TroubleshootingForm onSave={handleCreate} onCancel={() => setShowCreateForm(false)} />
            </div>
          )}

          {userCasesLoading && <LoadingState />}
          {userCasesError && <ErrorState />}
          {!userCasesLoading && !userCasesError && userCases !== null && (
            <>
              {userCases.length > 0 && (
                <div className="mb-4 relative">
                  <SearchIcon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Titel, Kategorie oder Schwierigkeit suchen..."
                    className="w-full max-w-xl pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              )}
              {userCases.length === 0 && !showCreateForm && (
                <EmptyPersonalState
                  title="Noch keine Fehleranalysen"
                  description="Dokumentieren Sie Troubleshooting-Fälle strukturiert mit Symptomen, Prüfschritten, Ursache und Lösung."
                  buttonLabel="Fehleranalyse hinzufügen"
                  onAction={() => setShowCreateForm(true)}
                />
              )}
              {userCases.length > 0 && filteredUserCases.length === 0 && (
                <EmptyState title="Keine Treffer" description={`Kein Fall gefunden für "${userQuery}".`} />
              )}
              {filteredUserCases.length > 0 && (
                <div className="space-y-5">
                  {filteredUserCases.map((item) => (
                    <UserTroubleshootingCard key={item.id} item={item} onEdit={setEditItem} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Reference section */}
      <ReferenceSection title="Referenz-Fehleranalysen">
        {demoLoading && <LoadingState />}
        {demoError && <ErrorState />}
        {!demoLoading && !demoError && cases.length === 0 && (
          <EmptyState title="Keine Fehleranalysen vorhanden" description="Es wurden noch keine Troubleshooting-Fälle angelegt." />
        )}
        {!demoLoading && !demoError && cases.length > 0 && (
          <div className="space-y-5">
            {cases.map((c) => <DemoCaseCard key={c.id} c={c} />)}
          </div>
        )}
      </ReferenceSection>

      {/* Edit modal */}
      {editItem && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <TroubleshootingForm
              item={editItem}
              onSave={handleUpdate}
              onCancel={() => setEditItem(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
