import { createSupabaseClient } from "@/lib/supabase/client";
import { Employee, EmployeeStatus } from "@/types/employee";

type SupabaseEmployeeRow = {
  id: string;
  user_id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: EmployeeStatus;
  avatar_data_url: string | null;
  phone: string | null;
  location: string | null;
  joined_at: string | null;
  employment_type: Employee["employmentType"] | null;
  skills: string[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type EmployeeInput = Omit<Employee, "id">;

function mapEmployeeFromRow(row: SupabaseEmployeeRow): Employee {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    department: row.department,
    email: row.email,
    status: row.status,
    avatarDataUrl: row.avatar_data_url ?? undefined,
    phone: row.phone ?? undefined,
    location: row.location ?? undefined,
    joinedAt: row.joined_at ?? undefined,
    employmentType: row.employment_type ?? undefined,
    skills: row.skills ?? undefined,
    notes: row.notes ?? undefined,
  };
}

export async function getEmployees() {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    mapEmployeeFromRow(row as SupabaseEmployeeRow),
  );
}

export async function createEmployee(employee: EmployeeInput) {
  const supabase = createSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to create an employee.");
  }

  const { data, error } = await supabase
    .from("employees")
    .insert({
      user_id: user.id,
      name: employee.name,
      role: employee.role,
      department: employee.department,
      email: employee.email,
      status: employee.status,
      avatar_data_url: employee.avatarDataUrl ?? null,
      phone: employee.phone ?? null,
      location: employee.location ?? null,
      joined_at: employee.joinedAt ?? null,
      employment_type: employee.employmentType ?? null,
      skills: employee.skills ?? null,
      notes: employee.notes ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapEmployeeFromRow(data as SupabaseEmployeeRow);
}

export async function updateEmployeeById(
  id: string,
  updatedEmployee: EmployeeInput,
) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("employees")
    .update({
      name: updatedEmployee.name,
      role: updatedEmployee.role,
      department: updatedEmployee.department,
      email: updatedEmployee.email,
      status: updatedEmployee.status,
      avatar_data_url: updatedEmployee.avatarDataUrl ?? null,
      phone: updatedEmployee.phone ?? null,
      location: updatedEmployee.location ?? null,
      joined_at: updatedEmployee.joinedAt ?? null,
      employment_type: updatedEmployee.employmentType ?? null,
      skills: updatedEmployee.skills ?? null,
      notes: updatedEmployee.notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapEmployeeFromRow(data as SupabaseEmployeeRow);
}

export async function updateEmployeeStatusById(
  id: string,
  status: EmployeeStatus,
) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("employees")
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

  return mapEmployeeFromRow(data as SupabaseEmployeeRow);
}

export async function deleteEmployeeById(id: string) {
  const supabase = createSupabaseClient();

  const { error } = await supabase.from("employees").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return id;
}

export async function getEmployeeByEmail(email: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapEmployeeFromRow(data as SupabaseEmployeeRow) : null;
}