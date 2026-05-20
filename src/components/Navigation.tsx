"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FlaskConical,
  Server,
  Terminal,
  Bug,
  Container,
  FolderKanban,
  StickyNote,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/dashboard",     label: "Übersicht",      icon: LayoutDashboard },
  { href: "/labore",        label: "Labore",          icon: FlaskConical    },
  { href: "/systeme",       label: "Systeme",         icon: Server          },
  { href: "/befehle",       label: "Befehle",         icon: Terminal        },
  { href: "/fehleranalyse", label: "Fehleranalyse",   icon: Bug             },
  { href: "/docker-dienste",label: "Docker-Dienste",  icon: Container       },
  { href: "/praxisnotizen", label: "Praxisnotizen",   icon: StickyNote      },
  { href: "/portfolio",     label: "Portfolio",       icon: FolderKanban    },
];

function AuthSection({ onAction }: { onAction?: () => void }) {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    onAction?.();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="px-5 py-4 border-t border-white/5">
        <p className="text-[10px] text-slate-700">OrikOS-Ökosystemprojekt</p>
      </div>
    );
  }

  if (user) {
    const displayName = (user.user_metadata?.name as string | undefined) || user.email || "Benutzer";
    return (
      <div className="px-5 py-4 border-t border-white/5 space-y-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
            <User size={13} className="text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-300 truncate">{displayName}</p>
            {user.user_metadata?.name && (
              <p className="text-[10px] text-slate-600 truncate">{user.email}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={12} />
          Abmelden
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 border-t border-white/5 space-y-2">
      <p className="text-[10px] text-slate-600 mb-2">OrikOS-Konto</p>
      <Link href="/registrieren" onClick={onAction}
        className="block text-xs text-blue-400 hover:text-blue-300 transition-colors">
        Kostenlos registrieren →
      </Link>
      <Link href="/login" onClick={onAction}
        className="block text-xs text-slate-500 hover:text-slate-300 transition-colors">
        Einloggen
      </Link>
    </div>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar: md and up ─────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#0f1117] border-r border-white/5 shrink-0">
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#161b27] border border-white/10 shadow-lg shadow-black/40 flex items-center justify-center shrink-0">
              <span className="text-sm font-black tracking-tight bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-none select-none">
                FL
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-none">FISI LabBook</p>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                Systemintegration Labor- und<br />Troubleshooting-Plattform
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  active
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <Icon size={16} className={active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"} />
                {label}
              </Link>
            );
          })}
        </nav>

        <AuthSection />
      </aside>

      {/* ── Mobile top bar: below md ───────────────────────────────── */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0f1117] border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#161b27] border border-white/10 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-black tracking-tight bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-none select-none">
              FL
            </span>
          </div>
          <span className="text-sm font-bold text-white">FISI LabBook</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* ── Mobile drawer ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <nav
            className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-[#0f1117] border-r border-white/5 flex flex-col pt-[57px] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 px-3 py-4 space-y-0.5">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} className={active ? "text-blue-400" : "text-slate-500"} />
                    {label}
                  </Link>
                );
              })}
            </div>
            <AuthSection onAction={() => setMobileOpen(false)} />
          </nav>
        </div>
      )}
    </>
  );
}
