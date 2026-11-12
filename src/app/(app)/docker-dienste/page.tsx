"use client";

import { T, useT } from "@/components/TranslatedText";

import { useEffect, useState, useMemo } from "react";
import {
  Container, CheckCircle2, XCircle, Clock, ExternalLink, Search,
  Plus, Pencil, Trash2, CheckCircle, AlertCircle, Copy, Lock,
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
    <div className="rounded-lg bg-blue-50 border border-slate-200 px-3 py-2">
      <p className="text-[10px] text-slate-500 mb-0.5">{label}</p>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s === "running" || s === "aktiv" || s === "up") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] bg-emerald-500/15 text-emerald-700 border border-emerald-500/20 px-2.5 py-1 rounded-full">
        <CheckCircle2 size={10} /><T>Aktiv</T></span>
    );
  }
  if (s === "stopped" || s === "inaktiv" || s === "down") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] bg-red-500/15 text-red-700 border border-red-500/20 px-2.5 py-1 rounded-full">
        <XCircle size={10} /><T>Inaktiv</T></span>
    );
  }
  if (s === "geplant") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] bg-slate-500/15 text-slate-600 border border-slate-500/20 px-2.5 py-1 rounded-full">
        <Clock size={10} /><T>Geplant</T></span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] bg-slate-500/15 text-slate-600 border border-slate-500/20 px-2.5 py-1 rounded-full">
      <Clock size={10} /> {status}
    </span>
  );
}

function ComposeBlock({ snippet }: { snippet: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-600 uppercase tracking-wider mb-2">Docker Compose</p>
      <div className="rounded-lg bg-[#f1f6fd] border border-slate-200 overflow-hidden">
        <div className="px-3 py-1.5 bg-blue-50 border-b border-slate-200 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-amber-500/60" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
          <span className="text-[10px] text-slate-500 ml-1">docker-compose.yml</span>
        </div>
        <pre className="p-4 text-xs text-slate-700 font-mono overflow-x-auto whitespace-pre leading-relaxed">
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
    <div className="rounded-xl border border-blue-500/10 bg-white p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
            <Container size={16} className="text-blue-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{svc.name}</h3>
            {svc.service_type && <p className="text-[11px] text-slate-600">{svc.service_type}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={svc.status} />
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-700"><T>Löschen?</T></span>
              <button onClick={() => onDelete(svc.id)}
                className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-700 hover:bg-red-500/25 text-xs font-medium transition-colors"><T>Ja</T></button>
              <button onClick={() => setConfirmDelete(false)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 text-slate-600 hover:bg-blue-50 text-xs font-medium transition-colors"><T>Nein</T></button>
            </div>
          ) : (
            <>
              <button onClick={() => onEdit(svc)} aria-label="Bearbeiten"
                className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-500/10 transition-colors">
                <Pencil size={13} />
              </button>
              <button onClick={() => setConfirmDelete(true)} aria-label="Löschen"
                className="p-1.5 rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-500/10 transition-colors">
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {svc.image && (
          <MetaField label="Image">
            <code className="text-xs font-mono text-slate-700">{svc.image}</code>
          </MetaField>
        )}
        {svc.port && (
          <MetaField label="Port">
            <div className="flex items-center gap-1">
              <ExternalLink size={10} className="text-slate-600" />
              <code className="text-xs font-mono text-cyan-800">{svc.port}</code>
            </div>
          </MetaField>
        )}
      </div>

      {svc.purpose && <p className="text-xs text-slate-600 leading-relaxed">{svc.purpose}</p>}
      {svc.compose_snippet && <ComposeBlock snippet={svc.compose_snippet} />}
      {svc.notes && <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3">{svc.notes}</p>}
    </div>
  );
}

function DemoDockerCard({ svc, user, onCopied }: {
  svc: FisiDockerService;
  user: import("@supabase/supabase-js").User | null;
  onCopied: (msg: string) => void;
}) {
  const [copying, setCopying] = useState(false);

  async function handleCopy() {
    if (!user || !supabase) return;
    setCopying(true);
    const { error: err } = await supabase.from("fisi_user_docker_services").insert({
      user_id: user.id,
      name: svc.name,
      image: svc.image,
      port: svc.port,
      service_type: svc.service_type,
      status: svc.status,
      purpose: svc.purpose,
      compose_snippet: svc.compose_snippet,
      notes: svc.notes,
    });
    setCopying(false);
    if (err) { onCopied("Fehler beim Übernehmen."); return; }
    onCopied("Vorlage wurde in Ihren persönlichen Arbeitsbereich übernommen.");
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-blue-50 hover:border-slate-200 transition-all duration-150 p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center shrink-0">
            <Container size={16} className="text-blue-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{svc.name}</h3>
            {svc.service_type && <p className="text-[11px] text-slate-600">{svc.service_type}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={svc.status} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {svc.image && (
          <MetaField label="Image">
            <code className="text-xs font-mono text-slate-700">{svc.image}</code>
          </MetaField>
        )}
        {svc.port && (
          <MetaField label="Port">
            <div className="flex items-center gap-1">
              <ExternalLink size={10} className="text-slate-600" />
              <code className="text-xs font-mono text-cyan-800">{svc.port}</code>
            </div>
          </MetaField>
        )}
      </div>
      {svc.purpose && <p className="text-xs text-slate-600 leading-relaxed">{svc.purpose}</p>}
      {svc.compose_snippet && <ComposeBlock snippet={svc.compose_snippet} />}
      {svc.notes && <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3">{svc.notes}</p>}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Demo</span>
        {user ? (
          <button onClick={handleCopy} disabled={copying}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/35 text-xs font-medium text-blue-700 hover:text-blue-800 transition-all disabled:opacity-50">
            <Copy size={11} />
            {copying ? "Wird übernommen…" : "Als Vorlage übernehmen"}
          </button>
        ) : (
          <button disabled className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 cursor-not-allowed">
            <Lock size={11} /><T>Anmeldung erforderlich</T></button>
        )}
      </div>
    </div>
  );
}

export default function DockerDienstePage() {
  const translateUI = useT();
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
            ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-800"
            : "bg-red-500/15 border-red-500/20 text-red-800"
        }`}>
          {notif.kind === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {notif.message}
        </div>
      )}

      <PageHeader
        icon={Container}
        title={translateUI("Docker-Dienste")}
        description={translateUI("Dokumentierte Container-Dienste mit Images, Ports und Compose-Snippets")}
      />

      {/* Personal workspace */}
      {user && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wider"><T>Meine Docker-Dienste</T></h2>
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
                  <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder={translateUI("Name, Image, Port oder Typ suchen...")}
                    className="w-full max-w-xl pl-10 pr-4 py-2.5 rounded-xl bg-blue-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                </div>
              )}
              {userServices.length === 0 && !showCreateForm && (
                <EmptyPersonalState
                  title={translateUI("Noch keine Docker-Dienste")}
                  description={translateUI("Dokumentieren Sie Ihre Container-Dienste mit Images, Ports und Compose-Snippets.")}
                  buttonLabel="Dienst hinzufügen"
                  onAction={() => setShowCreateForm(true)}
                />
              )}
              {userServices.length > 0 && filteredUserServices.length === 0 && (
                <EmptyState title={translateUI("Keine Treffer")} description={`Kein Dienst gefunden für "${userQuery}".`} />
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
      <ReferenceSection title={translateUI("Referenz-Dienste")}>
        {demoLoading && <LoadingState />}
        {demoError && <ErrorState />}
        {!demoLoading && !demoError && services.length === 0 && (
          <EmptyState title={translateUI("Keine Docker-Dienste vorhanden")} description={translateUI("Es wurden noch keine Dienste dokumentiert.")} />
        )}
        {!demoLoading && !demoError && services.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {services.map((svc) => (
              <DemoDockerCard key={svc.id} svc={svc} user={user}
                onCopied={(msg) => toast("success", msg)} />
            ))}
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
