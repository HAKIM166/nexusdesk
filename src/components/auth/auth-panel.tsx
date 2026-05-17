"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  KeyRound,
  Loader2,
  LockKeyhole,
  LogIn,
  Mail,
  Send,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import Lottie from "lottie-react";

import NexusLogo from "@/components/common/nexus-logo";

import { AuthControls } from "./auth-controls";
import { AuthField } from "./auth-field";
import type { AuthCopy, AuthMode, PasswordRule, ThemeMode } from "./auth-types";

type AuthPanelProps = {
  mode: AuthMode;
  theme: ThemeMode;
  isArabic: boolean;
  copy: AuthCopy;

  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  otpCode: string;
  recoveryEmail: string;

  lightModeLabel: string;
  darkModeLabel: string;
  languageLabel: string;

  error: string;
  message: string;
  isLoading: boolean;
  buttonText: string;
  passwordRules: PasswordRule[];
  showPasswordRules: boolean;

  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onOtpCodeChange: (value: string) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSwitchMode: (mode: AuthMode) => void;
  onToggleLocale: () => void;
  onToggleTheme: () => void;
};

export function AuthPanel({
  mode,
  theme,
  isArabic,
  copy,
  name,
  email,
  password,
  confirmPassword,
  otpCode,
  recoveryEmail,
  lightModeLabel,
  darkModeLabel,
  languageLabel,
  error,
  message,
  isLoading,
  buttonText,
  passwordRules,
  showPasswordRules,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onOtpCodeChange,
  onSubmit,
  onSwitchMode,
  onToggleLocale,
  onToggleTheme,
}: AuthPanelProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/animations/auth-hero.json", {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (data) setAnimationData(data);
      })
      .catch(() => {
        setAnimationData(null);
      });

    return () => controller.abort();
  }, []);

  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isVerifyCode = mode === "verify-code";
  const isNewPassword = mode === "new-password";

  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-md flex-col justify-center px-5 py-3 sm:max-w-[540px] sm:px-8 lg:block lg:min-h-0 lg:max-w-[440px] lg:px-1 lg:py-6">
      <div className="mb-5 flex -translate-y-2 items-center justify-between gap-3 sm:-translate-y-3 lg:mb-8 lg:translate-y-0">
        <NexusLogo
          layout="icon"
          tone="accent"
          className="-translate-x-2 h-9 w-9 sm:-translate-x-3 lg:translate-x-0 lg:h-10 lg:w-10"
        />

        <div className="translate-x-2 sm:translate-x-3 lg:translate-x-0">
          <AuthControls
            theme={theme}
            lightModeLabel={lightModeLabel}
            darkModeLabel={darkModeLabel}
            languageLabel={languageLabel}
            onToggleLocale={onToggleLocale}
            onToggleTheme={onToggleTheme}
          />
        </div>
      </div>

      {animationData && (
        <div className="pointer-events-none mb-3 flex h-[112px] items-center justify-center overflow-hidden sm:h-[130px] md:h-[145px] lg:hidden">
          <div className="absolute top-20 h-24 w-56 rounded-full bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] blur-3xl sm:w-72" />

          <Lottie
            animationData={animationData}
            loop
            autoplay
            className="relative z-10 h-[155px] w-full max-w-[300px] opacity-95 sm:h-[175px] sm:max-w-[350px] md:h-[195px] md:max-w-[390px]"
          />
        </div>
      )}

      <div className={isArabic ? "text-right" : "text-left"}>
        <span className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--auth-link)] lg:text-xs lg:tracking-[0.22em]">
          {copy.badge}
        </span>

        <h2 className="mt-4 max-w-[460px] text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.055em] text-[var(--foreground)] sm:text-[2.15rem] lg:mt-4 lg:text-[2.15rem] lg:leading-[1.12] xl:text-[2.35rem]">
          {copy.title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-[var(--foreground-soft)] sm:text-base sm:leading-7 lg:mt-4 lg:text-sm">
          {copy.subtitle}
        </p>

        {(isVerifyCode || isNewPassword) && (recoveryEmail || email) && (
          <p className="mt-3 text-xs font-medium text-[var(--foreground-soft)]">
            {recoveryEmail || email}
          </p>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-5 space-y-3 lg:mt-6 lg:space-y-3.5"
      >
        {isRegister && (
          <AuthField
            label={copy.name}
            icon={User}
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder={copy.namePlaceholder}
            autoComplete="name"
          />
        )}

        {(isLogin || isRegister || isForgot) && (
          <AuthField
            label={copy.email}
            icon={Mail}
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder={copy.emailPlaceholder}
            autoComplete="email"
          />
        )}

        {isVerifyCode && (
          <AuthField
            label={copy.code}
            icon={ShieldCheck}
            inputMode="numeric"
            value={otpCode}
            onChange={(event) => onOtpCodeChange(event.target.value)}
            placeholder={copy.codePlaceholder}
            autoComplete="one-time-code"
            maxLength={8}
          />
        )}

        {(isLogin || isRegister || isNewPassword) && (
          <AuthField
            label={isNewPassword ? copy.newPassword : copy.password}
            icon={LockKeyhole}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder={
              isNewPassword
                ? copy.newPasswordPlaceholder
                : copy.passwordPlaceholder
            }
            autoComplete={
              isRegister || isNewPassword ? "new-password" : "current-password"
            }
          />
        )}

        {showPasswordRules && password.length > 0 && (
          <div className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
            {passwordRules.map((rule) => (
              <div
                key={rule.label}
                className={`flex items-center gap-2 text-xs font-medium transition ${
                  rule.isValid
                    ? "text-[var(--success)]"
                    : "text-[var(--foreground-soft)]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    rule.isValid
                      ? "bg-[var(--success)]"
                      : "bg-[var(--foreground-soft)]"
                  }`}
                />

                <span>{rule.label}</span>
              </div>
            ))}
          </div>
        )}

        {(isRegister || isNewPassword) && (
          <AuthField
            label={copy.confirmPassword}
            icon={KeyRound}
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
            placeholder={copy.confirmPasswordPlaceholder}
            autoComplete="new-password"
          />
        )}

        {(isLogin || isRegister || isNewPassword) && (
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[var(--foreground-soft)]">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            {copy.showPassword}
          </label>
        )}

        {isLogin && (
          <div className={`flex ${isArabic ? "justify-start" : "justify-end"}`}>
            <button
              type="button"
              onClick={() => onSwitchMode("forgot")}
              className="text-sm font-semibold text-[var(--auth-link)] transition hover:opacity-80"
            >
              {copy.forgotPassword}
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--danger)_24%,transparent)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] px-4 py-3 text-sm font-medium text-[var(--danger)]">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--success)_24%,transparent)] bg-[color-mix(in_srgb,var(--success)_10%,transparent)] px-4 py-3 text-sm font-medium text-[var(--success)]">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isRegister ? (
            <UserPlus className="h-4 w-4" />
          ) : isForgot ? (
            <Send className="h-4 w-4" />
          ) : isVerifyCode || isNewPassword ? (
            <ShieldCheck className="h-4 w-4" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}

          {buttonText}
        </button>
      </form>

      <div className="mt-5 space-y-3 text-center text-sm lg:mt-6">
        {isLogin && (
          <p className="text-[var(--foreground-soft)]">
            {copy.noAccount}{" "}
            <button
              type="button"
              onClick={() => onSwitchMode("register")}
              className="auth-link font-semibold transition hover:opacity-80"
            >
              {copy.createAccount}
            </button>
          </p>
        )}

        {isRegister && (
          <p className="text-[var(--foreground-soft)]">
            {copy.haveAccount}{" "}
            <button
              type="button"
              onClick={() => onSwitchMode("login")}
              className="auth-link font-semibold transition hover:opacity-80"
            >
              {copy.backToLogin}
            </button>
          </p>
        )}

        {(isForgot || isVerifyCode || isNewPassword) && (
          <button
            type="button"
            onClick={() => onSwitchMode("login")}
            className="auth-link font-semibold transition hover:opacity-80"
          >
            {copy.backToLogin}
          </button>
        )}
      </div>
    </section>
  );
}
