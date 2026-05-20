"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseConfigMissing } from "@/lib/supabase";

export default function DemoBanner() {
  const { user, loading } = useAuth();

  if (supabaseConfigMissing || loading || user) return null;

  return (
    <div className="border-b border-blue-500/15 bg-blue-600/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
      <p className="text-sm text-slate-400 leading-snug">
        <span className="font-medium text-blue-400">Öffentliche Demo-Ansicht</span>
        {" "}— Mit OrikOS-Konto einloggen oder kostenfrei registrieren.
      </p>
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/login"
          className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Einloggen
        </Link>
        <Link href="/registrieren"
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors whitespace-nowrap">
          Kostenlos registrieren
        </Link>
      </div>
    </div>
  );
}
