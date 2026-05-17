import EmployeeDetailsPage from "@/components/employees/employee-details-page";
import DashboardShell from "@/components/layout/dashboard-shell";
import { Locale } from "@/lib/constants";

type EmployeeDetailsRouteProps = {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
};

export default async function EmployeeDetailsRoute({
  params,
}: EmployeeDetailsRouteProps) {
  const { locale, id } = await params;

  return (
    <DashboardShell>
      <EmployeeDetailsPage locale={locale} employeeId={id} />
    </DashboardShell>
  );
}