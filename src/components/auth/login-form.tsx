"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import { createSupabaseClient } from "@/lib/supabase/client";

import AuthHero from "./auth-hero";
import { AuthPanel } from "./auth-panel";
import { getAuthCopy } from "./auth-copy";
import type { AuthMode, ThemeMode } from "./auth-types";

type LoginFormProps = {
  locale: Locale;
};

export default function LoginForm({ locale }: LoginFormProps) {
  const router = useRouter();
  const [supabase] = useState(() => createSupabaseClient());

  const isArabic = locale === "ar";

  const [mode, setMode] = useState<AuthMode>("login");
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";

    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function restoreRecoverySession() {
      if (typeof window === "undefined") return;

      const hash = window.location.hash.replace("#", "");
      const params = new URLSearchParams(hash);

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) return;

      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      setMode("new-password");
    }

    restoreRecoverySession();
  }, [supabase]);

  const messages = getMessages(locale);
  const copy = getAuthCopy(locale, messages);
  const allowedEmails = (process.env.NEXT_PUBLIC_ALLOWED_DASHBOARD_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  function canOpenDashboard(userEmail: string) {
    return allowedEmails.includes(userEmail.trim().toLowerCase());
  }

  const passwordRules = [
    {
      label: copy.passwordRuleMinLength,
      isValid: password.length >= 8,
    },
    {
      label: copy.passwordRuleUppercase,
      isValid: /[A-Z]/.test(password),
    },
    {
      label: copy.passwordRuleLowercase,
      isValid: /[a-z]/.test(password),
    },
    {
      label: copy.passwordRuleNumber,
      isValid: /\d/.test(password),
    },
    {
      label: copy.passwordRuleSpecial,
      isValid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const isPasswordStrong = passwordRules.every((rule) => rule.isValid);
  const showPasswordRules = mode === "register" || mode === "new-password";

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");

    if (nextMode === "login") {
      setOtpCode("");
      setRecoveryEmail("");
    }
  }

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("nexusdesk-theme", nextTheme);
    setTheme(nextTheme);
  }

  function toggleLocale() {
    router.push(`/${isArabic ? "en" : "ar"}/login`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (mode === "forgot") {
        if (!normalizedEmail) {
          setError(copy.missingEmail);
          return;
        }

        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

        const redirectTo = `${siteUrl}/${locale}/reset-password`;

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          normalizedEmail,
          {
            redirectTo,
          },
        );

        if (resetError) {
          setError(resetError.message);
          return;
        }

        setRecoveryEmail(normalizedEmail);
        setMode("verify-code");
        setMessage(copy.codeSent);
        return;
      }

      if (mode === "verify-code") {
        if (!recoveryEmail) {
          setError(copy.missingEmail);
          return;
        }

        if (!otpCode.trim()) {
          setError(copy.missingCode);
          return;
        }

        const { error: verifyError } = await supabase.auth.verifyOtp({
          email: recoveryEmail,
          token: otpCode.trim(),
          type: "recovery",
        });

        if (verifyError) {
          setError(verifyError.message);
          return;
        }

        setMode("new-password");
        setMessage(copy.codeVerified);
        return;
      }

      if (mode === "new-password") {
        if (!password.trim() || !confirmPassword.trim()) {
          setError(copy.missingNewPassword);
          return;
        }

        if (!isPasswordStrong) {
          setError(copy.weakPassword);
          return;
        }

        if (password !== confirmPassword) {
          setError(copy.passwordMismatch);
          return;
        }

        const { error: updateError } = await supabase.auth.updateUser({
          password,
        });

        if (updateError) {
          setError(updateError.message);
          return;
        }

        setMessage(copy.passwordUpdated);

        setTimeout(async () => {
          await supabase.auth.signOut();

          window.location.href = `/${locale}/login`;
        }, 1200);
        return;
      }

      if (!normalizedEmail || !password.trim()) {
        setError(copy.missingLogin);
        return;
      }

      if (mode === "register") {
        if (!name.trim()) {
          setError(copy.missingName);
          return;
        }

        if (!isPasswordStrong) {
          setError(copy.weakPassword);
          return;
        }

        if (password !== confirmPassword) {
          setError(copy.passwordMismatch);
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              name: name.trim(),
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data.user && data.user.identities?.length === 0) {
          setError(copy.emailExists);
          return;
        }

        if (!data.session) {
          setMode("login");
          setPassword("");
          setConfirmPassword("");
          setMessage(copy.checkEmail);
          return;
        }

        if (!canOpenDashboard(normalizedEmail)) {
          await supabase.auth.signOut();
          window.location.replace(`/${locale}/home`);
          return;
        }

        router.replace(`/${locale}/dashboard`);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        setError(copy.invalid);
        return;
      }

      if (!canOpenDashboard(normalizedEmail)) {
        await supabase.auth.signOut();
        window.location.replace(`/${locale}/home`);
        return;
      }

      router.replace(`/${locale}/dashboard`);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.invalid);
    } finally {
      setIsLoading(false);
    }
  }

  const buttonText = isLoading
    ? mode === "register"
      ? copy.registerLoading
      : mode === "forgot"
        ? copy.forgotLoading
        : mode === "verify-code"
          ? copy.verifyCodeLoading
          : mode === "new-password"
            ? copy.savePasswordLoading
            : copy.loginLoading
    : mode === "register"
      ? copy.registerButton
      : mode === "forgot"
        ? copy.forgotButton
        : mode === "verify-code"
          ? copy.verifyCodeButton
          : mode === "new-password"
            ? copy.savePasswordButton
            : copy.loginButton;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="relative min-h-screen overflow-x-hidden bg-[var(--background)] px-4 py-5 text-[var(--foreground)] sm:px-6 lg:px-8"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_34%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_32%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-6xl items-center">
        <div className="relative grid w-full items-center gap-6 lg:grid-cols-[1fr_0.92fr] xl:grid-cols-[1.05fr_0.85fr]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-10 left-1/2 z-10 hidden w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--background)_72%,transparent)] to-transparent blur-xl lg:block"
          />
          <AuthHero isArabic={isArabic} copy={copy} />

          <AuthPanel
            mode={mode}
            theme={theme}
            isArabic={isArabic}
            copy={copy}
            name={name}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            otpCode={otpCode}
            recoveryEmail={recoveryEmail}
            error={error}
            message={message}
            isLoading={isLoading}
            buttonText={buttonText}
            passwordRules={passwordRules}
            showPasswordRules={showPasswordRules}
            lightModeLabel={copy.lightModeLabel}
            darkModeLabel={copy.darkModeLabel}
            languageLabel={copy.languageLabel}
            onNameChange={setName}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onOtpCodeChange={setOtpCode}
            onSubmit={handleSubmit}
            onSwitchMode={switchMode}
            onToggleLocale={toggleLocale}
            onToggleTheme={toggleTheme}
          />
        </div>
      </div>
    </main>
  );
}
