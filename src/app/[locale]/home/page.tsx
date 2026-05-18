import PricingSection from "@/components/marketing/pricing-section";
import TestimonialsSection from "@/components/marketing/testimonials-section";
import DashboardFooter from "@/components/marketing/dashboard-footer";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.45em] text-[var(--primary)]">
          NexusDesk
        </p>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          {isArabic ? "الصفحة تحت الصيانة" : "Page under maintenance"}
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--foreground-soft)] md:text-lg">
          {isArabic
            ? "نحن نعمل على تحسين صفحة الهبوط العامة. الوصول إلى لوحة التحكم متاح للحسابات المعتمدة فقط."
            : "We are polishing the public landing page. Dashboard access is limited to approved accounts only."}
        </p>
      </div>

      <PricingSection isArabic={isArabic} />
      <TestimonialsSection isArabic={isArabic} />
      <DashboardFooter isArabic={isArabic} />
    </main>
  );
}