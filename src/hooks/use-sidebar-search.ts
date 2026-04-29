import { useMemo } from "react";
import { Locale } from "@/lib/constants";

export type SidebarSearchResult = {
  id: string;
  type: "client" | "project";
  title: string;
  subtitle: string;
  href: string;
};

function getTextValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function useSidebarSearch(
  searchQuery: string,
  clients: unknown[],
  projects: unknown[],
  locale: Locale,
): SidebarSearchResult[] {
  return useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

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
          title: name || company || email || "Unnamed client",
          subtitle: company || email || "Client",
          href: `/${locale}/clients/${id}`,
          searchable: `${name} ${company} ${email}`.toLowerCase(),
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
          title: name || title || "Untitled project",
          subtitle: status || "Project",
          href: `/${locale}/projects/${id}`,
          searchable: `${name} ${title} ${status}`.toLowerCase(),
        };
      })
      .filter((project) => project.id && project.searchable.includes(query))
      .map(({ searchable, ...project }) => project);

    return [...clientResults, ...projectResults].slice(0, 6);
  }, [clients, projects, searchQuery, locale]);
}