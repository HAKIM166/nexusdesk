"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import Sidebar from "./sidebar";
import Topbar from "./topbar";

import { createSupabaseClient } from "@/lib/supabase/client";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [supabase] = useState(() => createSupabaseClient());

  const isRTL = pathname?.startsWith("/ar");
  const contentDir = isRTL ? "rtl" : "ltr";
  const locale = pathname?.split("/")[1] === "ar" ? "ar" : "en";
  const allowedEmails = (process.env.NEXT_PUBLIC_ALLOWED_DASHBOARD_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const currentSection = pathname?.split("/")[2];

  const isPublicRoute =
    currentSection === "login" ||
    currentSection === "terms" ||
    currentSection === "privacy" ||
    currentSection === "documentation" ||
    currentSection === "reset-password";

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      if (isPublicRoute) {
        setIsCheckingAuth(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (!session) {
        router.replace(`/${locale}`);
        return;
      }

      const userEmail = session.user.email?.toLowerCase() || "";
      const isAllowedUser = allowedEmails.includes(userEmail);

      if (!isAllowedUser) {
        await supabase.auth.signOut();
        router.replace(`/${locale}`);
        return;
      }

      setIsCheckingAuth(false);
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted || isPublicRoute) return;

      if (!session) {
        router.replace(`/${locale}/login`);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isPublicRoute, locale, router, supabase]);

  if (isCheckingAuth) {
    return (
      <div
        dir={contentDir}
        className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)]"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 text-sm text-[var(--foreground-soft)] shadow-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>
            {isRTL ? "جاري التحقق من تسجيل الدخول..." : "Checking session..."}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="ltr"
      className="relative z-10 min-h-screen bg-[var(--background)] text-[var(--foreground)]"
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[var(--shell-glow)]"
        aria-hidden="true"
      />

      <div className="relative z-10" dir={contentDir}>
        <Sidebar />

        <div
          className={
            isRTL
              ? "flex min-h-screen min-w-0 flex-col md:mr-[252px]"
              : "flex min-h-screen min-w-0 flex-col md:ml-[252px]"
          }
          dir={contentDir}
        >
          <Topbar />

          <main className="flex-1 px-4 pt-4 pb-0 md:px-7 md:pt-6 md:pb-0 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
