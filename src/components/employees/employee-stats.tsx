import { LucideIcon } from "lucide-react";

type EmployeeStatKey = "total" | "active" | "departments" | "pending";

type EmployeeStatItem = {
  key: EmployeeStatKey;
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
};

type EmployeeStatsProps = {
  stats: EmployeeStatItem[];
};

const statToneClassMap: Record<
  EmployeeStatKey,
  {
    card: string;
    icon: string;
  }
> = {
  total: {
    card: "bg-[linear-gradient(135deg,var(--employee-stat-total-bg),var(--employee-stat-total-bg-soft))]",
    icon: "bg-[color:var(--employee-stat-total-icon-bg)] text-[color:var(--employee-stat-total-icon-text)]",
  },
  active: {
    card: "bg-[linear-gradient(135deg,var(--employee-stat-active-bg),var(--employee-stat-active-bg-soft))]",
    icon: "bg-[color:var(--employee-stat-active-icon-bg)] text-[color:var(--employee-stat-active-icon-text)]",
  },
  departments: {
    card: "bg-[linear-gradient(135deg,var(--employee-stat-departments-bg),var(--employee-stat-departments-bg-soft))]",
    icon: "bg-[color:var(--employee-stat-departments-icon-bg)] text-[color:var(--employee-stat-departments-icon-text)]",
  },
  pending: {
    card: "bg-[linear-gradient(135deg,var(--employee-stat-pending-bg),var(--employee-stat-pending-bg-soft))]",
    icon: "bg-[color:var(--employee-stat-pending-icon-bg)] text-[color:var(--employee-stat-pending-icon-text)]",
  },
};

export default function EmployeeStats({ stats }: EmployeeStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const tone = statToneClassMap[stat.key];

        return (
          <article
            key={stat.key}
            className={`relative overflow-hidden rounded-lg border border-[color:var(--employee-stat-border)] p-3 shadow-[0_8px_18px_var(--employee-stat-shadow)] md:rounded-xl md:p-5 md:shadow-[0_10px_26px_var(--employee-stat-shadow)] ${tone.card}`}
          >
            <div className="relative flex items-start justify-between gap-2.5 md:gap-4">
              <div className="min-w-0">
                <p className="line-clamp-1 text-[11px] font-medium text-[color:var(--foreground-muted)] md:text-sm">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--foreground)] md:mt-3 md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-[color:var(--foreground-soft)] md:mt-2 md:text-xs md:leading-5">
                  {stat.description}
                </p>
              </div>

              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-md md:size-12 ${tone.icon}`}
              >
                <Icon size={18} className="md:size-5" />
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}