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
      <div className="space-y-5 pb-8 md:space-y-8 md:pb-0">
        {/* Header */}
        <div
  className={`max-w-2xl ${
    isArabic ? "mr-0 ml-auto text-right" : "text-left"
  }`}
>
          <h1 className="section-title">{messages.clients.title}</h1>

          <p className="section-subtitle mt-1.5 md:mt-2">
            {messages.clients.subtitle}
          </p>
        </div>

        {/* Add Client Section */}
        <section className="panel space-y-4 p-4 md:p-6">
          <div className={isArabic ? "text-right" : "text-left"}>
            <h2 className="text-[18px] font-semibold leading-6 text-[var(--foreground)] md:text-lg">
              {messages.clients.form.title}
            </h2>

            <p className="mt-1 text-[13px] leading-5 text-[var(--foreground-muted)] md:text-sm md:leading-6">
              {messages.clients.form.subtitle}
            </p>
          </div>

          <ClientForm locale={locale} />
        </section>

        {/* Clients Table Section */}
        <section className="panel space-y-4 overflow-hidden p-4 md:p-6">
          <div className={isArabic ? "text-right" : "text-left"}>
            <h2 className="text-[18px] font-semibold leading-6 text-[var(--foreground)] md:text-lg">
              {messages.clients.listTitle}
            </h2>

            <p className="mt-1 text-[13px] leading-5 text-[var(--foreground-muted)] md:text-sm md:leading-6">
              {messages.clients.listSubtitle}
            </p>
          </div>

          <ClientTable locale={locale} />
        </section>
      </div>
    </DashboardShell>
  );
}