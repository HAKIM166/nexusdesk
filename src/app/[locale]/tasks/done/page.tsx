import DashboardShell from "@/components/layout/dashboard-shell";
import TasksPage from "@/components/tasks/tasks-page";

export default function DonePage() {
  return (
    <DashboardShell>
      <TasksPage status="done" />
    </DashboardShell>
  );
}