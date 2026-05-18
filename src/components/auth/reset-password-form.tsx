"use client";

import { FormEvent, useState } from "react";
import {
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";

import NexusLogo from "@/components/common/nexus-logo";
import { Locale } from "@/lib/constants";
import { createSupabaseClient } from "@/lib/supabase/client";

type ResetPasswordFormProps = {
  locale: Locale;
};

function getRecoveryEmail() {
  if (typeof window === "undefined") return "";

  const params = new URLSearchParams(window.location.hash.replace("#", ""));
  const token = params.get("access_token");

  if (!token) return "";

  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const decoded = JSON.parse(window.atob(padded));

    return typeof decoded.email === "string" ? decoded.email : "";
  } catch {
    return "";
  }
}

export default function ResetPasswordForm({ locale }: ResetPasswordFormProps) {
  const router = useRouter();
  const [supabase] = useState(() => createSupabaseClient());
  const isArabic = locale === "ar";

  const [email] = useState(() => getRecoveryEmail());
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");


    if (!password.trim() || !confirmPassword.trim()) {
      setError(
        isArabic
          ? "اكتب كلمة المرور الجديدة وأكدها."
          : "Enter and confirm your new password.",
      );
      return;
    }

    const isStrongPassword =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password);

    if (!isStrongPassword) {
      setError(
        isArabic
          ? "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل وحرف كبير وحرف صغير ورقم ورمز خاص."
          : "Password must contain at least 8 characters, uppercase, lowercase, number, and special character.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        isArabic ? "كلمتا المرور غير متطابقتين." : "Passwords do not match.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(
          isArabic
            ? "تم حفظ شكل الصفحة. تغيير كلمة المرور الحقيقي يحتاج رابط استعادة صالح من البريد."
            : "The page UI is ready. Real password update requires a valid recovery email link.",
        );
        setIsLoading(false);
        return;
      }

      await supabase.auth.signOut();

      setIsRedirecting(true);

      router.replace(`/${locale}/login`);
    } catch {
      setError(
        isArabic
          ? "حدث خطأ غير متوقع. حاول مرة أخرى."
          : "Something went wrong. Please try again.",
      );
      setIsLoading(false);
    }
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="relative min-h-screen overflow-hidden bg-[var(--background)] px-4 py-6 text-[var(--foreground)]"
    >
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-full max-w-md items-center">
        <section className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl shadow-black/10 sm:p-6">
          <div className="mb-6 flex justify-center">
            <NexusLogo layout="icon" tone="accent" className="h-11 w-11" />
          </div>

          <div className={isArabic ? "text-right" : "text-left"}>
            <span className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--foreground-soft)]">
              {isArabic ? "تغيير كلمة المرور" : "Reset password"}
            </span>

            <h1 className="mt-5 text-2xl font-bold tracking-tight">
              {isArabic ? "اكتب كلمة مرور جديدة" : "Create a new password"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--foreground-soft)]">
              {isArabic
                ? "اختر كلمة مرور جديدة لحسابك في NexusDesk."
                : "Choose a new password for your NexusDesk account."}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground-soft)]">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {email ||
                  (isArabic
                    ? "سيظهر البريد عند فتح رابط الاستعادة"
                    : "Email appears from the recovery link")}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="grid gap-2 text-sm font-medium">
              <span>{isArabic ? "كلمة المرور الجديدة" : "New password"}</span>
              <span className="relative block">
                <LockKeyhole className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-soft)]" />
                <input
                  type={showPasswords ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={
                    isArabic ? "اكتب كلمة المرور الجديدة" : "Enter new password"
                  }
                  className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-11 text-sm outline-none transition placeholder:text-[var(--foreground-muted)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)]"
                />
              </span>
            </label>

            <label className="grid gap-2 text-sm font-medium">
              <span>{isArabic ? "تأكيد كلمة المرور" : "Confirm password"}</span>
              <span className="relative block">
                <KeyRound className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-soft)]" />
                <input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder={
                    isArabic ? "أعد كتابة كلمة المرور" : "Repeat new password"
                  }
                  className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-11 text-sm outline-none transition placeholder:text-[var(--foreground-muted)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)]"
                />
              </span>
            </label>

            <label className="flex items-center gap-2 text-sm text-[var(--foreground-soft)]">
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(event) => setShowPasswords(event.target.checked)}
              />
              {isArabic ? "إظهار كلمة المرور" : "Show password"}
            </label>

            {error && (
              <div className="rounded-xl border border-[color-mix(in_srgb,var(--danger)_24%,transparent)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] px-4 py-3 text-sm font-medium text-[var(--danger)]">
                {error}
              </div>
            )}


            <button
              type="submit"
              disabled={isLoading || isRedirecting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading
                ? isArabic
                  ? "جاري الحفظ..."
                  : "Saving..."
                : isArabic
                  ? "حفظ كلمة المرور"
                  : "Save password"}
            </button>

            <button
              type="button"
              onClick={() => router.push(`/${locale}/login`)}
              className="w-full text-sm font-semibold text-[var(--primary)] transition hover:opacity-80"
            >
              {isArabic ? "الرجوع لتسجيل الدخول" : "Back to login"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
