"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, CircuitBoard, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function TopBar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="hidden md:flex items-center justify-end px-8 py-3 border-b border-slate-200 bg-white/90 h-16" />
    );
  }

  return (
    <div className="hidden md:flex items-center justify-between gap-4 px-8 py-3 border-b border-slate-200 bg-white/90 backdrop-blur-xl min-h-16">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-[#e9f4ff] text-blue-700"><CircuitBoard size={16} /></div>
        <div>
          <p className="text-xs font-bold text-[#1c456c]">Systemintegration Workspace</p>
          <p className="text-[11px] text-slate-500">IT-Praxis · Dokumentation · Troubleshooting</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
      {user ? (
        <>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
              <User size={11} className="text-blue-700" />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 leading-none mb-0.5">Angemeldet als</p>
              <p className="text-xs font-medium text-slate-700 leading-none">
                {(user.user_metadata?.name as string | undefined) || user.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-slate-600 hover:text-red-700 hover:bg-red-500/5 border border-slate-200 transition-all"
          >
            <LogOut size={11} />
            Abmelden
          </button>
        </>
      ) : (
        <>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500"><ShieldCheck size={13} className="text-blue-600" />Kostenlos starten</span>
          <Link
            href="/registrieren"
            className="text-[11px] text-blue-700 hover:text-blue-800 transition-colors"
          >
            Kostenlos registrieren
          </Link>
          <Link
            href="/login"
            className="text-[11px] px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all"
          >
            Einloggen
          </Link>
        </>
      )}
      </div>
    </div>
  );
}
