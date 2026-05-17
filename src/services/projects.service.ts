import { createSupabaseClient } from "@/lib/supabase/client";
import { Project, ProjectStatus } from "@/store/project-store";

type SupabaseProjectRow = {
  id: string;
  user_id: string;
  client_id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  deadline: string | null;
  budget: number | null;
  paid_amount: number | null;
  created_at: string;
  updated_at: string;
};

type ProjectInput = Omit<Project, "id">;

function mapProjectFromRow(row: SupabaseProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    clientId: row.client_id,
    status: row.status,
    deadline: row.deadline ?? "",
    budget: Number(row.budget ?? 0),
    paidAmount: Number(row.paid_amount ?? 0),
  };
}

export async function getProjects() {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) =>
    mapProjectFromRow(row as SupabaseProjectRow),
  );
}

export async function createProject(project: ProjectInput) {
  const supabase = createSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to create a project.");
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      client_id: project.clientId,
      title: project.title,
      description: project.description,
      status: project.status,
      deadline: project.deadline,
      budget: project.budget,
      paid_amount: project.paidAmount,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return mapProjectFromRow(data as SupabaseProjectRow);
}

export async function updateProjectById(
  id: string,
  updatedProject: ProjectInput,
) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("projects")
    .update({
      client_id: updatedProject.clientId,
      title: updatedProject.title,
      description: updatedProject.description,
      status: updatedProject.status,
      deadline: updatedProject.deadline,
      budget: updatedProject.budget,
      paid_amount: updatedProject.paidAmount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return mapProjectFromRow(data as SupabaseProjectRow);
}

export async function updateProjectStatusById(
  id: string,
  status: ProjectStatus,
) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("projects")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return mapProjectFromRow(data as SupabaseProjectRow);
}

export async function deleteProjectById(id: string) {
  const supabase = createSupabaseClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return id;
}

export async function getProjectByIdFromSupabase(id: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data ? mapProjectFromRow(data as SupabaseProjectRow) : null;
}

export async function getProjectsByClientIdFromSupabase(clientId: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) =>
    mapProjectFromRow(row as SupabaseProjectRow),
  );
}