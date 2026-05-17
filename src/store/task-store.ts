"use client";

import { create } from "zustand";

import {
  createTask,
  deleteTaskById,
  getTasks,
  updateTaskStatusById,
} from "@/services/tasks.service";
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
  isLoading: boolean;
  error: string | null;

  initializeTasks: () => Promise<void>;
  addTask: (task: NewTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  getTasksByStatus: (status: TaskStatus) => Task[];
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  initializeTasks: async () => {
    set({ isLoading: true, error: null });

    try {
      const tasks = await getTasks();

      set({
        tasks,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load tasks.",
        isLoading: false,
      });
    }
  },

  addTask: async (task) => {
    set({ error: null });

    try {
      const newTask = await createTask({
        title: task.title,
        description: task.description || "No description added yet.",
        status: "backlog",
        priority: task.priority ?? "medium",
        clientName: task.clientName ?? "NexusDesk",
        projectName: task.projectName ?? "General Tasks",
        projectId: task.projectId ?? "general",
        dueDate: task.dueDate ?? "2026-05-10",
      });

      useNotificationStore.getState().addNotification({
        type: "task",
        title: "Task added",
        description: `${newTask.title} added to backlog`,
      });

      set((state) => ({
        tasks: [newTask, ...state.tasks],
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create task.",
      });
    }
  },

  deleteTask: async (id) => {
    set({ error: null });

    const deletedTask = get().tasks.find((task) => task.id === id);

    try {
      await deleteTaskById(id);

      if (deletedTask) {
        useNotificationStore.getState().addNotification({
          type: "task",
          title: "Task deleted",
          description: `${deletedTask.title} removed from tasks`,
        });
      }

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete task.",
      });
    }
  },

  updateTaskStatus: async (id, status) => {
    set({ error: null });

    const currentTask = get().tasks.find((task) => task.id === id);

    try {
      const updatedTask = await updateTaskStatusById(id, status);

      if (currentTask && currentTask.status !== status) {
        useNotificationStore.getState().addNotification({
          type: "task",
          title: "Task moved",
          description: `${currentTask.title} moved to ${status}`,
        });
      }

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? updatedTask : task,
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update task status.",
      });
    }
  },

  getTasksByStatus: (status) => {
    return get().tasks.filter((task) => task.status === status);
  },
}));