type KpiCardProps = {
  title: string;
  value: string;
};

export default function KpiCard({ title, value }: KpiCardProps) {
  return (
    <div className="panel p-6 space-y-2">
      <p className="text-soft">{title}</p>
      <h2 className="kpi-value">{value}</h2>
    </div>
  );
}