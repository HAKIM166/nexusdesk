import DashboardShell from "@/components/layout/dashboard-shell";
import TasksPage from "@/components/tasks/tasks-page";

export default function BacklogPage() {
  return (
    <DashboardShell>
      <TasksPage status="backlog" />
    </DashboardShell>
  );
}