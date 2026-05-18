"use client";

import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";

import { Locale } from "@/lib/constants";
import { createSupabaseClient } from "@/lib/supabase/client";

type LogoutButtonProps = {
  locale: Locale;
  isArabic: boolean;
  className: string;
  iconOnly?: boolean;
};

export default function LogoutButton({
  locale,
  isArabic,
  className,
  iconOnly = false,
}: LogoutButtonProps) {
  const [supabase] = useState(() => createSupabaseClient());

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const label = isArabic ? "تسجيل الخروج" : "Logout";
  const loadingLabel = isArabic ? "جاري الخروج..." : "Logging out...";

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    await supabase.auth.signOut();

    window.location.replace(`/${locale}`);
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
      aria-label={label}
      title={label}
    >
      {isLoggingOut ? (
        <Loader2 size={iconOnly ? 16 : 15} className="animate-spin" />
      ) : (
        <LogOut size={iconOnly ? 16 : 15} />
      )}

      {!iconOnly ? <span>{isLoggingOut ? loadingLabel : label}</span> : null}
    </button>
  );
}