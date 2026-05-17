"use client";

import { create } from "zustand";
import { useNotificationStore } from "./notification-store";

import { Client, ClientStatus } from "@/types/client";
import {
  createClient,
  deleteClientById,
  getClients,
  updateClientById,
  updateClientStatusById,
} from "@/services/clients.service";

type ClientStore = {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;

  initializeClients: () => Promise<void>;
  setSelectedClient: (client: Client | null) => void;
  addClient: (client: Omit<Client, "id">) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  updateClient: (id: string, updatedClient: Omit<Client, "id">) => Promise<void>;
  updateClientStatus: (id: string, status: ClientStatus) => Promise<void>;
  getClientById: (id: string) => Client | undefined;
};

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,

  initializeClients: async () => {
    set({ isLoading: true, error: null });

    try {
      const clients = await getClients();

      set({
        clients,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load clients.",
      });
    }
  },

  setSelectedClient: (client) => set({ selectedClient: client }),

  addClient: async (client) => {
    set({ error: null });

    try {
      const newClient = await createClient(client);

      set((state) => ({
        clients: [newClient, ...state.clients],
      }));

      useNotificationStore.getState().addNotification({
        type: "client",
        title: "Client added",
        description: `${client.name} added to workspace`,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to add client.",
      });
    }
  },

  deleteClient: async (id) => {
    const deletedClient = get().clients.find((client) => client.id === id);

    set({ error: null });

    try {
      await deleteClientById(id);

      set((state) => ({
        clients: state.clients.filter((client) => client.id !== id),
        selectedClient:
          state.selectedClient?.id === id ? null : state.selectedClient,
      }));

      if (deletedClient) {
        useNotificationStore.getState().addNotification({
          type: "client",
          title: "Client deleted",
          description: `${deletedClient.name} removed from workspace`,
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete client.",
      });
    }
  },

  updateClient: async (id, updatedClient) => {
    set({ error: null });

    try {
      const savedClient = await updateClientById(id, updatedClient);

      set((state) => ({
        clients: state.clients.map((client) =>
          client.id === id ? savedClient : client,
        ),
        selectedClient:
          state.selectedClient?.id === id ? savedClient : state.selectedClient,
      }));

      useNotificationStore.getState().addNotification({
        type: "client",
        title: "Client updated",
        description: `${updatedClient.name} details updated`,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update client.",
      });
    }
  },

  updateClientStatus: async (id, status) => {
    const currentClient = get().clients.find((client) => client.id === id);

    set({ error: null });

    try {
      const savedClient = await updateClientStatusById(id, status);

      set((state) => ({
        clients: state.clients.map((client) =>
          client.id === id ? savedClient : client,
        ),
        selectedClient:
          state.selectedClient?.id === id ? savedClient : state.selectedClient,
      }));

      if (currentClient) {
        useNotificationStore.getState().addNotification({
          type: "client",
          title: "Client status updated",
          description: `${currentClient.name} status changed to ${status}`,
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update client status.",
      });
    }
  },

  getClientById: (id) => {
    return get().clients.find((client) => client.id === id);
  },
}));