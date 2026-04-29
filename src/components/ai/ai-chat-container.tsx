"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Locale } from "@/lib/constants";
import { useAIChat } from "@/hooks/use-ai-chat";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";
import { useUIStore } from "@/store/ui-store";
import PromptForm from "@/components/ai/prompt-form";
import AIMessageBox from "@/components/ai/ai-message-box";
import { AIAction, AIRequestMode } from "@/types/ai";

import { Sparkles, Bot, Check } from "lucide-react";

type AIChatContainerProps = {
  locale: Locale;
};

export default function AIChatContainer({ locale }: AIChatContainerProps) {
  const searchParams = useSearchParams();

  const rawMode = searchParams.get("mode");
  const clientId = searchParams.get("clientId");
  const projectId = searchParams.get("projectId");

  const mode: AIRequestMode =
    rawMode === "client" || rawMode === "project" || rawMode === "general"
      ? rawMode
      : "general";

  const clients = useClientStore((state) => state.clients);
  const projects = useProjectStore((state) => state.projects);

  const updateClientStatus = useClientStore(
    (state) => state.updateClientStatus,
  );
  const updateProjectStatus = useProjectStore(
    (state) => state.updateProjectStatus,
  );

  const aiEnabled = useUIStore((state) => state.aiEnabled);
  const aiAutoSuggestions = useUIStore((state) => state.aiAutoSuggestions);

  const { messages, isLoading, error, sendMessage } = useAIChat();

  const [pendingAction, setPendingAction] = useState<AIAction | undefined>(
    undefined,
  );
  const autoPromptSentRef = useRef(false);

  const isArabic = locale === "ar";

  const client = useMemo(() => {
    if (!clientId) return undefined;
    return clients.find((c) => c.id === clientId);
  }, [clients, clientId]);

  const project = useMemo(() => {
    if (!projectId) return undefined;
    return projects.find((p) => p.id === projectId);
  }, [projects, projectId]);

  const contextTitle = useMemo(() => {
    if (mode === "client" && client) {
      return isArabic
        ? `محادثة خاصة بالعميل: ${client.name}`
        : `Client-focused chat: ${client.name}`;
    }

    if (mode === "project" && project) {
      return isArabic
        ? `محادثة خاصة بالمشروع: ${project.title}`
        : `Project-focused chat: ${project.title}`;
    }

    return isArabic ? "محادثة عامة" : "General chat";
  }, [mode, client, project, isArabic]);

  const contextDescription = useMemo(() => {
    if (mode === "client" && client) {
      return isArabic
        ? "سيحلل الذكاء الاصطناعي هذا العميل تحديدًا ويقترح الخطوات التالية المناسبة."
        : "AI will analyze this specific client and suggest relevant next actions.";
    }

    if (mode === "project" && project) {
      return isArabic
        ? "سيحلل الذكاء الاصطناعي هذا المشروع تحديدًا ويقترح المخاطر والخطوات التالية."
        : "AI will analyze this specific project and suggest risks and next steps.";
    }

    return isArabic
      ? "يمكنك سؤال الذكاء الاصطناعي عن العملاء أو المشاريع أو الخطوات القادمة."
      : "Ask AI about clients, projects, or the next best actions.";
  }, [mode, client, project, isArabic]);

  const emptyStateText = useMemo(() => {
    if (!aiEnabled) {
      return isArabic
        ? "تم تعطيل مساعد الذكاء الاصطناعي من الإعدادات. فعّله مرة أخرى للمتابعة."
        : "The AI assistant is disabled from settings. Enable it again to continue.";
    }

    if (mode === "client" && client) {
      return isArabic
        ? `ابدأ بسؤال عن العميل "${client.name}"، مثل: ما الخطوة التالية المناسبة معه؟`
        : `Start by asking about "${client.name}", for example: What is the next best action for this client?`;
    }

    if (mode === "project" && project) {
      return isArabic
        ? `ابدأ بسؤال عن المشروع "${project.title}"، مثل: هل هذا المشروع معرض للخطر؟`
        : `Start by asking about "${project.title}", for example: Is this project at risk?`;
    }

    return isArabic
      ? "ابدأ محادثة مع Nexus AI حول العملاء أو المشاريع أو الخطوات القادمة."
      : "Start chatting with Nexus AI about clients, projects, or next actions.";
  }, [aiEnabled, mode, client, project, isArabic]);

  const autoPrompt = useMemo(() => {
    if (mode === "client" && client) {
      return isArabic
        ? `حلل هذا العميل "${client.name}" واقترح الخطوات التالية.`
        : `Analyze this client "${client.name}" and suggest next actions.`;
    }

    if (mode === "project" && project) {
      return isArabic
        ? `حلل هذا المشروع "${project.title}" وحدد المخاطر والخطوات التالية.`
        : `Analyze this project "${project.title}" and identify risks and next steps.`;
    }

    return null;
  }, [mode, client, project, isArabic]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!aiEnabled) return;

      const res = await sendMessage(text, {
        mode,
        clients: mode === "general" ? clients : undefined,
        projects: mode === "general" ? projects : undefined,
        client: mode === "client" ? client : undefined,
        project: mode === "project" ? project : undefined,
      });

      if (res?.action && aiAutoSuggestions) {
        setPendingAction(res.action);
      } else {
        setPendingAction(undefined);
      }
    },
    [
      aiEnabled,
      aiAutoSuggestions,
      sendMessage,
      mode,
      clients,
      projects,
      client,
      project,
    ],
  );

  const handleApplyAction = useCallback(() => {
    if (!pendingAction) return;

    if (pendingAction.type === "update_client_status") {
      updateClientStatus(pendingAction.targetId, pendingAction.payload.status);
    }

    if (pendingAction.type === "update_project_status") {
      updateProjectStatus(pendingAction.targetId, pendingAction.payload.status);
    }

    setPendingAction(undefined);
  }, [pendingAction, updateClientStatus, updateProjectStatus]);

  useEffect(() => {
    if (!aiEnabled) return;
    if (autoPromptSentRef.current) return;
    if (messages.length > 0) return;
    if (isLoading) return;
    if (!autoPrompt) return;

    autoPromptSentRef.current = true;

    const runAutoPrompt = async () => {
      const res = await sendMessage(autoPrompt, {
        mode,
        clients: mode === "general" ? clients : undefined,
        projects: mode === "general" ? projects : undefined,
        client: mode === "client" ? client : undefined,
        project: mode === "project" ? project : undefined,
      });

      if (res?.action && aiAutoSuggestions) {
        setPendingAction(res.action);
      } else {
        setPendingAction(undefined);
      }
    };

    void runAutoPrompt();
  }, [
    aiEnabled,
    aiAutoSuggestions,
    autoPrompt,
    messages.length,
    isLoading,
    sendMessage,
    mode,
    clients,
    projects,
    client,
    project,
  ]);

  return (
    /* AI_PAGE_ROOT: الحاوية الأساسية للصفحة كلها */
    <div className="flex min-h-[calc(100vh-150px)] flex-col">
      {/* AI_TOP_CONTEXT: عنوان صغير جدًا فوق الشات بدل كارت كبير */}
      <div
        className={`mb-4 flex items-center justify-between gap-4 ${
          isArabic ? "text-right" : "text-left"
        }`}
      >
        <div className="min-w-0 space-y-1">
          {/* AI_BADGE: بادج Nexus AI الصغيرة */}
          <div
            className={`flex items-center gap-2 ${
              isArabic ? "justify-end" : "justify-start"
            }`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-xs text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.18)]">
              ✦
            </span>

            <span className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-300/80">
              Nexus AI
            </span>
          </div>

          {/* AI_CONTEXT_TITLE: عنوان المود الحالي */}
          <h2 className="truncate text-lg font-semibold text-[var(--foreground)]">
            {contextTitle}
          </h2>

          {/* AI_CONTEXT_DESCRIPTION: وصف صغير جدًا بدون مساحة كبيرة */}
          <p className="max-w-2xl text-xs leading-5 text-[var(--foreground-soft)] sm:text-sm">
            {contextDescription}
          </p>
        </div>
      </div>

      {/* AI_DISABLED_ALERT: رسالة تظهر فقط لو الذكاء متوقف من الإعدادات */}
      {!aiEnabled && (
        <div
          className={`mb-4 rounded-2xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-sm text-red-300 ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {isArabic
            ? "تم تعطيل مساعد الذكاء الاصطناعي من الإعدادات. يمكنك إعادة تفعيله من صفحة الإعدادات في أي وقت."
            : "The AI assistant is disabled from settings. You can re-enable it anytime from the settings page."}
        </div>
      )}

      {/* AI_CHAT_SHELL: جسم الشات الرئيسي بدون مربع خارجي واضح */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* AI_MESSAGES_AREA: منطقة الرسائل والـ empty state */}
        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
          {messages.length === 0 ? (
            /* AI_EMPTY_STATE: بداية خفيفة جدًا قبل أول رسالة بدون كارت كبير */
            <div
              className={`flex min-h-[120px] items-start ${
                isArabic ? "justify-end text-right" : "justify-start text-left"
              }`}
            >
              <div className="max-w-md pt-1">
                {/* AI_EMPTY_STATUS: حالة بسيطة بأيقونة حقيقية بدل الإيموجي */}
                <div
                  className={`mb-3 flex items-center gap-2 ${
                    isArabic ? "justify-end" : "justify-start"
                  }`}
                >
                  <Bot className="h-4 w-4 text-emerald-400" />

                  <span className="text-xs font-medium text-[var(--foreground-soft)]">
                    {aiEnabled
                      ? isArabic
                        ? "جاهز للمساعدة"
                        : "Ready to help"
                      : isArabic
                        ? "متوقف حاليًا"
                        : "Currently disabled"}
                  </span>
                </div>

                {/* AI_EMPTY_HEADING: عنوان بداية صغير وهادئ */}
                <p className="text-base font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-lg">
                  {aiEnabled
                    ? isArabic
                      ? "ابدأ محادثة مع Nexus AI"
                      : "Start chatting with Nexus AI"
                    : isArabic
                      ? "Nexus AI متوقف حاليًا"
                      : "Nexus AI is disabled"}
                </p>

                {/* AI_EMPTY_DESCRIPTION: وصف البداية بدون مساحة كبيرة */}
                <p className="mt-2 max-w-md text-sm leading-6 text-[var(--foreground-soft)]">
                  {emptyStateText}
                </p>

                {/* AI_EMPTY_HINTS: تلميحات صغيرة جدًا بدون شكل كروت واضح */}
                {aiEnabled && (
                  <div
                    className={`mt-3 flex flex-wrap gap-x-3 gap-y-2 text-xs text-[var(--foreground-soft)] ${
                      isArabic ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>
                      {isArabic ? "تحليل العملاء" : "Client insights"}
                    </span>
                    <span className="text-emerald-400/50">•</span>
                    <span>{isArabic ? "مخاطر المشاريع" : "Project risks"}</span>
                    <span className="text-emerald-400/50">•</span>
                    <span>{isArabic ? "الخطوات القادمة" : "Next actions"}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* AI_MESSAGES_LIST: قائمة الرسائل بعد بداية الشات */
            <div className="space-y-5">
              {messages.map((message) => (
                <AIMessageBox
                  key={message.id}
                  message={message}
                  locale={locale}
                  onAction={aiEnabled ? handleSend : undefined}
                />
              ))}
            </div>
          )}

          {/* AI_LOADING_MESSAGE: شكل التفكير أثناء انتظار الرد */}
          {isLoading && aiEnabled && (
            <div
              className={`mt-5 flex w-full ${
                isArabic ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-xs rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                <div
                  className={`mb-2 flex items-center gap-2 text-xs font-medium text-[var(--foreground-soft)] ${
                    isArabic
                      ? "justify-end text-right"
                      : "justify-start text-left"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  <span>Nexus AI</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {/* AI_ERROR_MESSAGE: رسالة الخطأ لو حصل مشكلة في الإرسال */}
          {error && aiEnabled && (
            <div
              className={`mt-5 rounded-2xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-sm text-red-300 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {isArabic
                ? "حدث خطأ أثناء إرسال الرسالة: "
                : "An error occurred while sending the message: "}
              {error}
            </div>
          )}

          {/* AI_PENDING_ACTION: اقتراح قابل للتنفيذ من الذكاء الاصطناعي */}
          {pendingAction && aiAutoSuggestions && aiEnabled && (
            <div
              className={`mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] p-4 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`mb-3 flex items-center gap-2 ${
                  isArabic ? "justify-end" : "justify-start"
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 text-xs text-emerald-300">
                  ✓
                </span>

                <p className="text-sm text-[var(--foreground-soft)]">
                  {isArabic
                    ? "يوجد اقتراح قابل للتنفيذ من Nexus AI."
                    : "Nexus AI has an actionable suggestion."}
                </p>
              </div>

              <button
                onClick={handleApplyAction}
                className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
              >
                {isArabic ? "تنفيذ الاقتراح" : "Apply Action"}
              </button>
            </div>
          )}
        </div>

        {/* AI_PROMPT_AREA: منطقة الإدخال أسفل الشات */}
        <div className="pt-4">
          <PromptForm
            locale={locale}
            onSend={handleSend}
            isLoading={isLoading || !aiEnabled}
          />
        </div>
      </div>
    </div>
  );
}
