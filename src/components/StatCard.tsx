import { T } from "@/components/TranslatedText";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
  accent?: string;
}

export default function StatCard({ label, value, icon: Icon, href, accent = "blue" }: StatCardProps) {
  const accentClasses: Record<string, { icon: string; bar: string }> = {
    blue: { icon: "bg-blue-50 text-blue-700 border-blue-100", bar: "bg-blue-500" },
    cyan: { icon: "bg-cyan-50 text-cyan-700 border-cyan-100", bar: "bg-cyan-500" },
    violet: { icon: "bg-violet-50 text-violet-700 border-violet-100", bar: "bg-violet-500" },
    emerald: { icon: "bg-emerald-50 text-emerald-700 border-emerald-100", bar: "bg-emerald-500" },
    amber: { icon: "bg-amber-50 text-amber-700 border-amber-100", bar: "bg-amber-500" },
    slate: { icon: "bg-slate-50 text-slate-700 border-slate-200", bar: "bg-slate-500" },
  };

  const classes = accentClasses[accent] ?? accentClasses.blue;

  const inner = (
    <div
      className="fisi-card group relative overflow-hidden rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className={`absolute top-0 inset-x-0 h-1 ${classes.bar}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.08em] mb-3"><T>{label}</T></p>
          <p className="text-3xl font-extrabold tracking-tight text-[#183954] tabular-nums">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${classes.icon}`}>
          <Icon size={20} />
        </div>
      </div>
      {href && <ArrowUpRight size={15} className="absolute right-5 bottom-5 text-slate-400 group-hover:text-blue-600 transition-colors" />}
    </div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
