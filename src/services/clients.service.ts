import { createSupabaseClient } from "@/lib/supabase/client";
import { Client, ClientStatus } from "@/types/client";

type SupabaseClientRow = {
  id: string;
  user_id: string;
  name: string;
  company: string;
  email: string;
  status: ClientStatus;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

type ClientInput = Omit<Client, "id">;

function mapClientFromRow(row: SupabaseClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    status: row.status,
    avatarUrl: row.avatar_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getClients() {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapClientFromRow(row as SupabaseClientRow));
}

export async function createClient(client: ClientInput) {
  const supabase = createSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to create a client.");
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({
      user_id: user.id,
      name: client.name,
      company: client.company,
      email: client.email,
      status: client.status,
      avatar_url: client.avatarUrl ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapClientFromRow(data as SupabaseClientRow);
}

export async function updateClientById(
  id: string,
  updatedClient: ClientInput,
) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("clients")
    .update({
      name: updatedClient.name,
      company: updatedClient.company,
      email: updatedClient.email,
      status: updatedClient.status,
      avatar_url: updatedClient.avatarUrl ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapClientFromRow(data as SupabaseClientRow);
}

export async function updateClientStatusById(
  id: string,
  status: ClientStatus,
) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("clients")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapClientFromRow(data as SupabaseClientRow);
}

export async function deleteClientById(id: string) {
  const supabase = createSupabaseClient();

  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
}

export async function getClientByEmail(email: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapClientFromRow(data as SupabaseClientRow) : null;
}