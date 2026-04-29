export type ClientStatus = "Active" | "Pending" | "Inactive";

export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  status: ClientStatus;
  createdAt?: string;
  updatedAt?: string;
};