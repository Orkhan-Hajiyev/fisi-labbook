"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
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
      <div className="hidden md:flex items-center justify-end px-6 py-2.5 border-b border-white/5 bg-[#0d0f14]/80 h-12" />
    );
  }

  return (
    <div className="hidden md:flex items-center justify-end gap-4 px-6 py-2.5 border-b border-white/5 bg-[#0d0f14]/80">
      {user ? (
        <>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
              <User size={11} className="text-blue-400" />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-600 leading-none mb-0.5">Angemeldet als</p>
              <p className="text-xs font-medium text-slate-300 leading-none">
                {(user.user_metadata?.name as string | undefined) || user.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] text-slate-500 hover:text-red-400 hover:bg-red-500/5 border border-white/5 transition-all"
          >
            <LogOut size={11} />
            Abmelden
          </button>
        </>
      ) : (
        <>
          <Link
            href="/registrieren"
            className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
          >
            Kostenlos registrieren
          </Link>
          <Link
            href="/login"
            className="text-[11px] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/8 border border-white/10 text-slate-300 hover:text-white transition-all"
          >
            Einloggen
          </Link>
        </>
      )}
    </div>
  );
}
