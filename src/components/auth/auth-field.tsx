import type { ComponentType, InputHTMLAttributes } from "react";

type AuthFieldProps = {
  label: string;
  icon: ComponentType<{ className?: string }>;
} & InputHTMLAttributes<HTMLInputElement>;

export function AuthField({
  label,
  icon: Icon,
  className = "",
  ...props
}: AuthFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--foreground)]">
      <span>{label}</span>

      <span className="relative block">
        <Icon className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-[var(--foreground-soft)]" />

        <input
          className={`h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 ps-11 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-muted)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] ${className}`}
          {...props}
        />
      </span>
    </label>
  );
}
