import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
  accent?: string;
}

export default function StatCard({ label, value, icon: Icon, href, accent = "blue" }: StatCardProps) {
  const accentClasses: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400",
    cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400",
    violet: "from-violet-500/20 to-violet-600/5 border-violet-500/20 text-violet-400",
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
    amber: "from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400",
  };

  const classes = accentClasses[accent] ?? accentClasses.blue;

  const inner = (
    <div
      className={`relative bg-gradient-to-br ${classes} border rounded-xl p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
          <Icon size={20} className={classes.split(" ").find((c) => c.startsWith("text-")) ?? "text-blue-400"} />
        </div>
      </div>
    </div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
