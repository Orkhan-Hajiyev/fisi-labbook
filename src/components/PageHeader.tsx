import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export default function PageHeader({ icon: Icon, title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
          <Icon size={18} className="text-blue-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
      {description && (
        <p className="text-slate-400 text-sm ml-12">{description}</p>
      )}
    </div>
  );
}
