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

type AIChatContainerProps = {
  locale: Locale;
};

export default function AIChatContainer({
  locale,
}: AIChatContainerProps) {
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
  const aiAutoSuggestions = useUIStore(
    (state) => state.aiAutoSuggestions,
  );

  const { messages, isLoading, error, sendMessage } = useAIChat();

  const [pendingAction, setPendingAction] = useState<
    AIAction | undefined
  >(undefined);
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
      updateProjectStatus(
        pendingAction.targetId,
        pendingAction.payload.status,
      );
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
    <div className="space-y-6">
      <div className="panel p-5 sm:p-6">
        <div className={isArabic ? "text-right" : "text-left"}>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {contextTitle}
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-soft)]">
            {contextDescription}
          </p>
        </div>
      </div>

      {!aiEnabled && (
        <div
          className={`rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-300 ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {isArabic
            ? "تم تعطيل مساعد الذكاء الاصطناعي من الإعدادات. يمكنك إعادة تفعيله من صفحة الإعدادات في أي وقت."
            : "The AI assistant is disabled from settings. You can re-enable it anytime from the settings page."}
        </div>
      )}

      <div className="panel flex min-h-[420px] flex-col p-4 sm:p-5">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div
              className={`flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              <div className="max-w-2xl space-y-3">
                <p className="text-base font-medium text-[var(--foreground)]">
                  {aiEnabled
                    ? isArabic
                      ? "Nexus AI جاهز للمساعدة"
                      : "Nexus AI is ready to help"
                    : isArabic
                      ? "Nexus AI متوقف حاليًا"
                      : "Nexus AI is currently disabled"}
                </p>
                <p className="text-sm leading-7 text-[var(--foreground-soft)]">
                  {emptyStateText}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <AIMessageBox
                key={message.id}
                message={message}
                locale={locale}
                onAction={aiEnabled ? handleSend : undefined}
              />
            ))
          )}

          {isLoading && aiEnabled && (
            <div
              className={`flex w-full ${
                isArabic ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-[85%] rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div
                  className={`mb-2 text-xs text-[var(--foreground-soft)] ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  Nexus AI
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 [animation-delay:300ms]" />
                </div>

                <p className="mt-3 text-xs text-[var(--foreground-soft)]">
                  {isArabic ? "جارٍ التفكير..." : "Thinking..."}
                </p>
              </div>
            </div>
          )}

          {error && aiEnabled && (
            <div
              className={`rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {isArabic
                ? "حدث خطأ أثناء إرسال الرسالة: "
                : "An error occurred while sending the message: "}
              {error}
            </div>
          )}

          {pendingAction && aiAutoSuggestions && aiEnabled && (
            <div className={isArabic ? "text-right" : "text-left"}>
              <button
                onClick={handleApplyAction}
                className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-500/20"
              >
                {isArabic ? "تنفيذ الاقتراح" : "Apply Action"}
              </button>
            </div>
          )}
        </div>
      </div>

      <PromptForm
        locale={locale}
        onSend={handleSend}
        isLoading={isLoading || !aiEnabled}
      />
    </div>
  );
}