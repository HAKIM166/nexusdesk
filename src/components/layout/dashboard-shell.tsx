"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar");
  const contentDir = isRTL ? "rtl" : "ltr";

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
              ? "mr-[252px] flex min-h-screen min-w-0 flex-col"
              : "ml-[252px] flex min-h-screen min-w-0 flex-col"
          }
          dir={contentDir}
        >
          <Topbar />

          <main className="flex-1 px-5 pt-5 pb-0 md:px-7 md:pt-6 md:pb-0 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
