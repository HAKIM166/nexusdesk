"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

type DashboardShellProps = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const isRTL = pathname?.startsWith("/ar");

  return (
    <div className={`flex min-h-screen ${isRTL ? "flex-row-reverse" : ""}`}>
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-8 md:p-10">{children}</main>
      </div>
    </div>
  );
}