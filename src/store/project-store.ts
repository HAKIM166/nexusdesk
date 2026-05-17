"use client";

import { create } from "zustand";
import { useNotificationStore } from "./notification-store";
import {
  createProject,
  deleteProjectById,
  getProjects,
  updateProjectById,
  updateProjectStatusById,
} from "@/services/projects.service";

export type ProjectStatus = "Planned" | "In Progress" | "Completed" | "On Hold";

export type Project = {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: ProjectStatus;
  deadline: string;
  budget: number;
  paidAmount: number;
};

type ProjectStore = {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;

  initializeProjects: () => Promise<void>;
  setSelectedProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, "id">) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (id: string, updatedProject: Omit<Project, "id">) => Promise<void>;
  updateProjectStatus: (id: string, status: ProjectStatus) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  getProjectsByClientId: (clientId: string) => Project[];
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  initializeProjects: async () => {
    set({ isLoading: true, error: null });

    try {
      const projects = await getProjects();
      set({ projects, isLoading: false, error: null });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load projects.",
      });
    }
  },

  setSelectedProject: (project) => set({ selectedProject: project }),

  addProject: async (project) => {
    set({ error: null });

    try {
      const newProject = await createProject(project);

      set((state) => ({
        projects: [newProject, ...state.projects],
      }));

      useNotificationStore.getState().addNotification({
        type: "project",
        title: "Project created",
        description: `${project.title} added to workspace`,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create project.",
      });
    }
  },

  deleteProject: async (id) => {
    const deletedProject = get().projects.find((project) => project.id === id);

    set({ error: null });

    try {
      await deleteProjectById(id);

      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        selectedProject:
          state.selectedProject?.id === id ? null : state.selectedProject,
      }));

      if (deletedProject) {
        useNotificationStore.getState().addNotification({
          type: "project",
          title: "Project deleted",
          description: `${deletedProject.title} removed from workspace`,
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete project.",
      });
    }
  },

  updateProject: async (id, updatedProject) => {
    set({ error: null });

    try {
      const savedProject = await updateProjectById(id, updatedProject);

      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? savedProject : project,
        ),
        selectedProject:
          state.selectedProject?.id === id
            ? savedProject
            : state.selectedProject,
      }));

      useNotificationStore.getState().addNotification({
        type: "project",
        title: "Project updated",
        description: `${updatedProject.title} details updated`,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update project.",
      });
    }
  },

  updateProjectStatus: async (id, status) => {
    const currentProject = get().projects.find((project) => project.id === id);

    set({ error: null });

    try {
      const savedProject = await updateProjectStatusById(id, status);

      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? savedProject : project,
        ),
        selectedProject:
          state.selectedProject?.id === id
            ? savedProject
            : state.selectedProject,
      }));

      if (currentProject) {
        useNotificationStore.getState().addNotification({
          type: "project",
          title: "Project status updated",
          description: `${currentProject.title} status changed to ${status}`,
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update project status.",
      });
    }
  },

  getProjectById: (id) => {
    return get().projects.find((project) => project.id === id);
  },

  getProjectsByClientId: (clientId) => {
    return get().projects.filter((project) => project.clientId === clientId);
  },
}));