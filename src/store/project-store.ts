"use client";

import { create } from "zustand";

export type ProjectStatus =
  | "Planned"
  | "In Progress"
  | "Completed"
  | "On Hold";

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
  setSelectedProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, "id">) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, updatedProject: Omit<Project, "id">) => void;
  updateProjectStatus: (id: string, status: ProjectStatus) => void;
  getProjectById: (id: string) => Project | undefined;
  getProjectsByClientId: (clientId: string) => Project[];
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [
    {
      id: "p1",
      title: "Website Redesign",
      description: "Redesign the company website for a modern user experience.",
      clientId: "c1",
      status: "In Progress",
      deadline: "2026-05-15",
      budget: 5000,
      paidAmount: 2500,
    },
    {
      id: "p2",
      title: "Brand Identity",
      description: "Create a new visual identity and branding assets.",
      clientId: "c2",
      status: "Planned",
      deadline: "2026-06-01",
      budget: 3000,
      paidAmount: 0,
    },
    {
      id: "p3",
      title: "CRM Dashboard",
      description: "Build a dashboard to manage leads, clients, and reports.",
      clientId: "c3",
      status: "Completed",
      deadline: "2026-04-10",
      budget: 8000,
      paidAmount: 8000,
    },
  ],

  selectedProject: null,

  setSelectedProject: (project) => set({ selectedProject: project }),

  addProject: (project) =>
    set((state) => ({
      projects: [
        {
          id: crypto.randomUUID(),
          ...project,
        },
        ...state.projects,
      ],
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      selectedProject:
        state.selectedProject?.id === id ? null : state.selectedProject,
    })),

  updateProject: (id, updatedProject) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? {
              ...project,
              ...updatedProject,
            }
          : project
      ),
      selectedProject:
        state.selectedProject?.id === id
          ? {
              ...state.selectedProject,
              ...updatedProject,
            }
          : state.selectedProject,
    })),

  updateProjectStatus: (id, status) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? {
              ...project,
              status,
            }
          : project
      ),
      selectedProject:
        state.selectedProject?.id === id
          ? {
              ...state.selectedProject,
              status,
            }
          : state.selectedProject,
    })),

  getProjectById: (id) => {
    return get().projects.find((project) => project.id === id);
  },

  getProjectsByClientId: (clientId) => {
    return get().projects.filter((project) => project.clientId === clientId);
  },
}));