"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Terminal, Search, Monitor, Tag, Plus, Pencil, Trash2,
  CheckCircle, AlertCircle,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import EmptyPersonalState from "@/components/EmptyPersonalState";
import ReferenceSection from "@/components/ReferenceSection";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import CommandForm, { type CommandFormData } from "@/components/CommandForm";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { FisiCommand, FisiUserCommand } from "@/lib/types";

function InlineCode({ children }: { children: string }) {
  return (
    <pre className="rounded-lg bg-[#0a0c10] border border-white/5 px-4 py-3 text-sm text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

type NotifType = { kind: "success" | "error"; message: string };

function UserCommandCard({
  cmd,
  onEdit,
  onDelete,
}: {
  cmd: FisiUserCommand;
  onEdit: (c: FisiUserCommand) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="rounded-xl border border-blue-500/10 bg-[#0f1623] p-5 space-y-4 relative">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/15 px-3 py-1 rounded-lg">
            <Terminal size={13} className="text-blue-400" />
            <code className="text-sm font-mono font-semibold text-blue-300">{cmd.command}</code>
          </div>
          {cmd.platform && (
            <span className="flex items-center gap-1 text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/15 px-2.5 py-1 rounded-lg">
              <Monitor size={10} />{cmd.platform}
            </span>
          )}
          {cmd.category && (
            <span className="flex items-center gap-1 text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/15 px-2.5 py-1 rounded-lg">
              <Tag size={10} />{cmd.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400">Löschen?</span>
              <button onClick={() => onDelete(cmd.id)}
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
              <button onClick={() => onEdit(cmd)} aria-label="Bearbeiten"
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

      {cmd.purpose && (
        <p className="text-sm text-slate-300 leading-relaxed">{cmd.purpose}</p>
      )}

      {cmd.example && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Beispiel</p>
          <InlineCode>{cmd.example}</InlineCode>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cmd.typical_use_case && (
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Typischer Anwendungsfall</p>
            <p className="text-xs text-slate-400 leading-relaxed">{cmd.typical_use_case}</p>
          </div>
        )}
        {cmd.notes && (
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Notizen</p>
            <p className="text-xs text-slate-400 leading-relaxed">{cmd.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DemoCommandCard({ cmd }: { cmd: FisiCommand }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-150 p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/15 px-3 py-1 rounded-lg">
          <Terminal size={13} className="text-emerald-400" />
          <code className="text-sm font-mono font-semibold text-emerald-300">{cmd.command}</code>
        </div>
        {cmd.platform && (
          <span className="flex items-center gap-1 text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/15 px-2.5 py-1 rounded-lg">
            <Monitor size={10} />{cmd.platform}
          </span>
        )}
        {cmd.category && (
          <span className="flex items-center gap-1 text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/15 px-2.5 py-1 rounded-lg">
            <Tag size={10} />{cmd.category}
          </span>
        )}
      </div>
      {cmd.purpose && <p className="text-sm text-slate-300 leading-relaxed">{cmd.purpose}</p>}
      {cmd.example && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Beispiel</p>
          <InlineCode>{cmd.example}</InlineCode>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cmd.typical_use_case && (
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Typischer Anwendungsfall</p>
            <p className="text-xs text-slate-400 leading-relaxed">{cmd.typical_use_case}</p>
          </div>
        )}
        {cmd.notes && (
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Notizen</p>
            <p className="text-xs text-slate-400 leading-relaxed">{cmd.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BefehlePageContent() {
  const { user } = useAuth();

  const [commands, setCommands] = useState<FisiCommand[]>([]);
  const [demoLoading, setDemoLoading] = useState(!supabaseConfigMissing);
  const [demoError, setDemoError] = useState(false);
  const [demoQuery, setDemoQuery] = useState("");

  const [userCommands, setUserCommands] = useState<FisiUserCommand[] | null>(null);
  const [userCommandsError, setUserCommandsError] = useState(false);
  const userCommandsLoading = !!user && userCommands === null && !userCommandsError;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editCmd, setEditCmd] = useState<FisiUserCommand | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [notif, setNotif] = useState<NotifType | null>(null);

  function toast(kind: NotifType["kind"], message: string) {
    setNotif({ kind, message });
    setTimeout(() => setNotif(null), 4000);
  }

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;
    supabase
      .from("fisi_commands")
      .select("*")
      .order("category", { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setDemoError(true);
        else setCommands(data ?? []);
        setDemoLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user || !supabase) return;
    supabase
      .from("fisi_user_commands")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setUserCommandsError(true);
        else setUserCommands(data ?? []);
      });
  }, [user]);

  const filteredDemo = useMemo(() => {
    if (!demoQuery.trim()) return commands;
    const q = demoQuery.toLowerCase();
    return commands.filter((c) =>
      c.command.toLowerCase().includes(q) ||
      (c.platform ?? "").toLowerCase().includes(q) ||
      (c.category ?? "").toLowerCase().includes(q) ||
      (c.purpose ?? "").toLowerCase().includes(q)
    );
  }, [commands, demoQuery]);

  const filteredUserCommands = useMemo(() => {
    if (!userQuery.trim() || !userCommands) return userCommands ?? [];
    const q = userQuery.toLowerCase();
    return userCommands.filter((c) =>
      c.command.toLowerCase().includes(q) ||
      (c.platform ?? "").toLowerCase().includes(q) ||
      (c.category ?? "").toLowerCase().includes(q) ||
      (c.purpose ?? "").toLowerCase().includes(q)
    );
  }, [userCommands, userQuery]);

  async function handleCreate(data: CommandFormData) {
    if (!supabase || !user) return;
    const { data: row, error: err } = await supabase
      .from("fisi_user_commands")
      .insert({ ...data, user_id: user.id })
      .select()
      .single();
    if (err) throw err;
    setUserCommands((prev) => [row, ...(prev ?? [])]);
    setShowCreateForm(false);
    toast("success", "Befehl erstellt.");
  }

  async function handleUpdate(data: CommandFormData) {
    if (!supabase || !editCmd) return;
    const { data: row, error: err } = await supabase
      .from("fisi_user_commands")
      .update(data)
      .eq("id", editCmd.id)
      .eq("user_id", editCmd.user_id)
      .select()
      .single();
    if (err) throw err;
    setUserCommands((prev) => (prev ?? []).map((c) => (c.id === row.id ? row : c)));
    setEditCmd(null);
    toast("success", "Befehl aktualisiert.");
  }

  async function handleDelete(id: string) {
    if (!supabase || !user) return;
    const { error: err } = await supabase
      .from("fisi_user_commands")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (err) { toast("error", "Fehler beim Löschen."); return; }
    setUserCommands((prev) => (prev ?? []).filter((c) => c.id !== id));
    toast("success", "Befehl gelöscht.");
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
        icon={Terminal}
        title="Befehle"
        description="Administrativer Befehlsreferenz mit Beispielen und Anwendungsfällen"
      />

      {/* Personal workspace */}
      {user && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meine Befehle</h2>
            {!showCreateForm && (
              <button onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors">
                <Plus size={13} />Befehl hinzufügen
              </button>
            )}
          </div>

          {showCreateForm && (
            <div className="mb-5">
              <CommandForm onSave={handleCreate} onCancel={() => setShowCreateForm(false)} />
            </div>
          )}

          {userCommandsLoading && <LoadingState />}
          {userCommandsError && <ErrorState />}
          {!userCommandsLoading && !userCommandsError && userCommands !== null && (
            <>
              {userCommands.length > 0 && (
                <div className="mb-4 relative">
                  <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Befehl, Plattform oder Kategorie suchen..."
                    className="w-full max-w-xl pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              )}
              {userCommands.length === 0 && !showCreateForm && (
                <EmptyPersonalState
                  title="Noch keine Befehle"
                  description="Fügen Sie Ihren ersten Befehl hinzu – mit Plattform, Beispiel und Anwendungsfall."
                  buttonLabel="Befehl hinzufügen"
                  onAction={() => setShowCreateForm(true)}
                />
              )}
              {userCommands.length > 0 && filteredUserCommands.length === 0 && (
                <EmptyState title="Keine Treffer" description={`Kein Befehl gefunden für "${userQuery}".`} />
              )}
              {filteredUserCommands.length > 0 && (
                <div className="space-y-4">
                  {filteredUserCommands.map((cmd) => (
                    <UserCommandCard key={cmd.id} cmd={cmd} onEdit={setEditCmd} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Reference section */}
      <ReferenceSection title="Referenz-Befehle">
        <div className="mb-5 relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={demoQuery}
            onChange={(e) => setDemoQuery(e.target.value)}
            placeholder="Befehl, Plattform oder Kategorie suchen..."
            className="w-full max-w-xl pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all"
          />
          {demoQuery && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-slate-500">
              {filteredDemo.length} Treffer
            </span>
          )}
        </div>

        {demoLoading && <LoadingState />}
        {demoError && <ErrorState />}
        {!demoLoading && !demoError && commands.length === 0 && (
          <EmptyState title="Keine Befehle vorhanden" description="Es wurden noch keine Befehle angelegt." />
        )}
        {!demoLoading && !demoError && commands.length > 0 && filteredDemo.length === 0 && (
          <EmptyState title="Keine Treffer" description={`Kein Befehl gefunden für "${demoQuery}".`} />
        )}
        {!demoLoading && !demoError && filteredDemo.length > 0 && (
          <div className="space-y-4">
            {filteredDemo.map((cmd) => <DemoCommandCard key={cmd.id} cmd={cmd} />)}
          </div>
        )}
      </ReferenceSection>

      {/* Edit modal */}
      {editCmd && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CommandForm
              command={editCmd}
              onSave={handleUpdate}
              onCancel={() => setEditCmd(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
