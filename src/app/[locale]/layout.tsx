import { Locale } from "@/lib/constants";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "ar" ? "ar" : "en";
  const isRTL = safeLocale === "ar";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-background text-foreground antialiased"
    >
      {children}
    </div>
  );
}