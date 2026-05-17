import DashboardShell from "@/components/layout/dashboard-shell";
import AIChatContainer from "@/components/ai/ai-chat-container";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

type AIPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function AIPage({ params }: AIPageProps) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  return (
    <DashboardShell>
      <div className="space-y-4 pb-8 md:space-y-8 md:pb-0">
        <div className={isArabic ? "text-right" : "text-left"}>
          <h1 className="section-title">{messages.ai.title}</h1>

          <p className="section-subtitle mt-2 max-w-2xl">
            {messages.ai.subtitle}
          </p>
        </div>

        <AIChatContainer locale={locale} />
      </div>
    </DashboardShell>
  );
}