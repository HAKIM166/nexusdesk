import type { Locale } from "@/lib/constants";

import type { AuthCopy } from "./auth-types";

type MessagesWithAuth = {
  auth: AuthCopy;
};

export function getAuthCopy(
  _locale: Locale,
  messages: MessagesWithAuth,
): AuthCopy {
  return messages.auth;
}