import { createSupabaseClient } from "@/lib/supabase/client";
import { Task, TaskStatus } from "@/types/task";

type SupabaseTaskRow = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Task["priority"];
  client_name: string;
  project_name: string;
  project_id: string;
  due_date: string;
  created_at: string;
  updated_at: string;
};

type TaskInput = Omit<Task, "id">;

function mapTaskFromRow(row: SupabaseTaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    clientName: row.client_name,
    projectName: row.project_name,
    projectId: row.project_id,
    dueDate: row.due_date,
  };
}

export async function getTasks() {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    mapTaskFromRow(row as SupabaseTaskRow),
  );
}

export async function createTask(task: TaskInput) {
  const supabase = createSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to create a task.");
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      client_name: task.clientName,
      project_name: task.projectName,
      project_id: task.projectId,
      due_date: task.dueDate,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapTaskFromRow(data as SupabaseTaskRow);
}

export async function updateTaskStatusById(
  id: string,
  status: TaskStatus,
) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("tasks")
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

  return mapTaskFromRow(data as SupabaseTaskRow);
}

export async function deleteTaskById(id: string) {
  const supabase = createSupabaseClient();

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
}