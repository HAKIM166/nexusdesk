"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { useClientStore } from "@/store/client-store";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import type { Client } from "@/types";

type ClientTableProps = {
  locale: Locale;
};

export default function ClientTable({ locale }: ClientTableProps) {
  const {
    clients,
    deleteClient,
    setSelectedClient,
    initializeClients,
    isLoading,
    error,
  } = useClientStore();

  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  const [toast, setToast] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    setToast(message);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  useEffect(() => {
    initializeClients();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [initializeClients]);

  const handleDelete = async (id: string) => {
    await deleteClient(id);
    showToast(isArabic ? "تم حذف العميل" : "Client deleted");
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
  };

  if (isLoading) {
    return (
      <div
        className={`flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-3 text-[13px] text-[var(--foreground-muted)] md:gap-3 md:px-4 md:py-4 md:text-sm ${
          isArabic ? "justify-end text-right" : "justify-start text-left"
        }`}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{isArabic ? "جاري تحميل العملاء..." : "Loading clients..."}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-3 text-[13px] text-red-400 md:px-4 md:py-4 md:text-sm ${
          isArabic ? "text-right" : "text-left"
        }`}
      >
        {error}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div
        className={`rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-3 text-[13px] text-[var(--foreground-muted)] md:px-4 md:py-4 md:text-sm ${
          isArabic ? "text-right" : "text-left"
        }`}
      >
        {messages.dashboard.noClients}
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div
          className={`fixed bottom-5 z-50 rounded-lg bg-black/80 px-4 py-2 text-sm text-white shadow-lg animate-fade-in ${
            isArabic ? "left-5" : "right-5"
          }`}
        >
          {toast}
        </div>
      )}

      {/* Mobile / Tablet Cards */}
      <div className="sidebar-scroll max-h-[430px] space-y-2.5 overflow-y-auto pr-1 lg:hidden">
        {clients.map((client) => (
          <div
            key={client.id}
            className={`rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-2.5 md:p-3 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`flex items-start gap-2.5 md:gap-3 ${
                isArabic ? "flex-row-reverse" : ""
              }`}
            >
              {client.avatarUrl ? (
                <img
                  src={client.avatarUrl}
                  alt={client.name}
                  className="h-10 w-10 shrink-0 rounded-lg border border-white/10 object-cover md:h-11 md:w-11 md:rounded-xl"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-[13px] font-semibold text-cyan-400 md:h-11 md:w-11 md:rounded-xl md:text-sm">
                  {client.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <Link
                  href={`/${locale}/clients/${client.id}`}
                  className="block truncate text-[14px] font-semibold text-[var(--foreground)] transition hover:underline md:text-[15px]"
                >
                  {client.name}
                </Link>

                <p className="mt-0.5 truncate text-[12px] text-[var(--foreground-muted)] md:mt-1 md:text-[13px]">
                  {client.company}
                </p>

                <p className="mt-0.5 truncate text-[11px] text-[var(--foreground-soft)] md:mt-1 md:text-[12px]">
                  {client.email}
                </p>
              </div>
            </div>

            <div
              className={`mt-2.5 flex gap-2 md:mt-3 ${
                isArabic ? "justify-end" : "justify-start"
              }`}
            >
              <button
                type="button"
                onClick={() => handleEdit(client)}
                className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--foreground)] transition hover:bg-white/10 md:px-3 md:py-2 md:text-xs"
              >
                {messages.clients.edit}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(client.id)}
                className="inline-flex items-center justify-center rounded-lg border border-red-500/30 px-2.5 py-1.5 text-[11px] font-medium text-red-400 transition hover:bg-red-500/10 md:px-3 md:py-2 md:text-xs"
              >
                {messages.clients.delete}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block">
        <table
          dir={isArabic ? "rtl" : "ltr"}
          className="w-full table-fixed text-sm"
        >
          <colgroup>
            <col className="w-[32%]" />
            <col className="w-[18%]" />
            <col className="w-[30%]" />
            <col className="w-[20%]" />
          </colgroup>

          <thead className="text-[var(--foreground-muted)]">
            <tr className="border-b border-white/10">
              <th
                className={`px-2 py-3 font-medium ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {messages.clientsTable.name}
              </th>

              <th
                className={`px-2 py-3 font-medium ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {messages.clientsTable.company}
              </th>

              <th
                className={`px-2 py-3 font-medium ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                {messages.clientsTable.email}
              </th>

              <th className="px-2 py-3 text-center font-medium">
                {messages.clients.actions}
              </th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-white/5 transition hover:bg-white/5"
              >
                <td className="px-2 py-3">
                  <div
                    className={`flex items-center gap-3 ${
                      isArabic ? "justify-start" : "justify-start"
                    }`}
                  >
                    {client.avatarUrl ? (
                      <img
                        src={client.avatarUrl}
                        alt={client.name}
                        className="h-10 w-10 shrink-0 rounded-full border border-white/10 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-secondary)] text-sm font-semibold text-cyan-400">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <Link
                      href={`/${locale}/clients/${client.id}`}
                      className="min-w-0 truncate font-medium text-[var(--foreground)] transition hover:underline"
                    >
                      {client.name}
                    </Link>
                  </div>
                </td>

                <td
                  className={`px-2 py-3 text-[var(--foreground)] ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  <span className="block truncate">{client.company}</span>
                </td>

                <td
                  dir="ltr"
                  className={`px-2 py-3 text-[var(--foreground)] ${
                    isArabic ? "text-right" : "text-left"
                  }`}
                >
                  <span className="block truncate">{client.email}</span>
                </td>

                <td className="px-2 py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(client)}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs text-[var(--foreground)] transition hover:bg-white/10"
                    >
                      {messages.clients.edit}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(client.id)}
                      className="rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
                    >
                      {messages.clients.delete}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
