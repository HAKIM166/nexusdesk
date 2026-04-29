"use client";

import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

type ProjectCardProps = {
  locale: Locale;
};

export default function ProjectCard({ locale }: ProjectCardProps) {
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  return (
    <div className="panel p-6">
      <div className={isArabic ? "text-right" : "text-left"}>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          {locale === "ar" ? "بطاقة المشروع" : "Project Card"}
        </h2>

        <p className="mt-2 text-sm text-[var(--foreground-soft)]">
          {locale === "ar"
            ? "سيتم إضافة بطاقة ملخص المشروع هنا لاحقًا."
            : "A project summary card will be added here later."}
        </p>
      </div>
    </div>
  );
}