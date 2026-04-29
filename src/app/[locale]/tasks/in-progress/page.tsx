import DashboardShell from "@/components/layout/dashboard-shell";
import TasksPage from "@/components/tasks/tasks-page";

export default function InProgressPage() {
  return (
    <DashboardShell>
      <TasksPage status="in-progress" />
    </DashboardShell>
  );
}