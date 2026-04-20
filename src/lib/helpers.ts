import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import { Locale } from "./constants";

const messages = {
  en,
  ar,
};

export function getMessages(locale: Locale) {
  return messages[locale] ?? messages.en;
}