"use client";

import { useClientStore } from "@/store/client-store";
import { Locale } from "@/lib/constants";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Client } from "@/types";

type ClientTableProps = {
  locale: Locale;
};

export default function ClientTable({ locale }: ClientTableProps) {
  const { clients, deleteClient, setSelectedClient } = useClientStore();
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
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleDelete = (id: string) => {
    deleteClient(id);
    showToast(isArabic ? "تم حذف العميل" : "Client deleted");
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
  };

  if (clients.length === 0) {
    return (
      <div
        className={`text-sm text-[var(--foreground-muted)] ${
          isArabic ? "text-right" : "text-left"
        }`}
      >
        {isArabic ? "لا يوجد عملاء حتى الآن" : "No clients yet"}
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-lg bg-black/80 px-4 py-2 text-sm text-white shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[var(--foreground-muted)]">
            <tr
              className={`border-b border-white/10 ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              <th className="py-3">{isArabic ? "الاسم" : "Name"}</th>
              <th className="py-3">{isArabic ? "الشركة" : "Company"}</th>
              <th className="py-3">{isArabic ? "البريد" : "Email"}</th>
              <th className="py-3">{isArabic ? "إجراءات" : "Actions"}</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className={`border-b border-white/5 transition hover:bg-white/5 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                <td className="py-3 font-medium">
                  <Link
                    href={`/${locale}/clients/${client.id}`}
                    className="transition hover:underline"
                  >
                    {client.name}
                  </Link>
                </td>

                <td className="py-3">{client.company}</td>
                <td className="py-3">{client.email}</td>

                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="rounded-lg border border-white/10 px-3 py-1 text-xs transition hover:bg-white/10"
                    >
                      {isArabic ? "تعديل" : "Edit"}
                    </button>

                    <button
                      onClick={() => handleDelete(client.id)}
                      className="rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-400 transition hover:bg-red-500/10"
                    >
                      {isArabic ? "حذف" : "Delete"}
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