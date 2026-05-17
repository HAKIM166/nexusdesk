"use client";

import { FormEvent, useEffect, useMemo, useReducer, useRef } from "react";
import { X } from "lucide-react";

import {
  EmployeeContactFields,
  EmployeeDatesAndTypeFields,
  EmployeeIdentityFields,
  EmployeeLocationSection,
  EmployeeWorkFields,
} from "@/components/employees/employee-form-sections";
import EmployeePhotoField from "@/components/employees/employee-photo-field";
import {
  EmployeeFormModalProps,
  buildEmployeeFormLabels,
  getEmployeeDepartmentOptions,
  getEmployeeEmploymentTypeOptions,
  getEmployeeStatusOptions,
  hasDuplicateEmployee,
  initialModalState,
  modalReducer,
  sanitizeOptionalValue,
} from "@/components/employees/employee-form-helpers";
import { parseEmployeeLocation } from "@/data/employee-location-options";
import { EmployeeStatus, EmploymentType } from "@/types/employee";

type EmployeeFormValues = {
  department: string;
  status: EmployeeStatus;
  countryCode: string;
  city: string;
  employmentType: string;
};

type EmployeeFormValuesAction =
  | {
      type: "reset";
      values: EmployeeFormValues;
    }
  | {
      type: "department";
      value: string;
    }
  | {
      type: "status";
      value: EmployeeStatus;
    }
  | {
      type: "country";
      value: string;
    }
  | {
      type: "city";
      value: string;
    }
  | {
      type: "employment-type";
      value: string;
    };

const initialFormValues: EmployeeFormValues = {
  department: "",
  status: "Active",
  countryCode: "",
  city: "",
  employmentType: "",
};

function employeeFormValuesReducer(
  state: EmployeeFormValues,
  action: EmployeeFormValuesAction,
): EmployeeFormValues {
  switch (action.type) {
    case "reset":
      return action.values;

    case "department":
      return {
        ...state,
        department: action.value,
      };

    case "status":
      return {
        ...state,
        status: action.value,
      };

    case "country":
      return {
        ...state,
        countryCode: action.value,
        city: "",
      };

    case "city":
      return {
        ...state,
        city: action.value,
      };

    case "employment-type":
      return {
        ...state,
        employmentType: action.value,
      };

    default:
      return state;
  }
}

export default function EmployeeFormModal({
  isOpen,
  messages,
  employee,
  existingEmployees = [],
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  const [modalState, updateModalState] = useReducer(
    modalReducer,
    initialModalState,
  );

  const [formValues, updateFormValues] = useReducer(
    employeeFormValuesReducer,
    initialFormValues,
  );

  const phoneValidityRef = useRef(true);

  const isEditing = Boolean(employee);
  const isArabic = messages?.sidebar?.employees !== "Employees";

  const departmentOptions = useMemo(() => {
    return getEmployeeDepartmentOptions(isArabic);
  }, [isArabic]);

  const statusOptionsForCombobox = useMemo(() => {
    return getEmployeeStatusOptions(messages);
  }, [messages]);

  const employmentTypeOptionsForCombobox = useMemo(() => {
    return getEmployeeEmploymentTypeOptions(isArabic, messages);
  }, [isArabic, messages]);

  const labels = useMemo(() => {
    return buildEmployeeFormLabels({
      messages,
      isArabic,
    });
  }, [isArabic, messages]);

  useEffect(() => {
    if (!isOpen) return;

    const parsedLocation = parseEmployeeLocation(employee?.location);

    updateModalState({
      type: "reset",
      avatarDataUrl: employee?.avatarDataUrl,
    });

    phoneValidityRef.current = true;

    updateFormValues({
      type: "reset",
      values: {
        department: employee?.department || "",
        status: employee?.status || "Active",
        countryCode: parsedLocation.countryCode,
        city: parsedLocation.city,
        employmentType: employee?.employmentType || "",
      },
    });
  }, [employee, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const clearSubmitErrors = () => {
    updateModalState({ type: "clear-errors" });
  };

  const handleDepartmentChange = (nextDepartment: string) => {
    updateFormValues({
      type: "department",
      value: nextDepartment,
    });

    clearSubmitErrors();
  };

  const handleStatusChange = (nextStatus: string) => {
    updateFormValues({
      type: "status",
      value: nextStatus as EmployeeStatus,
    });

    clearSubmitErrors();
  };

  const handleCountryChange = (nextCountryCode: string) => {
    updateFormValues({
      type: "country",
      value: nextCountryCode,
    });

    clearSubmitErrors();
  };

  const handleCityChange = (nextCity: string) => {
    updateFormValues({
      type: "city",
      value: nextCity,
    });

    clearSubmitErrors();
  };

  const handleEmploymentTypeChange = (nextEmploymentType: string) => {
    updateFormValues({
      type: "employment-type",
      value: nextEmploymentType,
    });

    clearSubmitErrors();
  };

  const handlePhoneValidityChange = (isValid: boolean) => {
    phoneValidityRef.current = isValid;
    clearSubmitErrors();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") || "").trim();
    const role = String(form.get("role") || "").trim();
    const submittedDepartment = String(form.get("department") || "").trim();
    const email = String(form.get("email") || "").trim();

    const submittedStatus = String(
      form.get("status") || "Active",
    ) as EmployeeStatus;

    const phone = sanitizeOptionalValue(form.get("phone"));
    const location = sanitizeOptionalValue(form.get("location"));
    const joinedAt = sanitizeOptionalValue(form.get("joinedAt"));
    const submittedEmploymentType = sanitizeOptionalValue(
      form.get("employmentType"),
    ) as EmploymentType | undefined;

    if (!name || !role || !submittedDepartment || !email) return;

    if (phone && !phoneValidityRef.current) {
      updateModalState({
        type: "submit-error",
        message: labels.invalidPhone,
      });
      return;
    }

    const isDuplicate = hasDuplicateEmployee({
      employees: existingEmployees,
      currentEmployeeId: employee?.id,
      name,
      email,
      department: submittedDepartment,
    });

    if (isDuplicate) {
      updateModalState({
        type: "submit-error",
        message: labels.duplicate,
      });
      return;
    }

    onSubmit({
      name,
      role,
      department: submittedDepartment,
      email,
      status: submittedStatus,
      avatarDataUrl: modalState.avatarDataUrl,
      phone,
      location,
      joinedAt,
      employmentType: submittedEmploymentType,
      skills: employee?.skills,
      notes: employee?.notes,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-2 pt-8 sm:items-center sm:px-4 sm:py-6"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label={labels.cancel}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-sm"
      />

      <div className="relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-t-xl border border-[color:var(--employee-card-border)] bg-[color:var(--employee-card-bg)] shadow-[0_16px_42px_rgba(0,0,0,0.28)] sm:max-h-[92vh] sm:rounded-2xl sm:shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
        <div className="sticky top-0 z-20 flex items-start justify-between gap-3 border-b border-[color:var(--employee-card-border)] bg-[color:var(--employee-card-bg)] px-4 py-4 sm:gap-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--foreground-muted)] sm:text-xs sm:tracking-[0.2em]">
              {messages?.employees?.title ||
                (isArabic ? "الموظفون" : "Employees")}
            </p>

            <h2 className="mt-1.5 text-lg font-semibold text-[color:var(--foreground)] sm:mt-2 sm:text-xl">
              {isEditing
                ? (
                    messages?.employees?.form as
                      | Partial<Record<string, string>>
                      | undefined
                  )?.editTitle || (isArabic ? "تعديل موظف" : "Edit employee")
                : messages?.employees?.form?.title ||
                  (isArabic ? "إضافة موظف جديد" : "Add New Employee")}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={labels.cancel}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[color:var(--employee-action-border)] bg-[color:var(--employee-action-bg)] text-[color:var(--employee-action-text)] transition hover:bg-[color:var(--employee-action-hover-bg)] sm:size-9"
          >
            <X size={16} className="sm:size-[17px]" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-6"
        >
          <EmployeePhotoField
            value={modalState.avatarDataUrl}
            onChange={(avatarDataUrl) =>
              updateModalState({
                type: "set-avatar",
                avatarDataUrl,
              })
            }
            labels={{
              avatar: labels.avatar,
              uploadPhoto: labels.uploadPhoto,
              removePhoto: labels.removePhoto,
              cropHint: labels.cropHint,
              zoom: labels.zoom,
              processing: labels.processing,
              cancel: labels.cancel,
              save: labels.save,
              invalidImage: labels.invalidImage,
              imageSize: labels.imageSize,
              imageFailed: labels.imageFailed,
            }}
          />

          <EmployeeIdentityFields
            labels={labels}
            employee={employee}
            onInput={clearSubmitErrors}
          />

          <EmployeeWorkFields
            labels={labels}
            department={formValues.department}
            status={formValues.status}
            departmentOptions={departmentOptions}
            statusOptions={statusOptionsForCombobox}
            onDepartmentChange={handleDepartmentChange}
            onStatusChange={handleStatusChange}
          />

          <EmployeeContactFields
            labels={labels}
            employee={employee}
            isArabic={isArabic}
            onInput={clearSubmitErrors}
            onPhoneValidityChange={handlePhoneValidityChange}
          />

          <EmployeeLocationSection
            labels={labels}
            countryCode={formValues.countryCode}
            city={formValues.city}
            isArabic={isArabic}
            onCountryChange={handleCountryChange}
            onCityChange={handleCityChange}
          />

          <EmployeeDatesAndTypeFields
            labels={labels}
            employee={employee}
            employmentType={formValues.employmentType}
            employmentTypeOptions={employmentTypeOptionsForCombobox}
            onInput={clearSubmitErrors}
            onEmploymentTypeChange={handleEmploymentTypeChange}
          />

          {modalState.submitError ? (
            <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2.5 text-xs font-medium text-red-500 sm:px-4 sm:py-3 sm:text-sm">
              {modalState.submitError}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-2.5 border-t border-[color:var(--employee-card-border)] pt-4 sm:flex-row sm:justify-end sm:gap-3 sm:pt-5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full min-w-28 items-center justify-center rounded-lg border border-[color:var(--employee-soft-action-border)] bg-[color:var(--employee-soft-action-bg)] px-5 py-2.5 text-sm font-semibold text-[color:var(--foreground-muted)] transition hover:bg-[color:var(--employee-action-hover-bg)] sm:w-auto sm:py-3"
            >
              {labels.cancel}
            </button>

            <button
              type="submit"
              className="inline-flex w-full min-w-32 items-center justify-center rounded-lg border border-[color:var(--employee-primary-action-border)] bg-[color:var(--employee-primary-action-bg)] px-5 py-2.5 text-sm font-semibold text-[color:var(--employee-primary-action-text)] shadow-[0_10px_24px_var(--employee-primary-action-shadow)] transition hover:bg-[color:var(--employee-primary-action-hover-bg)] sm:w-auto sm:py-3 sm:shadow-[0_14px_32px_var(--employee-primary-action-shadow)]"
            >
              {labels.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
