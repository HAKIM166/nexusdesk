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
    .filter((l) => l.trim());

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
        className={`max-w-[65%] sm:max-w-[70%] lg:max-w-[60%] rounded-2xl border px-4 py-3 ${
          isUser
            ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-200"
            : "bg-white/5 border-white/10 text-[var(--foreground)]"
        }`}
      >
        {/* Header */}
        <div className="mb-2 text-xs opacity-70">
          {isUser ? (isArabic ? "أنت" : "You") : "Nexus AI"}
        </div>

        {/* Content */}
        <div
          dir={isArabic ? "rtl" : "ltr"}
          className={`space-y-1 text-sm ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* 🔥 ACTION BUTTONS */}
        {isAssistant && onAction && (
          <div
            className={`mt-3 flex flex-wrap gap-2 ${
              isArabic ? "justify-end" : "justify-start"
            }`}
          >
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => onAction(action.text)}
                className="rounded-lg border border-white/10 px-3 py-1 text-xs transition hover:bg-white/10"
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