"use client";

import EmployeeLocationFields from "@/components/employees/employee-location-fields";
import EmployeeOptionCombobox, {
  EmployeeComboboxOption,
} from "@/components/employees/employee-option-combobox";
import EmployeePhoneField from "@/components/employees/employee-phone-field";
import { fieldLimits } from "@/components/employees/employee-form-helpers";
import { Employee, EmployeeStatus } from "@/types/employee";

type EmployeeFormLabels = {
  name: string;
  role: string;
  department: string;
  email: string;
  status: string;
  phone: string;
  location: string;
  joinedAt: string;
  employmentType: string;
  optional: string;
  governorate: string;
  searchDepartment: string;
  searchCountry: string;
  searchGovernorate: string;
  selectStatus: string;
  selectEmploymentType: string;
  noDepartmentResults: string;
  noCountryResults: string;
  noGovernorateResults: string;
  noStatusResults: string;
  noEmploymentTypeResults: string;
  invalidPhone: string;
  possiblePhone: string;
  country: string;
};

type EmployeeIdentityFieldsProps = {
  labels: EmployeeFormLabels;
  employee?: Employee | null;
  onInput: () => void;
};

type EmployeeWorkFieldsProps = {
  labels: EmployeeFormLabels;
  department: string;
  status: EmployeeStatus;
  departmentOptions: EmployeeComboboxOption[];
  statusOptions: EmployeeComboboxOption[];
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

type EmployeeContactFieldsProps = {
  labels: EmployeeFormLabels;
  employee?: Employee | null;
  isArabic: boolean;
  onInput: () => void;
  onPhoneValidityChange: (isValid: boolean) => void;
};

type EmployeeLocationSectionProps = {
  countryCode: string;
  city: string;
  isArabic: boolean;
  labels: EmployeeFormLabels;
  onCountryChange: (countryCode: string) => void;
  onCityChange: (city: string) => void;
};

type EmployeeDatesAndTypeFieldsProps = {
  labels: EmployeeFormLabels;
  employee?: Employee | null;
  employmentType: string;
  employmentTypeOptions: EmployeeComboboxOption[];
  onInput: () => void;
  onEmploymentTypeChange: (value: string) => void;
};

const inputClassName =
  "w-full rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--background)] px-3.5 py-2.5 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--foreground-soft)] focus:border-[color:var(--employee-primary-action-border)] md:rounded-xl md:px-4 md:py-3";

const labelTextClassName =
  "text-xs font-medium text-[color:var(--foreground)] md:text-sm";

export function EmployeeIdentityFields({
  labels,
  employee,
  onInput,
}: EmployeeIdentityFieldsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
      <label className="space-y-1.5 md:space-y-2">
        <span className={labelTextClassName}>{labels.name}</span>

        <input
          name="name"
          defaultValue={employee?.name || ""}
          required
          maxLength={fieldLimits.name}
          onInput={onInput}
          className={inputClassName}
        />
      </label>

      <label className="space-y-1.5 md:space-y-2">
        <span className={labelTextClassName}>{labels.role}</span>

        <input
          name="role"
          defaultValue={employee?.role || ""}
          required
          maxLength={fieldLimits.role}
          onInput={onInput}
          className={inputClassName}
        />
      </label>
    </div>
  );
}

export function EmployeeWorkFields({
  labels,
  department,
  status,
  departmentOptions,
  statusOptions,
  onDepartmentChange,
  onStatusChange,
}: EmployeeWorkFieldsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
      <EmployeeOptionCombobox
        name="department"
        label={labels.department}
        value={department}
        options={departmentOptions}
        placeholder={labels.searchDepartment}
        emptyText={labels.noDepartmentResults}
        required
        onChange={onDepartmentChange}
      />

      <EmployeeOptionCombobox
        name="status"
        label={labels.status}
        value={status}
        options={statusOptions}
        placeholder={labels.selectStatus}
        emptyText={labels.noStatusResults}
        required
        onChange={onStatusChange}
      />
    </div>
  );
}

export function EmployeeContactFields({
  labels,
  employee,
  isArabic,
  onInput,
  onPhoneValidityChange,
}: EmployeeContactFieldsProps) {
  return (
    <>
      <label className="block space-y-1.5 md:space-y-2">
        <span className={labelTextClassName}>{labels.email}</span>

        <input
          name="email"
          type="email"
          defaultValue={employee?.email || ""}
          required
          maxLength={fieldLimits.email}
          onInput={onInput}
          className={inputClassName}
        />
      </label>

      <EmployeePhoneField
        label={labels.phone}
        value={employee?.phone}
        isArabic={isArabic}
        optionalText={labels.optional}
        placeholder={isArabic ? "اكتب رقم الهاتف" : "Enter phone number"}
        searchCountryPlaceholder={labels.searchCountry}
        invalidText={labels.invalidPhone}
        possibleText={labels.possiblePhone}
        onValidityChange={onPhoneValidityChange}
      />
    </>
  );
}

export function EmployeeLocationSection({
  countryCode,
  city,
  isArabic,
  labels,
  onCountryChange,
  onCityChange,
}: EmployeeLocationSectionProps) {
  return (
    <EmployeeLocationFields
      countryCode={countryCode}
      city={city}
      isArabic={isArabic}
      labels={{
        location: labels.location,
        country: labels.country,
        city: labels.governorate,
        optional: labels.optional,
        searchCountry: labels.searchCountry,
        searchCity: labels.searchGovernorate,
        noCountryResults: labels.noCountryResults,
        noCityResults: labels.noGovernorateResults,
      }}
      onCountryChange={onCountryChange}
      onCityChange={onCityChange}
    />
  );
}

export function EmployeeDatesAndTypeFields({
  labels,
  employee,
  employmentType,
  employmentTypeOptions,
  onInput,
  onEmploymentTypeChange,
}: EmployeeDatesAndTypeFieldsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
      <label className="space-y-1.5 md:space-y-2">
        <span className="flex items-center justify-between gap-3 text-xs font-medium text-[color:var(--foreground)] md:text-sm">
          <span>{labels.joinedAt}</span>
          <span className="text-[11px] font-normal text-[color:var(--foreground-muted)] md:text-xs">
            {labels.optional}
          </span>
        </span>

        <input
          name="joinedAt"
          type="date"
          defaultValue={employee?.joinedAt || ""}
          onInput={onInput}
          className={inputClassName}
        />
      </label>

      <EmployeeOptionCombobox
        name="employmentType"
        label={labels.employmentType}
        value={employmentType}
        options={employmentTypeOptions}
        placeholder={labels.selectEmploymentType}
        emptyText={labels.noEmploymentTypeResults}
        optionalText={labels.optional}
        onChange={onEmploymentTypeChange}
      />
    </div>
  );
}