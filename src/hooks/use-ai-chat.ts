"use client";

import { useState } from "react";
import { sendAIMessage } from "@/services/ai.service";
import {
  AIAction,
  AIClientContext,
  AIHistoryMessage,
  AIMessage,
  AIProjectContext,
  AIRequestMode,
  SendAIMessageResponse,
} from "@/types/ai";

function createMessage(role: AIMessage["role"], content: string): AIMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

type SendMessageContext = {
  mode?: AIRequestMode;
  clients?: AIClientContext[];
  projects?: AIProjectContext[];
  client?: AIClientContext;
  project?: AIProjectContext;
};

type SendMessageResult = {
  reply: string;
  action?: AIAction;
} | null;

function enrichProjectContext(project: AIProjectContext): AIProjectContext {
  const budget = Number(project.budget) || 0;
  const paidAmount = Number(project.paidAmount) || 0;
  const remainingAmount = Math.max(budget - paidAmount, 0);

  return {
    ...project,
    budget,
    paidAmount,
    remainingAmount,
  };
}

function getQuickReply(text: string): string | null {
  const normalized = text.trim().toLowerCase();

  const thanksWords = [
    "شكرا",
    "شكراً",
    "متشكر",
    "تسلم",
    "ميرسي",
    "thanks",
    "thank you",
    "thx",
  ];

  const greetingWords = [
    "مرحبا",
    "مرحباً",
    "اهلا",
    "أهلا",
    "السلام عليكم",
    "hello",
    "hi",
    "hey",
  ];

  const confirmWords = [
    "تمام",
    "اوكي",
    "أوكي",
    "ok",
    "okay",
    "done",
    "ماشي",
    "تمام كده",
  ];

  if (thanksWords.includes(normalized)) {
    return /[a-z]/i.test(normalized) ? "You're welcome." : "العفو.";
  }

  if (greetingWords.includes(normalized)) {
    return /[a-z]/i.test(normalized)
      ? "Hello! How can I help?"
      : "مرحبًا! أقدر أساعدك في إيه؟";
  }

  if (confirmWords.includes(normalized)) {
    return /[a-z]/i.test(normalized) ? "Great." : "تمام.";
  }

  return null;
}

export function useAIChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (
    text: string,
    context?: SendMessageContext
  ): Promise<SendMessageResult> => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return null;

    const userMessage = createMessage("user", trimmed);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setError(null);

    const quickReply = getQuickReply(trimmed);

    if (quickReply) {
      const assistantMessage = createMessage("assistant", quickReply);
      setMessages((prev) => [...prev, assistantMessage]);

      return {
        reply: quickReply,
      };
    }

    setIsLoading(true);

    try {
      const history: AIHistoryMessage[] = messages.slice(-4).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      const enrichedProject = context?.project
        ? enrichProjectContext(context.project)
        : undefined;

      const enrichedProjects = context?.projects
        ? context.projects.map((project) => enrichProjectContext(project))
        : undefined;

      const res: SendAIMessageResponse = await sendAIMessage({
        message: trimmed,
        mode: context?.mode ?? "general",
        clients: context?.clients,
        projects: enrichedProjects,
        client: context?.client,
        project: enrichedProject,
        history,
      });

      const aiMessage = createMessage("assistant", res.reply);
      setMessages((prev) => [...prev, aiMessage]);

      return {
        reply: res.reply,
        action: res.action,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";

      setError(msg);

      const errorMessage = createMessage("assistant", msg);
      setMessages((prev) => [...prev, errorMessage]);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetMessages = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetMessages,
  };
}