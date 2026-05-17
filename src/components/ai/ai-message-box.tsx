"use client";

import { AIMessage } from "@/types/ai";
import { Locale } from "@/lib/constants";

type AIMessageBoxProps = {
  message: AIMessage;
  locale: Locale;
  onAction?: (text: string) => void;
};

function formatContent(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .trim();
}

export default function AIMessageBox({
  message,
  locale,
  onAction,
}: AIMessageBoxProps) {
  const isArabic = locale === "ar";
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const lines = formatContent(message.content)
    .split("\n")
    .filter((line) => line.trim());

  const actions = isArabic
    ? [
        { label: "إعادة التحليل", text: "حلل مرة أخرى بشكل مختصر" },
        { label: "الخطوات التالية", text: "ما الخطوات التالية؟" },
        { label: "تلخيص", text: "لخص بشكل مختصر" },
      ]
    : [
        { label: "Re-analyze", text: "Analyze again briefly" },
        { label: "Next steps", text: "What are the next steps?" },
        { label: "Summarize", text: "Summarize briefly" },
      ];

  return (
    <div
      className={`flex w-full ${
        isUser
          ? isArabic
            ? "justify-start"
            : "justify-end"
          : isArabic
            ? "justify-end"
            : "justify-start"
      }`}
    >
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className={`min-w-0 max-w-[92%] rounded-2xl border px-3.5 py-3 sm:max-w-[84%] sm:px-4 md:max-w-[72%] ${
          isArabic ? "text-right" : "text-left"
        } ${
          isUser
            ? "border-[var(--ai-user-message-border)] bg-[var(--ai-user-message-bg)] text-[var(--foreground)]"
            : "border-[var(--ai-assistant-message-border)] bg-[var(--ai-assistant-message-bg)] text-[var(--foreground)]"
        }`}
      >
        <div
          className={`mb-2 text-xs font-semibold ${
            isUser
              ? "text-[var(--ai-user-message-label)]"
              : "text-[var(--ai-assistant-message-label)]"
          }`}
        >
          {isUser ? (isArabic ? "أنت" : "You") : "Nexus AI"}
        </div>

        <div className="space-y-1.5 text-sm leading-6">
          {lines.map((line, index) => (
            <p key={`${message.id}-${index}`} className="break-words">
              {line}
            </p>
          ))}
        </div>

        {isAssistant && onAction && (
          <div
            className={`mt-3 flex flex-wrap gap-2 ${
              isArabic ? "justify-end" : "justify-start"
            }`}
          >
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => onAction(action.text)}
                className="rounded-xl border border-[var(--ai-chip-border)] bg-[var(--ai-chip-bg)] px-3 py-1.5 text-xs font-medium text-[var(--ai-chip-text)] transition hover:border-[var(--ai-chip-hover-border)] hover:bg-[var(--ai-chip-hover-bg)] hover:text-[var(--ai-chip-hover-text)]"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}