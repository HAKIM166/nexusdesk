import { recentClients } from "@/data/dashboard";

export function getClients() {
  return recentClients;
}

export function getClientByEmail(email: string) {
  return recentClients.find((c) => c.email === email);
}