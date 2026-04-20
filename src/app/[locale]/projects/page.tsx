import ProjectTable from "@/components/projects/project-table";
import DashboardShell from "@/components/layout/dashboard-shell";

export default function ProjectsPage() {
  return (
    <DashboardShell>
      <div className="space-y-10">
        <div>
          <h1 className="section-title">Projects</h1>
          <p className="section-subtitle">
            Track and manage all your active projects.
          </p>
        </div>

        <ProjectTable />
      </div>
    </DashboardShell>
  );
}