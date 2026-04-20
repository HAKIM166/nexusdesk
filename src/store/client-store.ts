"use client";

import { create } from "zustand";

export type Client = {
  name: string;
  company: string;
  email: string;
  status: string;
};

type ClientStore = {
  clients: Client[];
  addClient: (client: Client) => void;
  deleteClient: (email: string) => void;
  updateClient: (email: string, updatedClient: Client) => void;
};

export const useClientStore = create<ClientStore>((set) => ({
  clients: [
    {
      name: "Ahmed Samir",
      company: "Nile Tech",
      email: "ahmed@niletech.com",
      status: "Active",
    },
    {
      name: "Mona Adel",
      company: "Green Vision",
      email: "mona@greenvision.com",
      status: "Pending",
    },
    {
      name: "Youssef Tarek",
      company: "Orbit Labs",
      email: "youssef@orbitlabs.com",
      status: "Inactive",
    },
  ],

  addClient: (client) =>
    set((state) => ({
      clients: [client, ...state.clients],
    })),

  deleteClient: (email) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.email !== email),
    })),

  updateClient: (email, updatedClient) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.email === email ? updatedClient : client
      ),
    })),
}));