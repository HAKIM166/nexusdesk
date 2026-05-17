import { ShieldCheck, Sparkles, UserRoundCheck } from "lucide-react";

import { getMessages } from "@/lib/helpers";
import { EmployeeStatus } from "@/types/employee";

type EmployeeMessages = ReturnType<typeof getMessages>;

type EmployeeHeroProps = {
  messages: EmployeeMessages;
  isArabic: boolean;
  activeRate: number;
  activeEmployees: number;
  pendingInvites: number;
  inactiveEmployees: number;
  onAddClick?: () => void;
};

function translateStatus(status: EmployeeStatus, messages: EmployeeMessages) {
  const normalizedStatus =
    status.toLowerCase() as keyof typeof messages.employees.status;

  return (
    messages.employees.status[normalizedStatus] ||
    messages.common.status[status] ||
    status
  );
}

export default function EmployeeHero({
  messages,
  isArabic,
  activeRate,
  activeEmployees,
  pendingInvites,
  inactiveEmployees,
  onAddClick,
}: EmployeeHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[color:var(--employee-hero-border)] bg-[linear-gradient(135deg,var(--employee-hero-bg),var(--employee-hero-bg-soft))] p-4 shadow-[0_10px_24px_var(--employee-hero-shadow)] md:p-6 md:shadow-[0_14px_34px_var(--employee-hero-shadow)]">
      <div className="relative grid gap-4 md:gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--employee-chip-text)] md:px-3 md:text-xs md:tracking-[0.22em]">
              <Sparkles size={14} />
              NexusDesk Team
            </div>

            <h1 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight text-[color:var(--foreground)] md:mt-5 md:text-4xl">
              {messages.employees.title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--foreground-muted)] md:mt-3 md:leading-7">
              {messages.employees.subtitle}
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center md:mt-8 md:gap-3">
            <button
              type="button"
              onClick={onAddClick}
              className="inline-flex w-full items-center justify-center rounded-lg border border-[color:var(--employee-primary-action-border)] bg-[color:var(--employee-primary-action-bg)] px-4 py-2.5 text-sm font-semibold text-[color:var(--employee-primary-action-text)] shadow-[0_12px_28px_var(--employee-primary-action-shadow)] transition hover:bg-[color:var(--employee-primary-action-hover-bg)] sm:w-auto md:px-5 md:py-3 md:shadow-[0_18px_40px_var(--employee-primary-action-shadow)]"
            >
              {messages.employees.actions.add}
            </button>

            <div className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[color:var(--employee-soft-action-border)] bg-[color:var(--employee-soft-action-bg)] px-3 py-2.5 text-sm font-medium text-[color:var(--foreground-muted)] sm:w-auto sm:justify-start md:px-4 md:py-3">
              <ShieldCheck size={16} />
              <span>
                {isArabic
                  ? `${activeRate}% من الفريق نشط`
                  : `${activeRate}% team active`}
              </span>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-[color:var(--employee-soft-action-border)] bg-[color:var(--employee-soft-action-bg)] p-3 md:border-0 md:bg-transparent md:p-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)] md:text-xs md:tracking-[0.22em]">
                {isArabic ? "حالة الفريق" : "Team pulse"}
              </p>
              <p className="mt-1 text-2xl font-semibold text-[color:var(--foreground)] md:mt-2 md:text-3xl">
                {activeRate}%
              </p>
            </div>

            <span className="flex size-10 items-center justify-center text-[color:var(--employee-pulse-icon-text)] md:size-12">
              <UserRoundCheck size={20} />
            </span>
          </div>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[color:var(--employee-progress-track)] md:mt-6 md:h-3">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--employee-progress-start),var(--employee-progress-end))]"
              style={{ width: `${activeRate}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 md:mt-6 md:gap-3">
            <div className="p-2 md:p-3">
              <p className="text-base font-semibold text-[color:var(--foreground)] md:text-lg">
                {activeEmployees}
              </p>
              <p className="mt-1 text-[11px] text-[color:var(--foreground-muted)]">
                {translateStatus("Active", messages)}
              </p>
            </div>

            <div className="p-2 md:p-3">
              <p className="text-base font-semibold text-[color:var(--foreground)] md:text-lg">
                {pendingInvites}
              </p>
              <p className="mt-1 text-[11px] text-[color:var(--foreground-muted)]">
                {translateStatus("Pending", messages)}
              </p>
            </div>

            <div className="p-2 md:p-3">
              <p className="text-base font-semibold text-[color:var(--foreground)] md:text-lg">
                {inactiveEmployees}
              </p>
              <p className="mt-1 text-[11px] text-[color:var(--foreground-muted)]">
                {translateStatus("Inactive", messages)}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}