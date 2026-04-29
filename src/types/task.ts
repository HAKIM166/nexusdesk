export type TaskStatus = "backlog" | "in-progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  clientName: string;
  projectName: string;
  projectId: string;
  dueDate: string;
};