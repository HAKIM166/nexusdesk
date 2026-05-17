import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Locale } from "@/lib/constants";

type ResetPasswordPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { locale } = await params;

  return <ResetPasswordForm locale={locale} />;
}