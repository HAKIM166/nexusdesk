"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { getDashboardMetrics } from "@/lib/dashboard-helpers";
import { getMessages } from "@/lib/helpers";
import { Locale } from "@/lib/constants";
import { useClientStore } from "@/store/client-store";
import { useProjectStore } from "@/store/project-store";

import QuickActionsSection from "./quick-actions-section";
import RecentListsSection from "./recent-lists-section";
import PricingSection from "./pricing-section";
import TestimonialsSection from "./testimonials-section";
import DashboardFooter from "./dashboard-footer";

/* =========================
   TYPES
   ========================= */

type ClientItem = {
  id?: string;
  name?: string;
  email?: string;
};

type ProjectItem = {
  id?: string;
  name?: string;
  title?: string;
  status?: string;
};

/* =========================
   DASHBOARD DETAILS COMPONENT
   ========================= */

export default function DashboardDetails() {
  /* =========================
     ROUTE / LANGUAGE
     ========================= */

  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  /* =========================
     STORES DATA
     ========================= */

  const clients = useClientStore((state) => state.clients);
  const projects = useProjectStore((state) => state.projects);

  /* =========================
     DASHBOARD METRICS
     ========================= */

  const metrics = useMemo(
    () => getDashboardMetrics(clients, projects),
    [clients, projects],
  );

  const recentClients = metrics.recentClients as ClientItem[];
  const recentProjects = metrics.recentProjects as ProjectItem[];

  return (
    <div className="space-y-6">
      {/* =========================
   QUICK ACTIONS CARDS SECTION
   - Two small cards on top
   - One wide card under them
   - No slider / no state
   - Links and logic stay the same
   ========================= */}

      <QuickActionsSection locale={locale} isArabic={isArabic} />
      {/* =========================
   RECENT CLIENTS / RECENT PROJECTS GRID
   ========================= */}

      <RecentListsSection
        messages={messages}
        recentClients={recentClients}
        recentProjects={recentProjects}
      />

      {/* =========================
   PLANS / WORKSPACE PACKAGES SECTION
   ========================= */}

      <PricingSection isArabic={isArabic} />

      {/* =========================
   TESTIMONIALS SECTION
   ========================= */}

      <TestimonialsSection isArabic={isArabic} />
      {/* =========================
   FOOTER SECTION
   ========================= */}

      <DashboardFooter isArabic={isArabic} />
    </div>
  );
}
