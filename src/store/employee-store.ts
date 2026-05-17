"use client";

import { create } from "zustand";

import {
  createEmployee,
  deleteEmployeeById,
  getEmployees,
  updateEmployeeById,
  updateEmployeeStatusById,
} from "@/services/employees.service";
import { Employee, EmployeeStatus } from "@/types/employee";

type EmployeeStore = {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;

  initializeEmployees: () => Promise<void>;
  setSelectedEmployee: (employee: Employee | null) => void;
  addEmployee: (employee: Omit<Employee, "id">) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  updateEmployee: (
    id: string,
    updatedEmployee: Omit<Employee, "id">,
  ) => Promise<void>;
  updateEmployeeStatus: (
    id: string,
    status: EmployeeStatus,
  ) => Promise<void>;
  getEmployeeById: (id: string) => Employee | undefined;
};

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,

  initializeEmployees: async () => {
    set({ isLoading: true, error: null });

    try {
      const employees = await getEmployees();

      set({
        employees,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load employees.",
        isLoading: false,
      });
    }
  },

  setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),

  addEmployee: async (employee) => {
    set({ error: null });

    try {
      const newEmployee = await createEmployee(employee);

      set((state) => ({
        employees: [newEmployee, ...state.employees],
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create employee.",
      });
    }
  },

  deleteEmployee: async (id) => {
    set({ error: null });

    try {
      await deleteEmployeeById(id);

      set((state) => ({
        employees: state.employees.filter((employee) => employee.id !== id),
        selectedEmployee:
          state.selectedEmployee?.id === id ? null : state.selectedEmployee,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete employee.",
      });
    }
  },

  updateEmployee: async (id, updatedEmployee) => {
    set({ error: null });

    try {
      const employeeFromSupabase = await updateEmployeeById(
        id,
        updatedEmployee,
      );

      set((state) => ({
        employees: state.employees.map((employee) =>
          employee.id === id ? employeeFromSupabase : employee,
        ),
        selectedEmployee:
          state.selectedEmployee?.id === id
            ? employeeFromSupabase
            : state.selectedEmployee,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update employee.",
      });
    }
  },

  updateEmployeeStatus: async (id, status) => {
    set({ error: null });

    try {
      const employeeFromSupabase = await updateEmployeeStatusById(id, status);

      set((state) => ({
        employees: state.employees.map((employee) =>
          employee.id === id ? employeeFromSupabase : employee,
        ),
        selectedEmployee:
          state.selectedEmployee?.id === id
            ? employeeFromSupabase
            : state.selectedEmployee,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update employee status.",
      });
    }
  },

  getEmployeeById: (id) => {
    return get().employees.find((employee) => employee.id === id);
  },
}));