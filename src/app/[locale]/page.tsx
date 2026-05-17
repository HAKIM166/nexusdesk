import { TriangleAlert } from "lucide-react";

import PricingSection from "@/components/marketing/pricing-section";
import TestimonialsSection from "@/components/marketing/testimonials-section";
import DashboardFooter from "@/components/marketing/dashboard-footer";

type LocalePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pt-12 pb-0">
      <div className="pointer-events-none select-none space-y-20 opacity-25 blur-[1px]">
        <PricingSection isArabic={isArabic} />

        <TestimonialsSection isArabic={isArabic} />

        <DashboardFooter isArabic={isArabic} />
      </div>

      <div
        className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center backdrop-blur-[1.5px]"
        style={{
          background:
            "color-mix(in srgb, var(--background) 34%, transparent)",
        }}
      >
        <div className="max-w-xl">
          <TriangleAlert
            size={74}
            strokeWidth={1.5}
            className="mx-auto text-[color:var(--warning)]"
          />

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[color:var(--foreground)] md:text-4xl">
            {isArabic ? "الصفحة تحت التعديل" : "Page under maintenance"}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[color:var(--foreground-muted)] md:text-base">
            {isArabic
              ? "نعمل حاليًا على تحسين هذه الصفحة وتجهيزها لتظهر بالشكل النهائي قريبًا."
              : "We are currently improving this page and preparing its final experience."}
          </p>
        </div>
      </div>
    </main>
  );
}