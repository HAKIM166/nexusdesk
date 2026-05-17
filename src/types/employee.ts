export type EmployeeStatus = "Active" | "Pending" | "Inactive";

export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Intern";

export type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  status: EmployeeStatus;
  avatarDataUrl?: string;

  phone?: string;
  location?: string;
  joinedAt?: string;
  employmentType?: EmploymentType;
  skills?: string[];
  notes?: string;
};