import DashboardShell from "@/components/layout/dashboard-shell";
import CalendarPage from "@/components/calendar/calendar-page";

export default function CalendarRoute() {
  return (
    <DashboardShell>
      <CalendarPage />
    </DashboardShell>
  );
}