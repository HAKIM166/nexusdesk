import { recentClients } from "@/data/dashboard";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

type ClientsTableProps = {
  locale: Locale;
};

export default function ClientsTable({ locale }: ClientsTableProps) {
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  return (
    <div className="panel overflow-hidden">
      <div
        className={`border-b border-[var(--border)] px-6 py-4 ${
          isArabic ? "text-right" : "text-left"
        }`}
      >
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          {messages.dashboard.clientsTitle}
        </h2>
        <p className="text-sm text-[var(--foreground-soft)]">
          {messages.dashboard.clientsSubtitle}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table
          className={`w-full ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-6 py-4 text-sm font-medium text-[var(--foreground-soft)]">
                {messages.clientsTable.name}
              </th>
              <th className="px-6 py-4 text-sm font-medium text-[var(--foreground-soft)]">
                {messages.clientsTable.company}
              </th>
              <th className="px-6 py-4 text-sm font-medium text-[var(--foreground-soft)]">
                {messages.clientsTable.email}
              </th>
              <th className="px-6 py-4 text-sm font-medium text-[var(--foreground-soft)]">
                {messages.clientsTable.status}
              </th>
            </tr>
          </thead>

          <tbody>
            {recentClients.map((client) => (
              <tr
                key={client.email}
                className="border-b border-[rgba(255,255,255,0.05)] transition hover:bg-[rgba(255,255,255,0.02)]"
              >
                <td className="px-6 py-4 text-[var(--foreground)]">
                  {client.name}
                </td>

                <td className="px-6 py-4 text-[var(--foreground-muted)]">
                  {client.company}
                </td>

                <td className="px-6 py-4 text-[var(--foreground-muted)]">
                  {client.email}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--primary)]">
                    {messages.common.status[client.status as keyof typeof messages.common.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}