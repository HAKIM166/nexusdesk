import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

type ProjectsTableProps = {
  locale: Locale;
};

const recentProjects = [
  {
    title: "Website Redesign",
    client: "Nile Tech",
    status: "In Progress",
    budget: "$4,500",
  },
  {
    title: "Mobile App",
    client: "Green Vision",
    status: "Pending",
    budget: "$8,200",
  },
  {
    title: "Dashboard System",
    client: "Orbit Labs",
    status: "Completed",
    budget: "$6,000",
  },
];

export default function ProjectsTable({ locale }: ProjectsTableProps) {
  const messages = getMessages(locale);
  const isArabic = locale === "ar";

  const statusMap = {
    en: {
      "In Progress": "In Progress",
      Pending: "Pending",
      Completed: "Completed",
    },
    ar: {
      "In Progress": "قيد التنفيذ",
      Pending: "قيد الانتظار",
      Completed: "مكتمل",
    },
  };

  return (
    <div className="panel overflow-hidden">
      <div
        className={`border-b border-[var(--border)] px-6 py-4 ${
          isArabic ? "text-right" : "text-left"
        }`}
      >
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          {messages.dashboard.projectsTableTitle}
        </h2>
        <p className="text-sm text-[var(--foreground-soft)]">
          {messages.dashboard.projectsTableSubtitle}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className={`w-full ${isArabic ? "text-right" : "text-left"}`}>
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-6 py-4 text-sm font-medium text-[var(--foreground-soft)]">
                {messages.projectsTable.project}
              </th>
              <th className="px-6 py-4 text-sm font-medium text-[var(--foreground-soft)]">
                {messages.projectsTable.client}
              </th>
              <th className="px-6 py-4 text-sm font-medium text-[var(--foreground-soft)]">
                {messages.projectsTable.status}
              </th>
              <th className="px-6 py-4 text-sm font-medium text-[var(--foreground-soft)]">
                {messages.projectsTable.budget}
              </th>
            </tr>
          </thead>

          <tbody>
            {recentProjects.map((project) => (
              <tr
                key={project.title}
                className="border-b border-[rgba(255,255,255,0.05)] transition hover:bg-[rgba(255,255,255,0.02)]"
              >
                <td className="px-6 py-4 text-[var(--foreground)]">
                  {project.title}
                </td>
                <td className="px-6 py-4 text-[var(--foreground-muted)]">
                  {project.client}
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--primary)]">
                    {
                      statusMap[locale][
                        project.status as keyof typeof statusMap.en
                      ]
                    }
                  </span>
                </td>
                <td className="px-6 py-4 text-[var(--foreground-muted)]">
                  {project.budget}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}