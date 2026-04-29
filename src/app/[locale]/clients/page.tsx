import DashboardShell from "@/components/layout/dashboard-shell";
import ClientForm from "@/components/clients/client-form";
import ClientTable from "@/components/clients/client-table";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

type ClientsPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function ClientsPage({ params }: ClientsPageProps) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* Header */}
        <div className={isArabic ? "text-right" : "text-left"}>
          <h1 className="section-title">{messages.clients.title}</h1>
          <p className="section-subtitle">{messages.clients.subtitle}</p>
        </div>

        {/* Add Client Section */}
        <div className="panel p-6 space-y-4">
          <div className={isArabic ? "text-right" : "text-left"}>
            <h2 className="text-lg font-semibold">
              {isArabic ? "إضافة عميل جديد" : "Add New Client"}
            </h2>
            <p className="text-sm text-[var(--foreground-muted)]">
              {isArabic
                ? "أضف عميل جديد إلى النظام"
                : "Add a new client to your CRM"}
            </p>
          </div>

          <ClientForm locale={locale} />
        </div>

        {/* Clients Table Section */}
        <div className="panel p-6 space-y-4">
          <div className={isArabic ? "text-right" : "text-left"}>
            <h2 className="text-lg font-semibold">
              {isArabic ? "قائمة العملاء" : "Clients List"}
            </h2>
            <p className="text-sm text-[var(--foreground-muted)]">
              {isArabic
                ? "عرض وإدارة جميع العملاء"
                : "View and manage all clients"}
            </p>
          </div>

          <ClientTable locale={locale} />
        </div>
      </div>
    </DashboardShell>
  );
}