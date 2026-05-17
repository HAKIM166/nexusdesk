"use client";

import { FormEvent, useMemo, useState } from "react";
import { SendHorizontal } from "lucide-react";

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
    [isArabic],
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
    [isArabic],
  );

  const textAlignClassName = isArabic ? "text-right" : "text-left";
  const rowDirectionClassName = "flex-row";
  const suggestionsAlignClassName = "justify-start";

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
    <div dir={isArabic ? "rtl" : "ltr"} className={textAlignClassName}>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          {labels.title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
          {labels.helper}
        </p>
      </div>

      <div
        className={`mb-3 flex flex-wrap gap-2 ${suggestionsAlignClassName}`}
      >
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isLoading}
            className="rounded-xl border border-[var(--ai-chip-border)] bg-[var(--ai-chip-bg)] px-3 py-1.5 text-xs font-medium text-[var(--ai-chip-text)] transition hover:border-[var(--ai-chip-hover-border)] hover:bg-[var(--ai-chip-hover-bg)] hover:text-[var(--ai-chip-hover-text)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={labels.placeholder}
          disabled={isLoading}
          rows={2}
          dir={isArabic ? "rtl" : "ltr"}
          className={`w-full resize-none rounded-2xl border border-[var(--ai-input-border)] bg-[var(--ai-input-bg)] px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--foreground-soft)] focus:border-[var(--ai-input-focus-border)] focus:bg-[var(--ai-input-focus-bg)] disabled:cursor-not-allowed disabled:opacity-70 ${textAlignClassName}`}
        />

        <div
          className={`flex items-center justify-between gap-3 ${rowDirectionClassName}`}
        >
          <span className="min-w-0 flex-1 text-xs text-[var(--foreground-muted)]">
            {value.trim().length === 0 && !isLoading ? labels.empty : "\u00A0"}
          </span>

          <button
            type="submit"
            disabled={isLoading || value.trim().length === 0}
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--ai-send-border)] bg-[var(--ai-send-bg)] px-4 py-2 text-sm font-semibold text-[var(--ai-send-text)] transition hover:bg-[var(--ai-send-hover-bg)] disabled:cursor-not-allowed disabled:border-[var(--ai-send-disabled-border)] disabled:bg-[var(--ai-send-disabled-bg)] disabled:text-[var(--ai-send-disabled-text)] ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <SendHorizontal
              className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`}
            />

            <span>{isLoading ? labels.sending : labels.send}</span>
          </button>
        </div>
      </form>
    </div>
  );
}