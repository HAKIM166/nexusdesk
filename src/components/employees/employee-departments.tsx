import { Building2 } from "lucide-react";

type EmployeeDepartmentsProps = {
  title: string;
  subtitle: string;
  departmentSummary: [string, number][];
};

export default function EmployeeDepartments({
  title,
  subtitle,
  departmentSummary,
}: EmployeeDepartmentsProps) {
  return (
    <div className="rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--employee-card-bg)] p-4 shadow-[0_8px_18px_var(--employee-card-shadow)] md:rounded-xl md:p-5 md:shadow-[0_10px_26px_var(--employee-card-shadow)]">
      <div className="flex items-start justify-between gap-3 md:items-center md:gap-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[color:var(--foreground)] md:text-lg">
            {title}
          </h2>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[color:var(--foreground-muted)] md:text-sm md:leading-6">
            {subtitle}
          </p>
        </div>

        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[color:var(--employee-department-icon-bg)] text-[color:var(--employee-department-icon-text)] md:size-11">
          <Building2 size={18} className="md:size-[19px]" />
        </span>
      </div>

      <div className="mt-4 max-h-[220px] space-y-2 overflow-y-auto pr-1 md:mt-5 md:max-h-none md:space-y-3 md:overflow-visible md:pr-0">
        {departmentSummary.map(([department, count]) => (
          <div
            key={department}
            className="flex items-center justify-between gap-3 border border-[color:var(--employee-department-row-border)] bg-[color:var(--employee-department-row-bg)] px-3 py-2.5 md:gap-4 md:px-4 md:py-3"
          >
            <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
              <span className="size-2 shrink-0 rounded-full bg-[color:var(--employee-department-dot)] md:size-2.5" />
              <span className="truncate text-xs font-medium text-[color:var(--foreground)] md:text-sm">
                {department}
              </span>
            </div>

            <span className="shrink-0 px-2 py-1 text-[11px] font-semibold text-[color:var(--employee-department-count-text)] md:px-3 md:text-xs">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}