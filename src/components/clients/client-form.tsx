"use client";

import { useRef, useState } from "react";
import { useClientStore } from "@/store/client-store";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

type ClientFormProps = {
  locale: Locale;
};

type ClientFormInnerProps = {
  locale: Locale;
  formKey: string;
};

export default function ClientForm({ locale }: ClientFormProps) {
  const selectedClient = useClientStore((state) => state.selectedClient);

  return (
    <ClientFormInner
      key={selectedClient?.id ?? "new-client"}
      formKey={selectedClient?.id ?? "new-client"}
      locale={locale}
    />
  );
}

function ClientFormInner({ locale }: ClientFormInnerProps) {
  const addClient = useClientStore((state) => state.addClient);
  const updateClient = useClientStore((state) => state.updateClient);
  const selectedClient = useClientStore((state) => state.selectedClient);
  const setSelectedClient = useClientStore((state) => state.setSelectedClient);

  const [name, setName] = useState(selectedClient?.name ?? "");
  const [company, setCompany] = useState(selectedClient?.company ?? "");
  const [email, setEmail] = useState(selectedClient?.email ?? "");
  const [toast, setToast] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  const resetForm = () => {
    setName("");
    setCompany("");
    setEmail("");
  };

  const showToast = (message: string) => {
    setToast(message);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !company.trim() || !email.trim()) return;

    if (selectedClient) {
      updateClient(selectedClient.id, {
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        status: selectedClient.status,
      });

      setSelectedClient(null);
      showToast(isArabic ? "تم تحديث العميل" : "Client updated");
      return;
    }

    addClient({
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      status: "Active",
    });

    resetForm();
    showToast(isArabic ? "تمت إضافة العميل" : "Client added");
  };

  const handleCancelEdit = () => {
    setSelectedClient(null);
    resetForm();
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-lg bg-black/80 px-4 py-2 text-sm text-white shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder={messages.clients.form.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`input-base flex-1 ${
              isArabic ? "text-right" : "text-left"
            }`}
          />

          <input
            type="text"
            placeholder={messages.clients.form.company}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={`input-base flex-1 ${
              isArabic ? "text-right" : "text-left"
            }`}
          />

          <input
            type="email"
            placeholder={messages.clients.form.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`input-base flex-1 ${
              isArabic ? "text-right" : "text-left"
            }`}
          />
        </div>

        <div
          className={`flex gap-3 ${isArabic ? "justify-end" : "justify-start"}`}
        >
          <button type="submit" className="btn-primary px-6 py-2 text-sm">
            {selectedClient
              ? isArabic
                ? "تحديث العميل"
                : "Update Client"
              : messages.clients.form.button}
          </button>

          {selectedClient && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-lg border border-white/10 px-6 py-2 text-sm transition hover:bg-white/10"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}