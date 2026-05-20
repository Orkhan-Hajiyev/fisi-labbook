"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { FisiUserSystem, FisiUserLab } from "@/lib/types";

export interface SystemFormData {
  hostname: string;
  os: string;
  role: string;
  ip_address: string;
  gateway: string;
  dns: string;
  domain_name: string;
  services: string;
  notes: string;
  lab_id: string;
}

interface Props {
  system?: FisiUserSystem;
  userLabs: FisiUserLab[];
  onSave: (data: SystemFormData) => Promise<void>;
  onCancel: () => void;
}

const inputCls = "w-full px-3 py-2 rounded-lg bg-[#0d0f14] border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition-all";
const labelCls = "block text-xs font-medium text-slate-400 mb-1.5";

export default function SystemForm({ system, userLabs, onSave, onCancel }: Props) {
  const [hostname,   setHostname]   = useState(system?.hostname    ?? "");
  const [os,         setOs]         = useState(system?.os          ?? "");
  const [role,       setRole]       = useState(system?.role        ?? "");
  const [ipAddress,  setIpAddress]  = useState(system?.ip_address  ?? "");
  const [gateway,    setGateway]    = useState(system?.gateway     ?? "");
  const [dns,        setDns]        = useState(system?.dns         ?? "");
  const [domainName, setDomainName] = useState(system?.domain_name ?? "");
  const [services,   setServices]   = useState(system?.services    ?? "");
  const [notes,      setNotes]      = useState(system?.notes       ?? "");
  const [labId,      setLabId]      = useState(system?.lab_id      ?? "");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hostname.trim()) { setError("Bitte geben Sie einen Hostnamen ein."); return; }
    setError(null);
    setLoading(true);
    try {
      await onSave({ hostname: hostname.trim(), os, role, ip_address: ipAddress, gateway, dns, domain_name: domainName, services, notes, lab_id: labId });
    } catch {
      setError("Fehler beim Speichern. Bitte versuchen Sie es erneut.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-blue-500/15 bg-[#0f1623] p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{system ? "System bearbeiten" : "Neues System erstellen"}</h3>
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
            <label className={labelCls}>Hostname</label>
            <input type="text" value={hostname} onChange={(e) => setHostname(e.target.value)}
              placeholder="srv-dc01" className={inputCls + " font-mono"} required />
          </div>
          <div>
            <label className={labelCls}>Betriebssystem</label>
            <input type="text" value={os} onChange={(e) => setOs(e.target.value)}
              placeholder="Windows Server 2022" className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Rolle</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
              placeholder="Domain Controller" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Zugehöriges Labor</label>
            <select value={labId} onChange={(e) => setLabId(e.target.value)}
              className={inputCls + " cursor-pointer"}>
              <option value="">Kein Labor</option>
              {userLabs.map((lab) => (
                <option key={lab.id} value={lab.id}>{lab.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>IP-Adresse</label>
            <input type="text" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)}
              placeholder="192.168.1.10" className={inputCls + " font-mono"} />
          </div>
          <div>
            <label className={labelCls}>Gateway</label>
            <input type="text" value={gateway} onChange={(e) => setGateway(e.target.value)}
              placeholder="192.168.1.1" className={inputCls + " font-mono"} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>DNS</label>
            <input type="text" value={dns} onChange={(e) => setDns(e.target.value)}
              placeholder="192.168.1.10" className={inputCls + " font-mono"} />
          </div>
          <div>
            <label className={labelCls}>Domäne</label>
            <input type="text" value={domainName} onChange={(e) => setDomainName(e.target.value)}
              placeholder="firma.local" className={inputCls + " font-mono"} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Dienste (kommagetrennt)</label>
          <input type="text" value={services} onChange={(e) => setServices(e.target.value)}
            placeholder="DNS, DHCP, AD DS" className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Notizen</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Notizen oder Besonderheiten…" rows={3} className={inputCls + " resize-none"} />
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
