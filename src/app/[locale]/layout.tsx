import { Locale } from "@/lib/constants";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const isRTL = params.locale === "ar";

  return (
    <html
      lang={params.locale}
      dir={isRTL ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}