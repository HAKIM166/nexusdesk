import EmployeesPage from "@/components/employees/employees-page";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Locale } from "@/lib/constants";

type EmployeesRouteProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export default async function EmployeesRoute({ params }: EmployeesRouteProps) {
  const { locale } = await params;

  return (
    <DashboardShell>
      <EmployeesPage locale={locale} />
    </DashboardShell>
  );
}