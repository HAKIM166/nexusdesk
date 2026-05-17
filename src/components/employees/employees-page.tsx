"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Mail, UserRoundCheck, UsersRound } from "lucide-react";

import EmployeeDepartments from "@/components/employees/employee-departments";
import EmployeeFormModal from "@/components/employees/employee-form-modal";
import EmployeeHero from "@/components/employees/employee-hero";
import EmployeeStats from "@/components/employees/employee-stats";
import EmployeeTable from "@/components/employees/employee-table";
import { getEmployeeDepartmentLabel } from "@/data/employee-options";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";
import { useEmployeeStore } from "@/store/employee-store";
import { useNotificationStore } from "@/store/notification-store";
import { Employee, EmployeeStatus } from "@/types/employee";

type EmployeesPageProps = {
  locale: Locale;
};

type EmployeeFormData = Omit<Employee, "id">;

function getDepartmentSummary(employees: Employee[]) {
  const departments = employees.reduce<Record<string, number>>(
    (acc, employee) => {
      acc[employee.department] = (acc[employee.department] || 0) + 1;
      return acc;
    },
    {},
  );

  return Object.entries(departments)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
}

function formatMessage(
  template: string,
  values: Record<string, string | number>,
) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, String(value)),
    template,
  );
}

function translateStatus(
  status: EmployeeStatus,
  messages: ReturnType<typeof getMessages>,
) {
  return messages.common.status[status] || status;
}

export default function EmployeesPage({ locale }: EmployeesPageProps) {
  const router = useRouter();
  const messages = getMessages(locale);
  const isArabic = locale === "ar";
  const employeePageMessages = messages.employees.page;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const employees = useEmployeeStore((state) => state.employees);
  const initializeEmployees = useEmployeeStore(
    (state) => state.initializeEmployees,
  );
  const isLoading = useEmployeeStore((state) => state.isLoading);
  const addEmployee = useEmployeeStore((state) => state.addEmployee);
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee);
  const deleteEmployee = useEmployeeStore((state) => state.deleteEmployee);
  const updateEmployeeStatus = useEmployeeStore(
    (state) => state.updateEmployeeStatus,
  );

  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  useEffect(() => {
    initializeEmployees();
  }, [initializeEmployees]);

  const employeeInsights = useMemo(() => {
    const activeEmployees = employees.filter(
      (employee) => employee.status === "Active",
    ).length;

    const pendingInvites = employees.filter(
      (employee) => employee.status === "Pending",
    ).length;

    const inactiveEmployees = employees.filter(
      (employee) => employee.status === "Inactive",
    ).length;

    const departmentSummary = getDepartmentSummary(employees);
    const departmentsCount = departmentSummary.length;

    const activeRate =
      employees.length > 0
        ? Math.round((activeEmployees / employees.length) * 100)
        : 0;

    return {
      activeEmployees,
      pendingInvites,
      inactiveEmployees,
      departmentSummary,
      departmentsCount,
      activeRate,
    };
  }, [employees]);

  const departmentLocale = isArabic ? "ar" : "en";

  const localizedDepartmentSummary = employeeInsights.departmentSummary.map(
    ([department, count]) =>
      [getEmployeeDepartmentLabel(department, departmentLocale), count] as [
        string,
        number,
      ],
  );

  const stats = [
    {
      key: "total" as const,
      label: messages.employees.stats.total,
      value: employees.length,
      icon: UsersRound,
      description: employeePageMessages.statsDescriptions.total,
    },
    {
      key: "active" as const,
      label: messages.employees.stats.active,
      value: employeeInsights.activeEmployees,
      icon: UserRoundCheck,
      description: employeePageMessages.statsDescriptions.active,
    },
    {
      key: "departments" as const,
      label: messages.employees.stats.departments,
      value: employeeInsights.departmentsCount,
      icon: Building2,
      description: employeePageMessages.statsDescriptions.departments,
    },
    {
      key: "pending" as const,
      label: messages.employees.stats.pending,
      value: employeeInsights.pendingInvites,
      icon: Mail,
      description: employeePageMessages.statsDescriptions.pending,
    },
  ];

  const handleOpenAddForm = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEmployee(null);
  };

  const handleSubmitEmployee = async (employee: EmployeeFormData) => {
    if (selectedEmployee) {
      await updateEmployee(selectedEmployee.id, employee);

      addNotification({
        type: "employee",
        title: employeePageMessages.notifications.updatedTitle,
        description: formatMessage(
          employeePageMessages.notifications.updatedDescription,
          {
            name: employee.name,
            department: employee.department,
          },
        ),
      });

      handleCloseForm();
      return;
    }

    await addEmployee(employee);

    addNotification({
      type: "employee",
      title: employeePageMessages.notifications.addedTitle,
      description: formatMessage(
        employeePageMessages.notifications.addedDescription,
        {
          name: employee.name,
          department: employee.department,
        },
      ),
    });

    handleCloseForm();
  };

  const handleViewEmployee = (employeeId: string) => {
    router.push(`/${locale}/employees/${employeeId}`);
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    const shouldDelete = window.confirm(
      formatMessage(employeePageMessages.confirmDelete, {
        name: employee.name,
      }),
    );

    if (!shouldDelete) return;

    await deleteEmployee(employee.id);

    addNotification({
      type: "employee",
      title: employeePageMessages.notifications.deletedTitle,
      description: formatMessage(
        employeePageMessages.notifications.deletedDescription,
        {
          name: employee.name,
          department: employee.department,
        },
      ),
    });
  };

  const handleStatusChange = async (
    employeeId: string,
    nextStatus: EmployeeStatus,
  ) => {
    const employee = employees.find((item) => item.id === employeeId);

    await updateEmployeeStatus(employeeId, nextStatus);

    if (!employee) return;

    addNotification({
      type: "employee",
      title: employeePageMessages.notifications.statusUpdatedTitle,
      description: formatMessage(
        employeePageMessages.notifications.statusUpdatedDescription,
        {
          name: employee.name,
          status: translateStatus(nextStatus, messages),
        },
      ),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <section className="space-y-4 pb-8 md:space-y-6 md:pb-0">
        <EmployeeHero
          messages={messages}
          isArabic={isArabic}
          activeRate={employeeInsights.activeRate}
          activeEmployees={employeeInsights.activeEmployees}
          pendingInvites={employeeInsights.pendingInvites}
          inactiveEmployees={employeeInsights.inactiveEmployees}
          onAddClick={handleOpenAddForm}
        />

        <div className="grid gap-3 md:gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <EmployeeStats stats={stats} />

          <EmployeeDepartments
            title={messages.employees.stats.departments}
            subtitle={messages.employees.departments.subtitle}
            departmentSummary={localizedDepartmentSummary}
          />
        </div>

        <EmployeeTable
          employees={employees}
          messages={messages}
          isArabic={isArabic}
          locale={locale}
          onViewEmployee={handleViewEmployee}
          onEditEmployee={handleOpenEditForm}
          onDeleteEmployee={handleDeleteEmployee}
          onStatusChange={handleStatusChange}
        />
      </section>

      <EmployeeFormModal
        isOpen={isFormOpen}
        messages={messages}
        employee={selectedEmployee}
        existingEmployees={employees}
        onClose={handleCloseForm}
        onSubmit={handleSubmitEmployee}
      />
    </>
  );
}