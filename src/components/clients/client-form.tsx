"use client";

import { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Plus, ImageIcon } from "lucide-react";

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

type Area = {
  width: number;
  height: number;
  x: number;
  y: number;
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
  const [avatarUrl, setAvatarUrl] = useState(selectedClient?.avatarUrl ?? "");

  const [toast, setToast] = useState<string | null>(null);

  const [cropModal, setCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  const resetForm = () => {
    setName("");
    setCompany("");
    setEmail("");
    setAvatarUrl("");
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(String(reader.result));
      setCropModal(true);
    };

    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();

      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));

      image.src = url;
    });

  const getCroppedImg = async () => {
    if (!croppedAreaPixels) return;

    const image = await createImage(imageSrc);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
    );

    const base64 = canvas.toDataURL("image/jpeg");

    setAvatarUrl(base64);
    setCropModal(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !company.trim() || !email.trim()) return;

    if (selectedClient) {
      updateClient(selectedClient.id, {
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        avatarUrl,
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
      avatarUrl,
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
    <div className="space-y-3 md:space-y-5">
      {toast && (
        <div
          className={`fixed bottom-5 z-50 rounded-lg bg-black/80 px-4 py-2 text-sm text-white shadow-lg animate-fade-in ${
            isArabic ? "left-5" : "right-5"
          }`}
        >
          {toast}
        </div>
      )}

      {cropModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 md:p-5">
          <div className="w-full max-w-xl rounded-xl border border-white/10 bg-[var(--surface)] p-3 md:rounded-2xl md:p-5">
            <div className="relative h-[280px] w-full overflow-hidden rounded-lg md:h-[420px] md:rounded-xl">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="mt-3 space-y-3 md:mt-5 md:space-y-4">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />

              <div className="flex items-center justify-end gap-2.5 md:gap-3">
                <button
                  type="button"
                  onClick={() => setCropModal(false)}
                  className="rounded-lg border border-white/10 px-3.5 py-2 text-[13px] md:rounded-xl md:px-4 md:text-sm"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>

                <button
                  type="button"
                  onClick={getCroppedImg}
                  className="rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-black md:rounded-xl md:px-5 md:text-sm"
                >
                  {isArabic ? "حفظ الصورة" : "Save Avatar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
        <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-[auto_1fr_1fr_1fr] xl:items-center">
          <div
            className={`flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-2.5 md:col-span-2 xl:col-span-1 xl:border-0 xl:bg-transparent xl:p-0 ${
              isArabic ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[var(--surface-muted)] text-sm font-semibold text-primary md:h-14 md:w-14 md:rounded-full">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name || "Client"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon size={18} />
              )}
            </div>

            <label className="cursor-pointer rounded-lg border border-white/10 bg-[var(--surface-muted)] px-3 py-2 text-[12px] font-medium transition-colors duration-200 hover:border-white/20 md:rounded-xl md:px-4 md:py-3 md:text-sm">
              {isArabic ? "اختيار صورة" : "Choose Avatar"}

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <input
            type="text"
            placeholder={messages.clients.form.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`input-base min-w-0 text-[13px] md:text-sm ${
              isArabic ? "text-right" : "text-left"
            }`}
          />

          <input
            type="text"
            placeholder={messages.clients.form.company}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={`input-base min-w-0 text-[13px] md:text-sm ${
              isArabic ? "text-right" : "text-left"
            }`}
          />

          <input
            type="email"
            placeholder={messages.clients.form.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`input-base min-w-0 text-[13px] md:col-span-2 md:text-sm xl:col-span-1 ${
              isArabic ? "text-right" : "text-left"
            }`}
          />
        </div>

        <div
          className={`flex flex-col gap-2.5 sm:flex-row md:gap-3 ${
            isArabic ? "sm:justify-end" : "sm:justify-start"
          }`}
        >
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-black transition-opacity duration-200 hover:opacity-90 sm:w-auto md:rounded-xl md:py-3 md:text-sm"
          >
            <Plus size={16} />

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
              className="w-full rounded-lg border border-white/10 px-5 py-2.5 text-[13px] transition-colors duration-200 hover:bg-white/5 sm:w-auto md:rounded-xl md:py-3 md:text-sm"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}