"use client";

import { create } from "zustand";
import { useNotificationStore } from "./notification-store";

export type ClientStatus = "Active" | "Pending" | "Inactive";

export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: ClientStatus;
};

type ClientStore = {
  clients: Client[];
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  addClient: (client: Omit<Client, "id">) => void;
  deleteClient: (id: string) => void;
  updateClient: (id: string, updatedClient: Omit<Client, "id">) => void;
  updateClientStatus: (id: string, status: ClientStatus) => void;
  getClientById: (id: string) => Client | undefined;
};

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [
    {
      id: "c1",
      name: "Ahmed Samir",
      company: "Nile Tech",
      email: "ahmed@niletech.com",
      status: "Active",
    },
    {
      id: "c2",
      name: "Mona Adel",
      company: "Green Vision",
      email: "mona@greenvision.com",
      status: "Pending",
    },
    {
      id: "c3",
      name: "Youssef Tarek",
      company: "Orbit Labs",
      email: "youssef@orbitlabs.com",
      status: "Inactive",
    },
  ],

  selectedClient: null,

  setSelectedClient: (client) => set({ selectedClient: client }),

  addClient: (client) =>
    set((state) => {
      const newClient = {
        id: crypto.randomUUID(),
        ...client,
      };

      useNotificationStore.getState().addNotification({
        type: "client",
        title: "Client added",
        description: `${client.name} added to workspace`,
      });

      return {
        clients: [newClient, ...state.clients],
      };
    }),

  deleteClient: (id) =>
    set((state) => {
      const deletedClient = state.clients.find((client) => client.id === id);

      if (deletedClient) {
        useNotificationStore.getState().addNotification({
          type: "client",
          title: "Client deleted",
          description: `${deletedClient.name} removed from workspace`,
        });
      }

      return {
        clients: state.clients.filter((client) => client.id !== id),
        selectedClient:
          state.selectedClient?.id === id ? null : state.selectedClient,
      };
    }),

  updateClient: (id, updatedClient) =>
    set((state) => {
      useNotificationStore.getState().addNotification({
        type: "client",
        title: "Client updated",
        description: `${updatedClient.name} details updated`,
      });

      return {
        clients: state.clients.map((client) =>
          client.id === id
            ? {
                ...client,
                ...updatedClient,
              }
            : client,
        ),
        selectedClient:
          state.selectedClient?.id === id
            ? {
                ...state.selectedClient,
                ...updatedClient,
              }
            : state.selectedClient,
      };
    }),

  updateClientStatus: (id, status) =>
    set((state) => {
      const currentClient = state.clients.find((client) => client.id === id);

      if (currentClient) {
        useNotificationStore.getState().addNotification({
          type: "client",
          title: "Client status updated",
          description: `${currentClient.name} status changed to ${status}`,
        });
      }

      return {
        clients: state.clients.map((client) =>
          client.id === id
            ? {
                ...client,
                status,
              }
            : client,
        ),
        selectedClient:
          state.selectedClient?.id === id
            ? {
                ...state.selectedClient,
                status,
              }
            : state.selectedClient,
      };
    }),

  getClientById: (id) => {
    return get().clients.find((client) => client.id === id);
  },
}));