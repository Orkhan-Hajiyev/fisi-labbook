"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Container, CheckCircle2, XCircle, Clock, ExternalLink, Search,
  Plus, Pencil, Trash2, CheckCircle, AlertCircle,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import EmptyPersonalState from "@/components/EmptyPersonalState";
import ReferenceSection from "@/components/ReferenceSection";
import SupabaseMissingBanner from "@/components/SupabaseMissingBanner";
import DockerServiceForm, { type DockerServiceFormData } from "@/components/DockerServiceForm";
import { supabase, supabaseConfigMissing } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { FisiDockerService, FisiUserDockerService } from "@/lib/types";

function MetaField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white/[0.02] border border-white/5 px-3 py-2">
      <p className="text-[10px] text-slate-600 mb-0.5">{label}</p>
      {children}
    </div>
  );
}

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
  if (s === "geplant") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] bg-slate-500/15 text-slate-400 border border-slate-500/20 px-2.5 py-1 rounded-full">
        <Clock size={10} /> Geplant
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] bg-slate-500/15 text-slate-400 border border-slate-500/20 px-2.5 py-1 rounded-full">
      <Clock size={10} /> {status}
    </span>
  );
}

function ComposeBlock({ snippet }: { snippet: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Docker Compose</p>
      <div className="rounded-lg bg-[#0a0c10] border border-white/5 overflow-hidden">
        <div className="px-3 py-1.5 bg-white/[0.03] border-b border-white/5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-amber-500/60" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
          <span className="text-[10px] text-slate-600 ml-1">docker-compose.yml</span>
        </div>
        <pre className="p-4 text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre leading-relaxed">
          <code>{snippet}</code>
        </pre>
      </div>
    </div>
  );
}

type NotifType = { kind: "success" | "error"; message: string };

function UserDockerCard({
  svc, onEdit, onDelete,
}: {
  svc: FisiUserDockerService;
  onEdit: (s: FisiUserDockerService) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="rounded-xl border border-blue-500/10 bg-[#0f1623] p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
            <Container size={16} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{svc.name}</h3>
            {svc.service_type && <p className="text-[11px] text-slate-500">{svc.service_type}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={svc.status} />
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400">Löschen?</span>
              <button onClick={() => onDelete(svc.id)}
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
              <button onClick={() => onEdit(svc)} aria-label="Bearbeiten"
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

      {svc.purpose && <p className="text-xs text-slate-400 leading-relaxed">{svc.purpose}</p>}
      {svc.compose_snippet && <ComposeBlock snippet={svc.compose_snippet} />}
      {svc.notes && <p className="text-xs text-slate-500 leading-relaxed border-t border-white/5 pt-3">{svc.notes}</p>}
    </div>
  );
}

function DemoDockerCard({ svc }: { svc: FisiDockerService }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all duration-150 p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
            <Container size={16} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{svc.name}</h3>
            {svc.service_type && <p className="text-[11px] text-slate-500">{svc.service_type}</p>}
          </div>
        </div>
        <StatusBadge status={svc.status} />
      </div>
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
      {svc.purpose && <p className="text-xs text-slate-400 leading-relaxed">{svc.purpose}</p>}
      {svc.compose_snippet && <ComposeBlock snippet={svc.compose_snippet} />}
      {svc.notes && <p className="text-xs text-slate-500 leading-relaxed border-t border-white/5 pt-3">{svc.notes}</p>}
    </div>
  );
}

export default function DockerDienstePage() {
  const { user } = useAuth();

  const [services, setServices] = useState<FisiDockerService[]>([]);
  const [demoLoading, setDemoLoading] = useState(!supabaseConfigMissing);
  const [demoError, setDemoError] = useState(false);

  const [userServices, setUserServices] = useState<FisiUserDockerService[] | null>(null);
  const [userServicesError, setUserServicesError] = useState(false);
  const userServicesLoading = !!user && userServices === null && !userServicesError;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editSvc, setEditSvc] = useState<FisiUserDockerService | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [notif, setNotif] = useState<NotifType | null>(null);

  function toast(kind: NotifType["kind"], message: string) {
    setNotif({ kind, message });
    setTimeout(() => setNotif(null), 4000);
  }

  useEffect(() => {
    if (supabaseConfigMissing || !supabase) return;
    supabase
      .from("fisi_docker_services")
      .select("*")
      .order("name", { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setDemoError(true);
        else setServices(data ?? []);
        setDemoLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!user || !supabase) return;
    supabase
      .from("fisi_user_docker_services")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setUserServicesError(true);
        else setUserServices(data ?? []);
      });
  }, [user]);

  const filteredUserServices = useMemo(() => {
    if (!userQuery.trim() || !userServices) return userServices ?? [];
    const q = userQuery.toLowerCase();
    return userServices.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      (s.image ?? "").toLowerCase().includes(q) ||
      (s.port ?? "").toLowerCase().includes(q) ||
      (s.service_type ?? "").toLowerCase().includes(q) ||
      (s.status ?? "").toLowerCase().includes(q)
    );
  }, [userServices, userQuery]);

  async function handleCreate(data: DockerServiceFormData) {
    if (!supabase || !user) return;
    const { data: row, error: err } = await supabase
      .from("fisi_user_docker_services")
      .insert({ ...data, user_id: user.id })
      .select()
      .single();
    if (err) throw err;
    setUserServices((prev) => [row, ...(prev ?? [])]);
    setShowCreateForm(false);
    toast("success", "Docker-Dienst erstellt.");
  }

  async function handleUpdate(data: DockerServiceFormData) {
    if (!supabase || !editSvc) return;
    const { data: row, error: err } = await supabase
      .from("fisi_user_docker_services")
      .update(data)
      .eq("id", editSvc.id)
      .eq("user_id", editSvc.user_id)
      .select()
      .single();
    if (err) throw err;
    setUserServices((prev) => (prev ?? []).map((s) => (s.id === row.id ? row : s)));
    setEditSvc(null);
    toast("success", "Docker-Dienst aktualisiert.");
  }

  async function handleDelete(id: string) {
    if (!supabase || !user) return;
    const { error: err } = await supabase
      .from("fisi_user_docker_services")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (err) { toast("error", "Fehler beim Löschen."); return; }
    setUserServices((prev) => (prev ?? []).filter((s) => s.id !== id));
    toast("success", "Docker-Dienst gelöscht.");
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
        icon={Container}
        title="Docker-Dienste"
        description="Dokumentierte Container-Dienste mit Images, Ports und Compose-Snippets"
      />

      {/* Personal workspace */}
      {user && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meine Docker-Dienste</h2>
            {!showCreateForm && (
              <button onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors">
                <Plus size={13} />Dienst hinzufügen
              </button>
            )}
          </div>

          {showCreateForm && (
            <div className="mb-5">
              <DockerServiceForm onSave={handleCreate} onCancel={() => setShowCreateForm(false)} />
            </div>
          )}

          {userServicesLoading && <LoadingState />}
          {userServicesError && <ErrorState />}
          {!userServicesLoading && !userServicesError && userServices !== null && (
            <>
              {userServices.length > 0 && (
                <div className="mb-4 relative">
                  <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="Name, Image, Port oder Typ suchen..."
                    className="w-full max-w-xl pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              )}
              {userServices.length === 0 && !showCreateForm && (
                <EmptyPersonalState
                  title="Noch keine Docker-Dienste"
                  description="Dokumentieren Sie Ihre Container-Dienste mit Images, Ports und Compose-Snippets."
                  buttonLabel="Dienst hinzufügen"
                  onAction={() => setShowCreateForm(true)}
                />
              )}
              {userServices.length > 0 && filteredUserServices.length === 0 && (
                <EmptyState title="Keine Treffer" description={`Kein Dienst gefunden für "${userQuery}".`} />
              )}
              {filteredUserServices.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {filteredUserServices.map((svc) => (
                    <UserDockerCard key={svc.id} svc={svc} onEdit={setEditSvc} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Reference section */}
      <ReferenceSection title="Referenz-Dienste">
        {demoLoading && <LoadingState />}
        {demoError && <ErrorState />}
        {!demoLoading && !demoError && services.length === 0 && (
          <EmptyState title="Keine Docker-Dienste vorhanden" description="Es wurden noch keine Dienste dokumentiert." />
        )}
        {!demoLoading && !demoError && services.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {services.map((svc) => <DemoDockerCard key={svc.id} svc={svc} />)}
          </div>
        )}
      </ReferenceSection>

      {/* Edit modal */}
      {editSvc && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <DockerServiceForm
              service={editSvc}
              onSave={handleUpdate}
              onCancel={() => setEditSvc(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
