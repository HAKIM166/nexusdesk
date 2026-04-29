import {
  SendAIMessagePayload,
  SendAIMessageResponse,
} from "@/types/ai";

export async function sendAIMessage(
  payload: SendAIMessagePayload
): Promise<SendAIMessageResponse> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = "AI request failed";

    try {
      const errorData = await res.json();
      errorMessage = errorData?.message || errorMessage;
    } catch {
      // ignore JSON parse errors and keep default message
    }

    throw new Error(errorMessage);
  }

  return (await res.json()) as SendAIMessageResponse;
}