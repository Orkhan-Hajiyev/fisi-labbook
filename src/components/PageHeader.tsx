import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export default function PageHeader({ icon: Icon, title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e1efff] to-[#f5faff] border border-[#cbdff4] flex items-center justify-center shadow-sm shrink-0">
          <Icon size={22} className="text-[#1665a8]" />
        </div>
        <div className="pt-0.5">
          <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-blue-600 mb-1">FISI LabBook / Workspace</p>
          <h1 className="text-2xl sm:text-[27px] font-extrabold tracking-tight text-[#183954] leading-tight">{title}</h1>
          {description && <p className="text-slate-600 text-sm mt-1.5">{description}</p>}
        </div>
    </div>
  );
}
