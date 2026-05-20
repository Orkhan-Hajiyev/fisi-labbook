"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FlaskConical,
  Server,
  Terminal,
  Bug,
  Container,
  FolderKanban,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Übersicht", icon: LayoutDashboard },
  { href: "/labore", label: "Labore", icon: FlaskConical },
  { href: "/systeme", label: "Systeme", icon: Server },
  { href: "/befehle", label: "Befehle", icon: Terminal },
  { href: "/fehleranalyse", label: "Fehleranalyse", icon: Bug },
  { href: "/docker-dienste", label: "Docker-Dienste", icon: Container },
  { href: "/portfolio", label: "Portfolio", icon: FolderKanban },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Sidebar – desktop */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#0f1117] border-r border-white/5 shrink-0">
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">FISI LabBook</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-none">Systemintegration</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  active
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <Icon
                  size={16}
                  className={active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-white/5">
          <p className="text-[10px] text-slate-600 leading-relaxed">
            Fachinformatiker für Systemintegration
          </p>
        </div>
      </aside>

      {/* Top bar – mobile */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0f1117] border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <BookOpen size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold text-white">FISI LabBook</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Menü"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)}>
          <nav
            className="absolute left-0 top-0 bottom-0 w-64 bg-[#0f1117] border-r border-white/5 pt-16 px-3 py-4 space-y-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
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
          </nav>
        </div>
      )}
    </>
  );
}
