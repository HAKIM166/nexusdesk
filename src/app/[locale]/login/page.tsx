import { Locale } from "@/lib/constants";
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "ar" ? "ar" : "en";

  return <LoginForm locale={safeLocale} />;
}