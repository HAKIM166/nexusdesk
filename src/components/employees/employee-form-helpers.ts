import { EmployeeComboboxOption } from "@/components/employees/employee-option-combobox";
import {
  employeeDepartments,
  employmentTypeOptions,
  getEmployeeDepartmentLabel,
} from "@/data/employee-options";
import { getMessages } from "@/lib/helpers";
import { Employee, EmployeeStatus, EmploymentType } from "@/types/employee";

export type EmployeeMessages = ReturnType<typeof getMessages>;

export type EmployeeFormData = Omit<Employee, "id">;

export type EmployeeFormModalProps = {
  isOpen: boolean;
  messages?: EmployeeMessages;
  employee?: Employee | null;
  existingEmployees?: Employee[];
  onClose: () => void;
  onSubmit: (employee: EmployeeFormData) => void;
};

export type EmployeeFormTextKey =
  | "name"
  | "role"
  | "department"
  | "email"
  | "status"
  | "cancel"
  | "save"
  | "phone"
  | "location"
  | "joinedAt"
  | "employmentType"
  | "avatar"
  | "uploadPhoto"
  | "removePhoto"
  | "processing"
  | "cropHint"
  | "zoom"
  | "duplicate"
  | "invalidImage"
  | "imageSize"
  | "imageFailed"
  | "optional"
  | "country"
  | "governorate"
  | "selectStatus"
  | "searchDepartment"
  | "searchCountry"
  | "searchGovernorate"
  | "selectEmploymentType"
  | "noDepartmentResults"
  | "noCountryResults"
  | "noGovernorateResults"
  | "noStatusResults"
  | "noEmploymentTypeResults"
  | "invalidPhone"
  | "possiblePhone";

export type ModalState = {
  avatarDataUrl?: string;
  submitError: string;
};

export type ModalAction =
  | { type: "reset"; avatarDataUrl?: string }
  | { type: "set-avatar"; avatarDataUrl?: string }
  | { type: "submit-error"; message: string }
  | { type: "clear-errors" };

export const fieldLimits = {
  name: 60,
  role: 50,
  email: 80,
};

export const initialModalState: ModalState = {
  avatarDataUrl: undefined,
  submitError: "",
};

const statusOptions: EmployeeStatus[] = ["Active", "Pending", "Inactive"];

const fallbackFormLabels: Record<EmployeeFormTextKey, string> = {
  name: "Employee name",
  role: "Role",
  department: "Department",
  email: "Email address",
  status: "Status",
  cancel: "Cancel",
  save: "Save employee",
  phone: "Phone",
  location: "Location",
  joinedAt: "Joined date",
  employmentType: "Employment type",

  avatar: "Employee photo",
  uploadPhoto: "Upload photo",
  removePhoto: "Remove photo",
  processing: "Processing...",
  cropHint: "Choose a photo, zoom it, and crop the best face area.",
  zoom: "Zoom",
  duplicate:
    "This employee already exists. Use a different email or employee details.",
  invalidImage: "Please choose a valid image file.",
  imageSize: "Image size must be less than 2MB.",
  imageFailed: "Could not process this image.",

  optional: "Optional",
  country: "Country",
  governorate: "Governorate / City",

  selectStatus: "Select status",
  searchDepartment: "Search department",
  searchCountry: "Search country",
  searchGovernorate: "Search governorate or city",
  selectEmploymentType: "Select employment type",

  noDepartmentResults: "No matching departments",
  noCountryResults: "No matching countries",
  noGovernorateResults: "No matching governorates or cities",
  noStatusResults: "No matching statuses",
  noEmploymentTypeResults: "No matching employment types",

  invalidPhone: "Phone number is not valid for the selected country.",
  possiblePhone: "Phone number length looks incorrect.",
};

export function modalReducer(
  state: ModalState,
  action: ModalAction,
): ModalState {
  switch (action.type) {
    case "reset":
      return {
        avatarDataUrl: action.avatarDataUrl,
        submitError: "",
      };

    case "set-avatar":
      return {
        ...state,
        avatarDataUrl: action.avatarDataUrl,
        submitError: "",
      };

    case "submit-error":
      return {
        ...state,
        submitError: action.message,
      };

    case "clear-errors":
      return {
        ...state,
        submitError: "",
      };

    default:
      return state;
  }
}

export function getFormText(
  messages: EmployeeMessages | undefined,
  key: EmployeeFormTextKey,
  fallback: string,
) {
  const formMessages = messages?.employees?.form as
    | Partial<Record<EmployeeFormTextKey, string>>
    | undefined;

  return formMessages?.[key] || fallback;
}

export function getStatusLabel(
  status: EmployeeStatus,
  messages?: EmployeeMessages,
) {
  const normalizedStatus = status.toLowerCase();

  const employeeStatusMessages = messages?.employees?.status as
    | Partial<Record<string, string>>
    | undefined;

  const commonStatusMessages = messages?.common?.status as
    | Partial<Record<string, string>>
    | undefined;

  return (
    employeeStatusMessages?.[normalizedStatus] ||
    employeeStatusMessages?.[status] ||
    commonStatusMessages?.[normalizedStatus] ||
    commonStatusMessages?.[status] ||
    status
  );
}

function getEmploymentTypeMessageKey(employmentType: EmploymentType) {
  const keys: Record<EmploymentType, string> = {
    "Full-time": "fullTime",
    "Part-time": "partTime",
    Contract: "contract",
    Intern: "intern",
  };

  return keys[employmentType];
}

export function getEmploymentTypeLabel(
  employmentType: EmploymentType,
  isArabic: boolean,
  messages?: EmployeeMessages,
) {
  const employmentTypeMessages = messages?.employees?.employmentTypes as
    | Partial<Record<string, string>>
    | undefined;

  const messageKey = getEmploymentTypeMessageKey(employmentType);

  if (employmentTypeMessages?.[messageKey]) {
    return employmentTypeMessages[messageKey];
  }

  if (!isArabic) return employmentType;

  const fallbackLabels: Record<EmploymentType, string> = {
    "Full-time": "دوام كامل",
    "Part-time": "دوام جزئي",
    Contract: "عقد",
    Intern: "تدريب",
  };

  return fallbackLabels[employmentType];
}

export function normalizeValue(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function sanitizeOptionalValue(value: FormDataEntryValue | null) {
  const normalizedValue = String(value || "").trim();
  return normalizedValue || undefined;
}

export function hasDuplicateEmployee({
  employees,
  currentEmployeeId,
  name,
  email,
  department,
}: {
  employees: Employee[];
  currentEmployeeId?: string;
  name: string;
  email: string;
  department: string;
}) {
  const normalizedName = normalizeValue(name);
  const normalizedEmail = normalizeValue(email);
  const normalizedDepartment = normalizeValue(department);

  return employees.some((employeeItem) => {
    if (employeeItem.id === currentEmployeeId) return false;

    const sameEmail = normalizeValue(employeeItem.email) === normalizedEmail;

    const sameNameAndDepartment =
      normalizeValue(employeeItem.name) === normalizedName &&
      normalizeValue(employeeItem.department) === normalizedDepartment;

    return sameEmail || sameNameAndDepartment;
  });
}

export function getEmployeeDepartmentOptions(
  isArabic = false,
): EmployeeComboboxOption[] {
  const locale = isArabic ? "ar" : "en";

  return employeeDepartments.map((departmentOption) => {
    const label = getEmployeeDepartmentLabel(departmentOption.value, locale);

    return {
      label,
      value: departmentOption.value,
      searchText: `${departmentOption.label} ${departmentOption.value} ${label}`,
    };
  });
}

export function getEmployeeStatusOptions(
  messages?: EmployeeMessages,
): EmployeeComboboxOption[] {
  return statusOptions.map((statusOption) => ({
    label: getStatusLabel(statusOption, messages),
    value: statusOption,
    searchText: `${statusOption} ${getStatusLabel(statusOption, messages)}`,
  }));
}

export function getEmployeeEmploymentTypeOptions(
  isArabic: boolean,
  messages?: EmployeeMessages,
): EmployeeComboboxOption[] {
  return employmentTypeOptions.map((employmentTypeOption) => {
    const label = getEmploymentTypeLabel(
      employmentTypeOption,
      isArabic,
      messages,
    );

    return {
      label,
      value: employmentTypeOption,
      searchText: `${employmentTypeOption} ${label}`,
    };
  });
}

export function buildEmployeeFormLabels({
  messages,
}: {
  messages?: EmployeeMessages;
  isArabic?: boolean;
}) {
  return {
    name: getFormText(messages, "name", fallbackFormLabels.name),
    role: getFormText(messages, "role", fallbackFormLabels.role),
    department: getFormText(
      messages,
      "department",
      fallbackFormLabels.department,
    ),
    email: getFormText(messages, "email", fallbackFormLabels.email),
    status: getFormText(messages, "status", fallbackFormLabels.status),
    phone: getFormText(messages, "phone", fallbackFormLabels.phone),
    location: getFormText(messages, "location", fallbackFormLabels.location),
    joinedAt: getFormText(messages, "joinedAt", fallbackFormLabels.joinedAt),
    employmentType: getFormText(
      messages,
      "employmentType",
      fallbackFormLabels.employmentType,
    ),
    cancel: getFormText(messages, "cancel", fallbackFormLabels.cancel),
    save: getFormText(messages, "save", fallbackFormLabels.save),

    avatar: getFormText(messages, "avatar", fallbackFormLabels.avatar),
    uploadPhoto: getFormText(
      messages,
      "uploadPhoto",
      fallbackFormLabels.uploadPhoto,
    ),
    removePhoto: getFormText(
      messages,
      "removePhoto",
      fallbackFormLabels.removePhoto,
    ),
    processing: getFormText(
      messages,
      "processing",
      fallbackFormLabels.processing,
    ),
    cropHint: getFormText(messages, "cropHint", fallbackFormLabels.cropHint),
    zoom: getFormText(messages, "zoom", fallbackFormLabels.zoom),
    duplicate: getFormText(messages, "duplicate", fallbackFormLabels.duplicate),
    invalidImage: getFormText(
      messages,
      "invalidImage",
      fallbackFormLabels.invalidImage,
    ),
    imageSize: getFormText(messages, "imageSize", fallbackFormLabels.imageSize),
    imageFailed: getFormText(
      messages,
      "imageFailed",
      fallbackFormLabels.imageFailed,
    ),

    optional: getFormText(messages, "optional", fallbackFormLabels.optional),
    country: getFormText(messages, "country", fallbackFormLabels.country),
    governorate: getFormText(
      messages,
      "governorate",
      fallbackFormLabels.governorate,
    ),

    selectStatus: getFormText(
      messages,
      "selectStatus",
      fallbackFormLabels.selectStatus,
    ),
    searchDepartment: getFormText(
      messages,
      "searchDepartment",
      fallbackFormLabels.searchDepartment,
    ),
    searchCountry: getFormText(
      messages,
      "searchCountry",
      fallbackFormLabels.searchCountry,
    ),
    searchGovernorate: getFormText(
      messages,
      "searchGovernorate",
      fallbackFormLabels.searchGovernorate,
    ),
    selectEmploymentType: getFormText(
      messages,
      "selectEmploymentType",
      fallbackFormLabels.selectEmploymentType,
    ),

    noDepartmentResults: getFormText(
      messages,
      "noDepartmentResults",
      fallbackFormLabels.noDepartmentResults,
    ),
    noCountryResults: getFormText(
      messages,
      "noCountryResults",
      fallbackFormLabels.noCountryResults,
    ),
    noGovernorateResults: getFormText(
      messages,
      "noGovernorateResults",
      fallbackFormLabels.noGovernorateResults,
    ),
    noStatusResults: getFormText(
      messages,
      "noStatusResults",
      fallbackFormLabels.noStatusResults,
    ),
    noEmploymentTypeResults: getFormText(
      messages,
      "noEmploymentTypeResults",
      fallbackFormLabels.noEmploymentTypeResults,
    ),

    invalidPhone: getFormText(
      messages,
      "invalidPhone",
      fallbackFormLabels.invalidPhone,
    ),
    possiblePhone: getFormText(
      messages,
      "possiblePhone",
      fallbackFormLabels.possiblePhone,
    ),
  };
}