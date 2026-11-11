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
  LayoutGrid,
  Search,
  Network,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/dashboard",     label: "Übersicht",      icon: LayoutDashboard },
  { href: "/workspace",     label: "Workspace",       icon: LayoutGrid      },
  { href: "/labore",        label: "Labore",          icon: FlaskConical    },
  { href: "/systeme",       label: "Systeme",         icon: Server          },
  { href: "/befehle",       label: "Befehle",         icon: Terminal        },
  { href: "/fehleranalyse", label: "Fehleranalyse",   icon: Bug             },
  { href: "/docker-dienste",label: "Docker-Dienste",  icon: Container       },
  { href: "/praxisnotizen", label: "Praxisnotizen",   icon: StickyNote      },
  { href: "/suche",         label: "Suche",           icon: Search          },
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
      <div className="px-5 py-4 border-t border-slate-200">
        <p className="text-[10px] text-slate-500">OrikOS-Ökosystemprojekt</p>
      </div>
    );
  }

  if (user) {
    const displayName = (user.user_metadata?.name as string | undefined) || user.email || "Benutzer";
    return (
      <div className="px-5 py-4 border-t border-slate-200 space-y-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
            <User size={13} className="text-blue-700" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-700 truncate">{displayName}</p>
            {user.user_metadata?.name && (
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-red-700 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={12} />
          Abmelden
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 border-t border-slate-200 space-y-2">
      <p className="text-[10px] text-slate-500 mb-2">OrikOS-Konto</p>
      <Link href="/registrieren" onClick={onAction}
        className="block text-xs text-blue-700 hover:text-blue-800 transition-colors">
        Kostenlos registrieren →
      </Link>
      <Link href="/login" onClick={onAction}
        className="block text-xs text-slate-600 hover:text-slate-700 transition-colors">
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
      <aside className="hidden md:flex flex-col w-[268px] h-screen sticky top-0 bg-white/95 border-r border-[#dae7f5] shrink-0 shadow-[8px_0_32px_-26px_rgba(23,100,179,0.25)]">
        <div className="px-5 py-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1477ca] to-[#37a8db] shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0">
              <Network size={23} className="text-white" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-blue-700 font-bold uppercase tracking-[0.15em] mb-1">OrikLab / FISI</p>
              <p className="text-base font-extrabold text-[#173958] leading-none">LabBook<span className="text-blue-600">.</span></p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Dein Workspace für Systemintegration</p>
        </div>

        <nav aria-label="Hauptnavigation" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }, index) => {
            const active = pathname === href;
            return (
              <div key={href}>
                {(index === 0 || index === 2 || index === 8) && (
                  <p className={`px-3 pb-2 text-[10px] font-bold tracking-[0.16em] text-slate-400 uppercase ${index > 0 ? "pt-5" : "pt-1"}`}>
                    {index === 0 ? "Übersicht" : index === 2 ? "Praxis & Dokumentation" : "Organisation"}
                  </p>
                )}
                <Link href={href} aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 group ${
                    active
                      ? "bg-[#e5f2ff] text-blue-800 border border-[#c8e2f9] shadow-sm"
                      : "text-slate-600 hover:text-[#155a99] hover:bg-[#f0f7ff]"
                  }`}
                >
                  <Icon size={17} className={active ? "text-[#1474c4]" : "text-slate-500 group-hover:text-blue-600"} />
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight size={14} className="text-blue-500" />}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* No AuthSection on desktop — shown in TopBar instead */}
        <div className="px-5 py-4 border-t border-slate-200 bg-[#f8fbff]">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="h-2 w-2 bg-sky-500 rounded-full" />
            Praxis. Dokumentation. Fortschritt.
          </div>
        </div>
      </aside>

      {/* ── Mobile top bar: below md ───────────────────────────────── */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1477ca] to-[#37a8db] flex items-center justify-center shrink-0">
            <Network size={18} className="text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900">FISI LabBook</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-blue-50 transition-colors"
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
            className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col pt-[57px] overflow-y-auto"
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
                        ? "bg-blue-500/15 text-blue-700 border border-blue-500/20"
                        : "text-slate-600 hover:text-slate-800 hover:bg-blue-50"
                    }`}
                  >
                    <Icon size={16} className={active ? "text-blue-700" : "text-slate-600"} />
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
