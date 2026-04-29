import { Locale } from "@/lib/constants";

type KpiCardProps = {
  title: string;
  value: string;
  locale: Locale;
};

export default function KpiCard({ title, value, locale }: KpiCardProps) {
  const isArabic = locale === "ar";

  return (
    <div
      className={`panel p-6 space-y-2 ${
        isArabic ? "text-right" : "text-left"
      }`}
    >
      <p className="text-soft">{title}</p>
      <h2 className="kpi-value">{value}</h2>
    </div>
  );
}