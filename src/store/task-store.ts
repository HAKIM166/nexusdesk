"use client";

import { create } from "zustand";
import { tasks as initialTasks } from "@/data/tasks";
import { Task, TaskStatus } from "@/types/task";
import { useNotificationStore } from "./notification-store";

type NewTaskInput = {
  title: string;
  description: string;
  projectId?: string;
  projectName?: string;
  clientName?: string;
  dueDate?: string;
  priority?: Task["priority"];
};

type TaskStore = {
  tasks: Task[];
  addTask: (task: NewTaskInput) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: initialTasks,

  addTask: (task) =>
    set((state) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: task.title,
        description: task.description || "No description added yet.",
        status: "backlog",
        priority: task.priority ?? "medium",
        clientName: task.clientName ?? "NexusDesk",
        projectName: task.projectName ?? "General Tasks",
        projectId: task.projectId ?? "general",
        dueDate: task.dueDate ?? "2026-05-10",
      };

      useNotificationStore.getState().addNotification({
        type: "task",
        title: "Task added",
        description: `${task.title} added to backlog`,
      });

      return {
        tasks: [newTask, ...state.tasks],
      };
    }),

  deleteTask: (id) =>
    set((state) => {
      const deletedTask = state.tasks.find((task) => task.id === id);

      if (deletedTask) {
        useNotificationStore.getState().addNotification({
          type: "task",
          title: "Task deleted",
          description: `${deletedTask.title} removed from tasks`,
        });
      }

      return {
        tasks: state.tasks.filter((task) => task.id !== id),
      };
    }),

  updateTaskStatus: (id, status) =>
    set((state) => {
      const currentTask = state.tasks.find((task) => task.id === id);

      if (currentTask && currentTask.status !== status) {
        useNotificationStore.getState().addNotification({
          type: "task",
          title: "Task moved",
          description: `${currentTask.title} moved to ${status}`,
        });
      }

      return {
        tasks: state.tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                status,
              }
            : task,
        ),
      };
    }),

  getTasksByStatus: (status) => {
    return get().tasks.filter((task) => task.status === status);
  },
}));