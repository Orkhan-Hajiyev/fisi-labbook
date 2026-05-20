"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { FisiUserCommand } from "@/lib/types";

export interface CommandFormData {
  command: string;
  platform: string;
  category: string;
  purpose: string;
  example: string;
  typical_use_case: string;
  notes: string;
}

interface Props {
  command?: FisiUserCommand;
  onSave: (data: CommandFormData) => Promise<void>;
  onCancel: () => void;
}

const inputCls = "w-full px-3 py-2 rounded-lg bg-[#0d0f14] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-all";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5";

const PLATFORMS = ["Windows", "Linux", "PowerShell", "CMD", "Bash", "Python", "Docker", "Sonstiges"];
const CATEGORIES = ["Netzwerk", "System", "Active Directory", "DNS", "DHCP", "Firewall", "Docker", "Dateisystem", "Benutzer", "Sonstiges"];

export default function CommandForm({ command, onSave, onCancel }: Props) {
  const [cmd,           setCmd]          = useState(command?.command          ?? "");
  const [platform,      setPlatform]     = useState(command?.platform         ?? "");
  const [category,      setCategory]     = useState(command?.category         ?? "");
  const [purpose,       setPurpose]      = useState(command?.purpose          ?? "");
  const [example,       setExample]      = useState(command?.example          ?? "");
  const [typicalUse,    setTypicalUse]   = useState(command?.typical_use_case ?? "");
  const [notes,         setNotes]        = useState(command?.notes            ?? "");
  const [loading,       setLoading]      = useState(false);
  const [error,         setError]        = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cmd.trim()) { setError("Bitte geben Sie einen Befehl ein."); return; }
    setError(null);
    setLoading(true);
    try {
      await onSave({ command: cmd.trim(), platform, category, purpose, example, typical_use_case: typicalUse, notes });
    } catch {
      setError("Fehler beim Speichern. Bitte versuchen Sie es erneut.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-blue-500/15 bg-[#0f1623] p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{command ? "Befehl bearbeiten" : "Neuen Befehl erstellen"}</h3>
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
        <div>
          <label className={labelCls}>Befehl</label>
          <input type="text" value={cmd} onChange={(e) => setCmd(e.target.value)}
            placeholder="netstat -an" className={inputCls + " font-mono"} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Plattform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}
              className={inputCls + " cursor-pointer"}>
              <option value="">Keine</option>
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Kategorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className={inputCls + " cursor-pointer"}>
              <option value="">Keine</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Zweck</label>
          <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)}
            placeholder="Wofür wird dieser Befehl verwendet?" className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Beispiel</label>
          <textarea value={example} onChange={(e) => setExample(e.target.value)}
            placeholder="netstat -an | findstr :80" rows={3} className={inputCls + " resize-none font-mono"} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Typischer Anwendungsfall</label>
            <textarea value={typicalUse} onChange={(e) => setTypicalUse(e.target.value)}
              placeholder="z.B. offene Ports prüfen" rows={2} className={inputCls + " resize-none"} />
          </div>
          <div>
            <label className={labelCls}>Notizen</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Hinweise, Varianten…" rows={2} className={inputCls + " resize-none"} />
          </div>
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
