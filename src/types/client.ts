export type ClientStatus = "Active" | "Pending" | "Inactive";

export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: ClientStatus;

  avatarUrl?: string;

  createdAt?: string;
  updatedAt?: string;
};