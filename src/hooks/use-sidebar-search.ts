import { useMemo } from "react";
import { Locale } from "@/lib/constants";

export type SidebarSearchResult = {
  id: string;
  type: "client" | "project" | "employee";
  title: string;
  subtitle: string;
  href: string;
};

const EMPTY_SEARCH_SOURCE: unknown[] = [];

function getTextValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function getTextList(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is string => typeof item === "string");
}

function getFallbackLabels(locale: Locale) {
  const isArabic = locale === "ar";

  return {
    unnamedClient: isArabic ? "عميل بدون اسم" : "Unnamed client",
    client: isArabic ? "عميل" : "Client",
    untitledProject: isArabic ? "مشروع بدون عنوان" : "Untitled project",
    project: isArabic ? "مشروع" : "Project",
    unnamedEmployee: isArabic ? "موظف بدون اسم" : "Unnamed employee",
    employee: isArabic ? "موظف" : "Employee",
  };
}

export function useSidebarSearch(
  searchQuery: string,
  clients: unknown[],
  projects: unknown[],
  locale: Locale,
): SidebarSearchResult[];

export function useSidebarSearch(
  searchQuery: string,
  clients: unknown[],
  projects: unknown[],
  employees: unknown[],
  locale: Locale,
): SidebarSearchResult[];

export function useSidebarSearch(
  searchQuery: string,
  clients: unknown[],
  projects: unknown[],
  employeesOrLocale: unknown[] | Locale,
  locale?: Locale,
): SidebarSearchResult[] {
  const employees = Array.isArray(employeesOrLocale)
    ? employeesOrLocale
    : EMPTY_SEARCH_SOURCE;

  const activeLocale = Array.isArray(employeesOrLocale)
    ? locale
    : employeesOrLocale;

  return useMemo(() => {
    if (!activeLocale) {
      return [];
    }

    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    const labels = getFallbackLabels(activeLocale);

    const clientResults = clients
      .map((client) => {
        const clientRecord = client as Record<string, unknown>;

        const id = getTextValue(clientRecord["id"]);
        const name = getTextValue(clientRecord["name"]);
        const company = getTextValue(clientRecord["company"]);
        const email = getTextValue(clientRecord["email"]);

        return {
          id,
          type: "client" as const,
          title: name || company || email || labels.unnamedClient,
          subtitle: company || email || labels.client,
          href: `/${activeLocale}/clients/${id}`,
          searchable: `${id} ${name} ${company} ${email}`.toLowerCase(),
        };
      })
      .filter((client) => client.id && client.searchable.includes(query))
      .map(({ searchable, ...client }) => client);

    const projectResults = projects
      .map((project) => {
        const projectRecord = project as Record<string, unknown>;

        const id = getTextValue(projectRecord["id"]);
        const name = getTextValue(projectRecord["name"]);
        const title = getTextValue(projectRecord["title"]);
        const status = getTextValue(projectRecord["status"]);

        return {
          id,
          type: "project" as const,
          title: name || title || labels.untitledProject,
          subtitle: status || labels.project,
          href: `/${activeLocale}/projects/${id}`,
          searchable: `${id} ${name} ${title} ${status}`.toLowerCase(),
        };
      })
      .filter((project) => project.id && project.searchable.includes(query))
      .map(({ searchable, ...project }) => project);

    const employeeResults = employees
      .map((employee) => {
        const employeeRecord = employee as Record<string, unknown>;

        const id = getTextValue(employeeRecord["id"]);
        const name = getTextValue(employeeRecord["name"]);
        const role = getTextValue(employeeRecord["role"]);
        const department = getTextValue(employeeRecord["department"]);
        const email = getTextValue(employeeRecord["email"]);
        const status = getTextValue(employeeRecord["status"]);
        const phone = getTextValue(employeeRecord["phone"]);
        const location = getTextValue(employeeRecord["location"]);
        const employmentType = getTextValue(employeeRecord["employmentType"]);
        const skills = getTextList(employeeRecord["skills"]);

        const subtitle =
          [role, department].filter(Boolean).join(" · ") ||
          email ||
          labels.employee;

        return {
          id,
          type: "employee" as const,
          title: name || email || labels.unnamedEmployee,
          subtitle,
          href: `/${activeLocale}/employees/${id}`,
          searchable: [
            id,
            name,
            role,
            department,
            email,
            status,
            phone,
            location,
            employmentType,
            ...skills,
          ]
            .join(" ")
            .toLowerCase(),
        };
      })
      .filter((employee) => employee.id && employee.searchable.includes(query))
      .map(({ searchable, ...employee }) => employee);

    return [...clientResults, ...projectResults, ...employeeResults].slice(0, 6);
  }, [clients, projects, employees, searchQuery, activeLocale]);
}