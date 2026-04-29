export type ProjectStatus =
  | "Planned"
  | "In Progress"
  | "Completed"
  | "On Hold";

export type Project = {
  id: string;
  title: string;
  description?: string;
  clientId: string;
  status: ProjectStatus;
  deadline?: string;
};