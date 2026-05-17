import type { Locale } from "@/lib/constants";

export type AuthMode =
  | "login"
  | "register"
  | "forgot"
  | "verify-code"
  | "new-password";

export type ThemeMode = "light" | "dark";

export type LoginFormProps = {
  locale: Locale;
};

export type PasswordRule = {
  label: string;
  isValid: boolean;
};

export type AuthCopy = {
  badge: string;
  title: string;
  subtitle: string;

  name: string;
  email: string;
  password: string;
  showPassword: string;
  confirmPassword: string;
  code: string;
  newPassword: string;

  namePlaceholder: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  confirmPasswordPlaceholder: string;
  codePlaceholder: string;
  newPasswordPlaceholder: string;

  loginButton: string;
  registerButton: string;
  forgotButton: string;
  verifyCodeButton: string;
  savePasswordButton: string;

  loginLoading: string;
  registerLoading: string;
  forgotLoading: string;
  verifyCodeLoading: string;
  savePasswordLoading: string;

  missingLogin: string;
  missingEmail: string;
  missingName: string;
  missingCode: string;
  missingNewPassword: string;
  passwordMismatch: string;
  weakPassword: string;

  passwordRuleMinLength: string;
  passwordRuleUppercase: string;
  passwordRuleLowercase: string;
  passwordRuleNumber: string;
  passwordRuleSpecial: string;

  invalid: string;
  emailExists: string;
  checkEmail: string;
  resetSent: string;
  codeSent: string;
  codeVerified: string;
  passwordUpdated: string;

  goDashboard: string;
  noAccount: string;
  haveAccount: string;
  createAccount: string;
  backToLogin: string;
  forgotPassword: string;
  lightModeLabel: string;
  darkModeLabel: string;
  languageLabel: string;
  demoNote: string;

  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
};
