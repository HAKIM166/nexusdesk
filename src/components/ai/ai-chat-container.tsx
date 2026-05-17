"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, Trash2 } from "lucide-react";

import AIMessageBox from "@/components/ai/ai-message-box";
import PromptForm from "@/components/ai/prompt-form";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import { useAIChat } from "@/hooks/use-ai-chat";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";
import { useUIStore } from "@/store/ui-store";
import { AIAction, AIRequestMode } from "@/types/ai";

type AIChatContainerProps = {
  locale: Locale;
};

type AIChatCopy = {
  clientContextTitle: string;
  projectContextTitle: string;
  generalContextTitle: string;
  clientContextDescription: string;
  projectContextDescription: string;
  generalContextDescription: string;
  disabledEmptyState: string;
  clientEmptyState: string;
  projectEmptyState: string;
  generalEmptyState: string;
  clientAutoPrompt: string;
  projectAutoPrompt: string;
  disabledAlert: string;
  readyToHelp: string;
  currentlyDisabled: string;
  emptyEnabledTitle: string;
  emptyDisabledTitle: string;
  clientInsights: string;
  projectRisks: string;
  nextActions: string;
  loadingAssistantName: string;
  errorPrefix: string;
  pendingActionText: string;
  applyAction: string;
};

function getAIChatCopy(
  messages: ReturnType<typeof getMessages>,
  isArabic: boolean,
): AIChatCopy {
  const fallback: AIChatCopy = isArabic
    ? {
        clientContextTitle: "محادثة خاصة بالعميل: {{name}}",
        projectContextTitle: "محادثة خاصة بالمشروع: {{title}}",
        generalContextTitle: "محادثة عامة",
        clientContextDescription:
          "سيحلل الذكاء الاصطناعي هذا العميل تحديدًا ويقترح الخطوات التالية المناسبة.",
        projectContextDescription:
          "سيحلل الذكاء الاصطناعي هذا المشروع تحديدًا ويقترح المخاطر والخطوات التالية.",
        generalContextDescription:
          "يمكنك سؤال الذكاء الاصطناعي عن العملاء أو المشاريع أو الخطوات القادمة.",
        disabledEmptyState:
          "تم تعطيل مساعد الذكاء الاصطناعي من الإعدادات. فعّله مرة أخرى للمتابعة.",
        clientEmptyState:
          "ابدأ بسؤال عن العميل {{name}}، مثل: ما الخطوة التالية المناسبة معه؟",
        projectEmptyState:
          "ابدأ بسؤال عن المشروع {{title}}، مثل: هل هذا المشروع معرض للخطر؟",
        generalEmptyState:
          "ابدأ محادثة مع Nexus AI حول العملاء أو المشاريع أو الخطوات القادمة.",
        clientAutoPrompt: "حلل هذا العميل {{name}} واقترح الخطوات التالية.",
        projectAutoPrompt:
          "حلل هذا المشروع {{title}} وحدد المخاطر والخطوات التالية.",
        disabledAlert:
          "تم تعطيل مساعد الذكاء الاصطناعي من الإعدادات. يمكنك إعادة تفعيله من صفحة الإعدادات في أي وقت.",
        readyToHelp: "جاهز للمساعدة",
        currentlyDisabled: "متوقف حاليًا",
        emptyEnabledTitle: "ابدأ محادثة مع Nexus AI",
        emptyDisabledTitle: "Nexus AI متوقف حاليًا",
        clientInsights: "تحليل العملاء",
        projectRisks: "مخاطر المشاريع",
        nextActions: "الخطوات القادمة",
        loadingAssistantName: "Nexus AI",
        errorPrefix: "حدث خطأ أثناء إرسال الرسالة: ",
        pendingActionText: "يوجد اقتراح قابل للتنفيذ من Nexus AI.",
        applyAction: "تنفيذ الاقتراح",
      }
    : {
        clientContextTitle: "Client-focused chat: {{name}}",
        projectContextTitle: "Project-focused chat: {{title}}",
        generalContextTitle: "General chat",
        clientContextDescription:
          "AI will analyze this specific client and suggest relevant next actions.",
        projectContextDescription:
          "AI will analyze this specific project and suggest risks and next steps.",
        generalContextDescription:
          "Ask AI about clients, projects, or the next best actions.",
        disabledEmptyState:
          "The AI assistant is disabled from settings. Enable it again to continue.",
        clientEmptyState:
          "Start by asking about {{name}}, for example: What is the next best action for this client?",
        projectEmptyState:
          "Start by asking about {{title}}, for example: Is this project at risk?",
        generalEmptyState:
          "Start chatting with Nexus AI about clients, projects, or next actions.",
        clientAutoPrompt:
          "Analyze this client {{name}} and suggest next actions.",
        projectAutoPrompt:
          "Analyze this project {{title}} and identify risks and next steps.",
        disabledAlert:
          "The AI assistant is disabled from settings. You can re-enable it anytime from the settings page.",
        readyToHelp: "Ready to help",
        currentlyDisabled: "Currently disabled",
        emptyEnabledTitle: "Start chatting with Nexus AI",
        emptyDisabledTitle: "Nexus AI is disabled",
        clientInsights: "Client insights",
        projectRisks: "Project risks",
        nextActions: "Next actions",
        loadingAssistantName: "Nexus AI",
        errorPrefix: "An error occurred while sending the message: ",
        pendingActionText: "Nexus AI has an actionable suggestion.",
        applyAction: "Apply Action",
      };

  const aiMessages = messages.ai as typeof messages.ai & {
    chat?: Partial<AIChatCopy>;
  };

  return {
    ...fallback,
    ...(aiMessages.chat ?? {}),
  };
}

function interpolate(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce((text, [key, value]) => {
    return text.replaceAll(`{{${key}}}`, value);
  }, template);
}

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
  const initializeClients = useClientStore((state) => state.initializeClients);
  const initializeProjects = useProjectStore(
    (state) => state.initializeProjects,
  );
  const clientsLoading = useClientStore((state) => state.isLoading);
  const projectsLoading = useProjectStore((state) => state.isLoading);

  const updateClientStatus = useClientStore(
    (state) => state.updateClientStatus,
  );
  const updateProjectStatus = useProjectStore(
    (state) => state.updateProjectStatus,
  );

  const aiEnabled = useUIStore((state) => state.aiEnabled);
  const aiAutoSuggestions = useUIStore((state) => state.aiAutoSuggestions);

  const { messages, isLoading, error, sendMessage, resetMessages } =
    useAIChat();

  const [pendingAction, setPendingAction] = useState<AIAction | undefined>(
    undefined,
  );

  const autoPromptSentRef = useRef(false);

  const isArabic = locale === "ar";
  const appMessages = getMessages(locale);

  const chatCopy = useMemo(
    () => getAIChatCopy(appMessages, isArabic),
    [appMessages, isArabic],
  );

  const direction = isArabic ? "rtl" : "ltr";
  const textAlignClassName = isArabic ? "text-right" : "text-left";
  const alignContainerClassName = isArabic ? "items-end" : "items-start";
  const rowClassName = "justify-start";
  const messageFlowClassName = isArabic ? "items-end" : "items-start";
  const contentSideClassName = isArabic ? "ml-auto" : "";

  useEffect(() => {
    initializeClients();
    initializeProjects();
  }, [initializeClients, initializeProjects]);

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
      return interpolate(chatCopy.clientContextTitle, {
        name: client.name,
      });
    }

    if (mode === "project" && project) {
      return interpolate(chatCopy.projectContextTitle, {
        title: project.title,
      });
    }

    return chatCopy.generalContextTitle;
  }, [mode, client, project, chatCopy]);

  const contextDescription = useMemo(() => {
    if (mode === "client" && client) {
      return chatCopy.clientContextDescription;
    }

    if (mode === "project" && project) {
      return chatCopy.projectContextDescription;
    }

    return chatCopy.generalContextDescription;
  }, [mode, client, project, chatCopy]);

  const emptyStateText = useMemo(() => {
    if (!aiEnabled) {
      return chatCopy.disabledEmptyState;
    }

    if (mode === "client" && client) {
      return interpolate(chatCopy.clientEmptyState, {
        name: `"${client.name}"`,
      });
    }

    if (mode === "project" && project) {
      return interpolate(chatCopy.projectEmptyState, {
        title: `"${project.title}"`,
      });
    }

    return chatCopy.generalEmptyState;
  }, [aiEnabled, mode, client, project, chatCopy]);

  const autoPrompt = useMemo(() => {
    if (mode === "client" && client) {
      return interpolate(chatCopy.clientAutoPrompt, {
        name: `"${client.name}"`,
      });
    }

    if (mode === "project" && project) {
      return interpolate(chatCopy.projectAutoPrompt, {
        title: `"${project.title}"`,
      });
    }

    return null;
  }, [mode, client, project, chatCopy]);

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

  const handleClearChat = useCallback(() => {
    const shouldClear = window.confirm(
      isArabic ? "هل تريد مسح المحادثة؟" : "Clear this chat?",
    );

    if (!shouldClear) return;

    resetMessages();
    setPendingAction(undefined);
    autoPromptSentRef.current = false;
  }, [isArabic, resetMessages]);
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

  if (clientsLoading || projectsLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <section dir={direction} className="flex flex-col">
      <div
        className={`flex w-full flex-col gap-8 ${alignContainerClassName} ${textAlignClassName} md:gap-10`}
      >
        <div
          className={`w-full max-w-2xl ${contentSideClassName} ${textAlignClassName}`}
        >
          <div className={`mb-3 flex items-center gap-2 ${rowClassName}`}>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[var(--ai-mark-border)] bg-[var(--ai-mark-bg)] text-[11px] text-[var(--ai-mark-text)]">
              ✦
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--ai-brand-text)]">
              NEXUS AI
            </span>
          </div>

          <h2 className="text-xl font-semibold leading-7 tracking-[-0.02em] text-[var(--foreground)] md:text-2xl">
            {contextTitle}
          </h2>

          <p className="mt-2 text-sm leading-6 text-[var(--foreground-soft)] md:text-base">
            {contextDescription}
          </p>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearChat}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2 text-xs font-medium text-[var(--foreground-soft)] transition hover:border-red-400/40 hover:text-red-300 sm:text-sm"
            >
              <Trash2 className="h-4 w-4" />
              {isArabic ? "مسح المحادثة" : "Clear chat"}
            </button>
          )}
        </div>

        {!aiEnabled && (
          <div
            className={`w-full rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-sm leading-6 text-red-300 ${textAlignClassName}`}
          >
            {chatCopy.disabledAlert}
          </div>
        )}

        <div className={`w-full ${textAlignClassName}`}>
          {messages.length === 0 ? (
            <div className={`w-full max-w-2xl ${contentSideClassName}`}>
              <div className={`mb-3 flex items-center gap-2 ${rowClassName}`}>
                <Bot className="h-4 w-4 shrink-0 text-[var(--ai-status-icon)]" />

                <span className="text-sm font-medium text-[var(--ai-status-text)]">
                  {aiEnabled
                    ? chatCopy.readyToHelp
                    : chatCopy.currentlyDisabled}
                </span>
              </div>

              <p className="text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)] md:text-2xl">
                {aiEnabled
                  ? chatCopy.emptyEnabledTitle
                  : chatCopy.emptyDisabledTitle}
              </p>

              <p className="mt-2 text-sm leading-6 text-[var(--foreground-soft)] md:text-base">
                {emptyStateText}
              </p>

              {aiEnabled && (
                <div
                  className={`mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-[var(--ai-hint-text)] ${rowClassName}`}
                >
                  <span>{chatCopy.clientInsights}</span>
                  <span className="text-[var(--ai-dot-text)]">•</span>
                  <span>{chatCopy.projectRisks}</span>
                  <span className="text-[var(--ai-dot-text)]">•</span>
                  <span>{chatCopy.nextActions}</span>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`flex max-h-[calc(100vh-430px)] flex-col gap-3 overflow-y-auto pr-1 ${messageFlowClassName}`}
            >
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

          {isLoading && aiEnabled && (
            <div className={`mt-4 flex w-full ${rowClassName}`}>
              <div className="max-w-xs rounded-xl border border-[var(--ai-assistant-message-border)] bg-[var(--ai-assistant-message-bg)] px-3.5 py-3">
                <div
                  className={`mb-2 flex items-center gap-2 text-xs font-medium text-[var(--foreground-soft)] ${rowClassName} ${textAlignClassName}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--ai-status-icon)]" />
                  <span>{chatCopy.loadingAssistantName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--ai-status-icon)]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--ai-status-icon)] [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--ai-status-icon)] [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {error && aiEnabled && (
            <div
              className={`mt-4 rounded-xl border border-red-500/15 bg-red-500/8 px-3.5 py-3 text-xs leading-5 text-red-300 sm:text-sm ${textAlignClassName}`}
            >
              {chatCopy.errorPrefix}
              {error}
            </div>
          )}

          {pendingAction && aiAutoSuggestions && aiEnabled && (
            <div
              className={`mt-4 rounded-xl border border-[var(--ai-pending-border)] bg-[var(--ai-pending-bg)] p-3.5 ${textAlignClassName}`}
            >
              <div className={`mb-3 flex items-center gap-2 ${rowClassName}`}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--ai-pending-icon-bg)] text-xs text-[var(--ai-pending-icon-text)]">
                  ✓
                </span>

                <p className="text-xs leading-5 text-[var(--foreground-soft)] sm:text-sm">
                  {chatCopy.pendingActionText}
                </p>
              </div>

              <button
                type="button"
                onClick={handleApplyAction}
                className="w-full rounded-xl border border-[var(--ai-send-border)] bg-[var(--ai-send-bg)] px-4 py-2.5 text-sm font-medium text-[var(--ai-send-text)] transition hover:bg-[var(--ai-send-hover-bg)] sm:w-auto"
              >
                {chatCopy.applyAction}
              </button>
            </div>
          )}
        </div>

        <div className="w-full">
          <PromptForm
            locale={locale}
            onSend={handleSend}
            isLoading={isLoading || !aiEnabled}
          />
        </div>
      </div>
    </section>
  );
}
