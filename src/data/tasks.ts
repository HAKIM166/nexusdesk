import { Task } from "@/types/task";

export const tasks: Task[] = [
  {
    id: "task-001",
    title: "Prepare dashboard analytics cards",
    description: "Add revenue, completion rate, and active project insights.",
    status: "backlog",
    priority: "high",
    clientName: "NexusDesk",
    projectName: "Dashboard UI",
    dueDate: "2026-05-02",
  },
  {
    id: "task-002",
    title: "Design calendar scheduler layout",
    description: "Create a clean scheduler section matching the SaaS UI style.",
    status: "backlog",
    priority: "medium",
    clientName: "NexusDesk",
    projectName: "Calendar",
    dueDate: "2026-05-04",
  },
  {
    id: "task-003",
    title: "Build tasks kanban board",
    description: "Create backlog, in progress, and done sections.",
    status: "in-progress",
    priority: "high",
    clientName: "NexusDesk",
    projectName: "Tasks",
    dueDate: "2026-05-01",
  },
  {
    id: "task-004",
    title: "Split dashboard details component",
    description: "Move dashboard sections into smaller organized files.",
    status: "done",
    priority: "medium",
    clientName: "NexusDesk",
    projectName: "Dashboard Cleanup",
    dueDate: "2026-04-28",
  },
];