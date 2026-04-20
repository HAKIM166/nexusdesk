import ClientForm from "@/components/clients/client-form";
import ClientTable from "@/components/clients/client-table";
import DashboardShell from "@/components/layout/dashboard-shell";

export default function ClientsPage() {
  return (
    <DashboardShell>
      <div className="space-y-10">
        <div>
          <h1 className="section-title">Clients</h1>
          <p className="section-subtitle">
            Manage all your clients and their information.
          </p>
        </div>

        <ClientForm />

        <ClientTable />
      </div>
    </DashboardShell>
  );
}