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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { language } = useLanguage();
  const de = language === "de";

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
          {de ? "Abmelden" : "Çıxış"}
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 border-t border-slate-200 space-y-2">
      <p className="text-[10px] text-slate-500 mb-2">{de ? "FISI-LabBook-Konto" : "FISI LabBook hesabı"}</p>
      <Link href="/registrieren" onClick={onAction}
        className="block text-xs text-blue-700 hover:text-blue-800 transition-colors">
        {de ? "Kostenlos registrieren →" : "Pulsuz qeydiyyat →"}
      </Link>
      <Link href="/login" onClick={onAction}
        className="block text-xs text-slate-600 hover:text-slate-700 transition-colors">
        {de ? "Einloggen" : "Daxil ol"}
      </Link>
    </div>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const de = language === "de";
  const localizedLabels: Record<string, string> = {
    "/dashboard": de ? "Übersicht" : "İcmal",
    "/workspace": de ? "Workspace" : "İş sahəsi",
    "/labore": de ? "Labore" : "Laboratoriyalar",
    "/systeme": de ? "Systeme" : "Sistemlər",
    "/befehle": de ? "Befehle" : "Əmrlər",
    "/fehleranalyse": de ? "Fehleranalyse" : "Xəta təhlili",
    "/docker-dienste": de ? "Docker-Dienste" : "Docker xidmətləri",
    "/praxisnotizen": de ? "Praxisnotizen" : "Praktiki qeydlər",
    "/suche": de ? "Suche" : "Axtarış",
    "/portfolio": de ? "Portfolio" : "Portfolio",
    "/beispiele": de ? "Beispiel-Workspace" : "Nümunə iş mühiti",
  };
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
          <p className="text-[11px] text-slate-500 mt-3">{de ? "Dein Workspace für Systemintegration" : "Sistem inteqrasiyası üçün iş sahən"}</p>
        </div>

        <nav aria-label="Hauptnavigation" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }, index) => {
            const active = pathname === href;
            return (
              <div key={href}>
                {(index === 0 || index === 2 || index === 8) && (
                  <p className={`px-3 pb-2 text-[10px] font-bold tracking-[0.16em] text-slate-400 uppercase ${index > 0 ? "pt-5" : "pt-1"}`}>
                    {index === 0 ? (de ? "Übersicht" : "İcmal") : index === 2 ? (de ? "Praxis & Dokumentation" : "Praktika və sənədləşmə") : (de ? "Organisation" : "İdarəetmə")}
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
                  <span className="flex-1">{localizedLabels[href] ?? label}</span>
                  {active && <ChevronRight size={14} className="text-blue-500" />}
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-[#dce9f7] bg-gradient-to-b from-[#f8fbff] to-[#e8f3ff] p-3">
          <div className="relative overflow-hidden rounded-2xl border border-[#bdd9f3] bg-gradient-to-br from-[#eaf5ff] to-[#cde7ff] px-3 py-2.5">
            <svg viewBox="0 0 228 85" className="block h-[85px] w-full" role="img" aria-label={de ? "Illustration eines kleinen IT-Netzwerks" : "Kiçik IT şəbəkəsinin təsviri"}>
              <g fill="none" stroke="#519bda" strokeWidth="2.5" strokeLinecap="round"><path d="M43 44 H91 M136 44 H179 M114 29 V13 M114 59 V72" strokeDasharray="5 4"/></g>
              <rect x="13" y="25" width="50" height="39" rx="9" fill="#fff" stroke="#8bbde8" strokeWidth="2"/>
              <rect x="24" y="36" width="28" height="15" rx="4" fill="#a4d6f6"/><path d="M29 57h18" stroke="#2f79b8" strokeWidth="2"/>
              <rect x="91" y="27" width="46" height="34" rx="9" fill="#185d9e" stroke="#4ea8e9" strokeWidth="2"/>
              <path d="M99 37h30 M99 45h30" stroke="#81cfff" strokeWidth="3" strokeLinecap="round"/><circle cx="103" cy="54" r="2" fill="#b1e8ff"/><circle cx="111" cy="54" r="2" fill="#b1e8ff"/>
              <rect x="166" y="23" width="48" height="43" rx="9" fill="#fff" stroke="#8bbde8" strokeWidth="2"/>
              <path d="M175 33h30M175 43h30M175 53h30" stroke="#2a81c9" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="114" cy="9" r="6" fill="#1e80cc"/><circle cx="114" cy="77" r="6" fill="#1e80cc"/>
            </svg>
            <p className="mt-1 text-[11px] font-bold text-[#225c92]">{de ? "IT-Labor im Überblick" : "IT laboratoriyasına baxış"}</p>
            <Link href="/beispiele" className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0e6bc0] hover:underline"><LayoutGrid size={13}/>{localizedLabels["/beispiele"]}</Link>
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
          aria-label={mobileOpen ? (de ? "Menü schließen" : "Menyunu bağla") : (de ? "Menü öffnen" : "Menyunu aç")}
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
                    {localizedLabels[href] ?? label}
                  </Link>
                );
              })}
            </div>
            <div className="px-4 py-2 flex gap-2"><button type="button" onClick={() => setLanguage("de")} aria-pressed={de} className="text-xs rounded-lg border border-blue-200 p-2">Deutsch</button><button type="button" onClick={() => setLanguage("az")} aria-pressed={!de} className="text-xs rounded-lg border border-blue-200 p-2">Azərbaycanca</button></div>
            <Link href="/beispiele" onClick={() => setMobileOpen(false)} className="px-6 py-2 text-xs font-semibold text-blue-700">{localizedLabels["/beispiele"]}</Link>
            <AuthSection onAction={() => setMobileOpen(false)} />
          </nav>
        </div>
      )}
    </>
  );
}
