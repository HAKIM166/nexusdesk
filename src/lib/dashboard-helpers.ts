type Client = Record<string, unknown>;
type Project = Record<string, unknown>;

type StatusKey = "active" | "pending" | "completed" | "inactive" | "unknown";

function safeDate(value?: string | Date) {
  if (!value) return 0;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function safeNumber(value: unknown) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function normalizeText(value?: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function normalizeProjectStatus(status?: string): StatusKey {
  const normalizedStatus = normalizeText(status);

  if (
    [
      "active",
      "in progress",
      "in-progress",
      "in_progress",
      "ongoing",
      "running",
      "planned",
    ].includes(normalizedStatus)
  ) {
    return "active";
  }

  if (
    ["pending", "on hold", "on-hold", "on_hold", "waiting", "paused"].includes(
      normalizedStatus
    )
  ) {
    return "pending";
  }

  if (
    ["completed", "complete", "done", "finished", "closed"].includes(
      normalizedStatus
    )
  ) {
    return "completed";
  }

  if (
    ["inactive", "cancelled", "canceled", "archived", "stopped"].includes(
      normalizedStatus
    )
  ) {
    return "inactive";
  }

  return "unknown";
}

function normalizeClientStatus(
  status?: string
): "active" | "inactive" | "pending" | "unknown" {
  const normalizedStatus = normalizeText(status);

  if (["active", "available"].includes(normalizedStatus)) {
    return "active";
  }

  if (["inactive", "archived", "disabled"].includes(normalizedStatus)) {
    return "inactive";
  }

  if (["pending", "waiting"].includes(normalizedStatus)) {
    return "pending";
  }

  return "unknown";
}

export function getDashboardMetrics(clients: Client[], projects: Project[]) {
  const totalClients = clients.length;
  const totalProjects = projects.length;

  const activeClients = clients.filter(
    (client) =>
      normalizeClientStatus(client.status as string | undefined) === "active"
  ).length;

  const activeProjects = projects.filter(
    (project) =>
      normalizeProjectStatus(project.status as string | undefined) === "active"
  ).length;

  const pendingProjects = projects.filter(
    (project) =>
      normalizeProjectStatus(project.status as string | undefined) === "pending"
  ).length;

  const completedProjects = projects.filter(
    (project) =>
      normalizeProjectStatus(project.status as string | undefined) ===
      "completed"
  ).length;

  const inactiveProjects = projects.filter(
    (project) =>
      normalizeProjectStatus(project.status as string | undefined) ===
      "inactive"
  ).length;

  const unknownProjects = projects.filter(
    (project) =>
      normalizeProjectStatus(project.status as string | undefined) === "unknown"
  ).length;

  const totalRevenue = projects.reduce((sum, project) => {
    return sum + safeNumber(project.paidAmount);
  }, 0);

  const totalPipeline = projects.reduce((sum, project) => {
    return sum + safeNumber(project.budget);
  }, 0);

  const remainingRevenue = Math.max(totalPipeline - totalRevenue, 0);

  const revenueCollectionRate =
    totalPipeline === 0
      ? 0
      : Math.round((totalRevenue / totalPipeline) * 100);

  const completionRate =
    totalProjects === 0
      ? 0
      : Math.round((completedProjects / totalProjects) * 100);

  const recentClients = [...clients]
    .sort((a, b) => {
      const aDate = safeDate(a.createdAt as string | Date | undefined);
      const bDate = safeDate(b.createdAt as string | Date | undefined);

      return bDate - aDate;
    })
    .slice(0, 5);

  const recentProjects = [...projects]
    .sort((a, b) => {
      const aDate = safeDate(a.createdAt as string | Date | undefined);
      const bDate = safeDate(b.createdAt as string | Date | undefined);

      return bDate - aDate;
    })
    .slice(0, 5);

  const statusDistribution = [
    { name: "Active", value: activeProjects },
    { name: "Pending", value: pendingProjects },
    { name: "Completed", value: completedProjects },
    { name: "Inactive", value: inactiveProjects },
    { name: "Unknown", value: unknownProjects },
  ];

  const revenueDistribution = [
    { name: "Collected", value: totalRevenue },
    { name: "Remaining", value: remainingRevenue },
  ];

  return {
    totalClients,
    totalProjects,
    activeClients,
    activeProjects,
    pendingProjects,
    completedProjects,
    inactiveProjects,
    unknownProjects,
    completionRate,
    totalRevenue,
    totalPipeline,
    remainingRevenue,
    revenueCollectionRate,
    recentClients,
    recentProjects,
    statusDistribution,
    revenueDistribution,
  };
}

export function getDashboardSmartSummary(clients: Client[], projects: Project[]) {
  const metrics = getDashboardMetrics(clients, projects);

  if (metrics.totalProjects === 0 && metrics.totalClients === 0) {
    return "Start by adding your first client and project to unlock real insights.";
  }

  if (metrics.totalPipeline > 0 && metrics.revenueCollectionRate < 40) {
    return "Revenue collection is still low compared to your total project pipeline. Follow up on unpaid amounts.";
  }

  if (metrics.pendingProjects > metrics.completedProjects) {
    return "You have more pending work than completed work. Prioritize follow-ups and unblock delayed projects.";
  }

  if (metrics.activeProjects >= 3) {
    return "Your workspace is active right now. Keep an eye on workload balance and project deadlines.";
  }

  if (metrics.completedProjects > 0 && metrics.completionRate >= 50) {
    return "Great momentum. More than half of your projects are completed.";
  }

  return "Your workspace is healthy. Add more tracked activity to get deeper insights.";
}