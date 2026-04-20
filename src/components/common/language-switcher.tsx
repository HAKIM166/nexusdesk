"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  function toggleLanguage() {
    if (!pathname) return;

    const segments = pathname.split("/");
    const currentLocale = segments[1];

    const newLocale = currentLocale === "en" ? "ar" : "en";
    segments[1] = newLocale;

    const newPath = segments.join("/");

    router.push(newPath);
  }

  return (
    <button onClick={toggleLanguage} className="btn-secondary text-sm">
      EN
    </button>
  );
}