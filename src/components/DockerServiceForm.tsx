"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { FisiUserDockerService } from "@/lib/types";

export interface DockerServiceFormData {
  name: string;
  image: string;
  port: string;
  service_type: string;
  status: string;
  purpose: string;
  compose_snippet: string;
  notes: string;
}

interface Props {
  service?: FisiUserDockerService;
  onSave: (data: DockerServiceFormData) => Promise<void>;
  onCancel: () => void;
}

const inputCls = "w-full px-3 py-2 rounded-lg bg-[#0d0f14] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-all";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5";

const STATUS_OPTIONS = [
  { value: "aktiv",   label: "Aktiv"   },
  { value: "inaktiv", label: "Inaktiv" },
  { value: "geplant", label: "Geplant" },
];

const SERVICE_TYPES = [
  "Web-Server", "Datenbank", "Reverse Proxy", "Monitoring", "CI/CD",
  "Mail", "DNS", "VPN", "Storage", "Sonstiges",
];

export default function DockerServiceForm({ service, onSave, onCancel }: Props) {
  const [name,           setName]          = useState(service?.name            ?? "");
  const [image,          setImage]         = useState(service?.image           ?? "");
  const [port,           setPort]          = useState(service?.port            ?? "");
  const [serviceType,    setServiceType]   = useState(service?.service_type    ?? "");
  const [status,         setStatus]        = useState(service?.status          ?? "aktiv");
  const [purpose,        setPurpose]       = useState(service?.purpose         ?? "");
  const [composeSnippet, setComposeSnippet]= useState(service?.compose_snippet ?? "");
  const [notes,          setNotes]         = useState(service?.notes           ?? "");
  const [loading,        setLoading]       = useState(false);
  const [error,          setError]         = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Bitte geben Sie einen Dienstnamen ein."); return; }
    setError(null);
    setLoading(true);
    try {
      await onSave({ name: name.trim(), image, port, service_type: serviceType, status, purpose, compose_snippet: composeSnippet, notes });
    } catch {
      setError("Fehler beim Speichern. Bitte versuchen Sie es erneut.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-blue-500/15 bg-[#0f1623] p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          {service ? "Docker-Dienst bearbeiten" : "Neuen Docker-Dienst erstellen"}
        </h3>
        <button type="button" onClick={onCancel} aria-label="Schließen"
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
          <X size={16} />
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Dienst</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="nginx, postgres, gitea…" className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>Image</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)}
              placeholder="nginx:alpine" className={inputCls + " font-mono"} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Port</label>
            <input type="text" value={port} onChange={(e) => setPort(e.target.value)}
              placeholder="8080:80" className={inputCls + " font-mono"} />
          </div>
          <div>
            <label className={labelCls}>Typ</label>
            <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}
              className={inputCls + " cursor-pointer"}>
              <option value="">Keiner</option>
              {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className={inputCls + " cursor-pointer"}>
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Zweck</label>
          <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)}
            placeholder="Wofür wird dieser Dienst eingesetzt?" className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Docker-Compose-Ausschnitt</label>
          <textarea value={composeSnippet} onChange={(e) => setComposeSnippet(e.target.value)}
            placeholder={"services:\n  nginx:\n    image: nginx:alpine\n    ports:\n      - '8080:80'"}
            rows={6} className={inputCls + " resize-none font-mono text-xs"} />
        </div>

        <div>
          <label className={labelCls}>Notizen</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Hinweise, Abhängigkeiten…" rows={2} className={inputCls + " resize-none"} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
          <button type="button" onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            Abbrechen
          </button>
          <button type="submit" disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors">
            {loading ? "Wird gespeichert…" : "Speichern"}
          </button>
        </div>
      </form>
    </div>
  );
}
