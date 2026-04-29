"use client";

import { FormEvent, useMemo, useState } from "react";
import { Locale } from "@/lib/constants";

type PromptFormProps = {
  locale: Locale;
  onSend: (text: string) => void;
  isLoading?: boolean;
};

const ARABIC_SUGGESTIONS = [
  "لخّص حالة العملاء الحاليين",
  "ما أهم المشاريع المتأخرة؟",
  "اقترح الخطوة التالية لفريق العمل",
];

const ENGLISH_SUGGESTIONS = [
  "Summarize the current clients",
  "Which projects need attention?",
  "Suggest the next best action",
];

export default function PromptForm({
  locale,
  onSend,
  isLoading = false,
}: PromptFormProps) {
  const [value, setValue] = useState("");

  const isArabic = locale === "ar";

  const suggestions = useMemo(
    () => (isArabic ? ARABIC_SUGGESTIONS : ENGLISH_SUGGESTIONS),
    [isArabic]
  );

  const labels = useMemo(
    () => ({
      title: isArabic ? "اسأل Nexus AI" : "Ask Nexus AI",
      placeholder: isArabic
        ? "اكتب سؤالك عن العملاء أو المشاريع أو الخطوات القادمة..."
        : "Ask about clients, projects, or next best actions...",
      helper: isArabic
        ? "يمكنك إرسال سؤال مباشر أو اختيار اقتراح سريع."
        : "You can send a direct question or use a quick suggestion.",
      send: isArabic ? "إرسال" : "Send",
      sending: isArabic ? "جارٍ الإرسال..." : "Sending...",
      empty: isArabic ? "اكتب رسالة أولاً" : "Enter a message first",
    }),
    [isArabic]
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = value.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed);
    setValue("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;
    onSend(suggestion);
  };

  return (
    <div className="panel p-4 sm:p-5">
      <div className={isArabic ? "text-right" : "text-left"}>
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          {labels.title}
        </h3>
        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          {labels.helper}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isLoading}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[var(--foreground-muted)] transition hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={labels.placeholder}
          disabled={isLoading}
          rows={4}
          dir={isArabic ? "rtl" : "ltr"}
          className={`w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-muted)] focus:border-emerald-400/30 focus:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-70 ${
            isArabic ? "text-right" : "text-left"
          }`}
        />

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-[var(--foreground-muted)]">
            {value.trim().length === 0 && !isLoading ? labels.empty : "\u00A0"}
          </span>

          <button
            type="submit"
            disabled={isLoading || value.trim().length === 0}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? labels.sending : labels.send}
          </button>
        </div>
      </form>
    </div>
  );
}