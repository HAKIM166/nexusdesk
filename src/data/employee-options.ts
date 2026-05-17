import { EmploymentType } from "@/types/employee";

export type CountryOption = {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
};

export type EmployeeSkillCategory =
  | "frontend"
  | "backend"
  | "fullstack"
  | "mobile"
  | "design"
  | "product"
  | "qa"
  | "devops"
  | "data"
  | "ai"
  | "security"
  | "management"
  | "operations"
  | "sales"
  | "marketing"
  | "clientSuccess"
  | "finance"
  | "hr"
  | "support"
  | "softSkills";

export type EmployeeSkillOption = {
  label: string;
  value: string;
  category: EmployeeSkillCategory;
};

export type EmployeeSkillLocale = "ar" | "en";

export type EmployeeDepartmentOption = {
  label: string;
  value: string;
};

export const employeeDepartments: EmployeeDepartmentOption[] = [
  { label: "Engineering", value: "Engineering" },
  { label: "Frontend", value: "Frontend" },
  { label: "Backend", value: "Backend" },
  { label: "Full Stack", value: "Full Stack" },
  { label: "Mobile", value: "Mobile" },
  { label: "Design", value: "Design" },
  { label: "Product", value: "Product" },
  { label: "Quality Assurance", value: "Quality Assurance" },
  { label: "DevOps", value: "DevOps" },
  { label: "Data", value: "Data" },
  { label: "AI", value: "AI" },
  { label: "Security", value: "Security" },
  { label: "Operations", value: "Operations" },
  { label: "Client Success", value: "Client Success" },
  { label: "Sales", value: "Sales" },
  { label: "Marketing", value: "Marketing" },
  { label: "Finance", value: "Finance" },
  { label: "HR", value: "HR" },
  { label: "Support", value: "Support" },
  { label: "Legal", value: "Legal" },
];
export type EmployeeDepartmentLocale = "ar" | "en";

const employeeDepartmentArabicLabels: Record<string, string> = {
  Engineering: "الهندسة",
  Frontend: "الواجهات الأمامية",
  Backend: "الخلفية",
  "Full Stack": "تطوير شامل",
  Mobile: "تطبيقات الموبايل",
  Design: "التصميم",
  Product: "المنتج",
  "Quality Assurance": "ضمان الجودة",
  DevOps: "DevOps",
  Data: "البيانات",
  AI: "الذكاء الاصطناعي",
  Security: "الأمان",
  Operations: "العمليات",
  "Client Success": "نجاح العملاء",
  Sales: "المبيعات",
  Marketing: "التسويق",
  Finance: "المالية",
  HR: "الموارد البشرية",
  Support: "الدعم",
  Legal: "الشؤون القانونية",
};

export function getEmployeeDepartmentLabel(
  department: string,
  locale: EmployeeDepartmentLocale,
) {
  if (locale === "ar") {
    return employeeDepartmentArabicLabels[department] || department;
  }

  return department;
}

export const employmentTypeOptions: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Intern",
];

export const countries: CountryOption[] = [
  { name: "Afghanistan", code: "AF", dialCode: "+93", flag: "🇦🇫" },
  { name: "Albania", code: "AL", dialCode: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "DZ", dialCode: "+213", flag: "🇩🇿" },
  { name: "Andorra", code: "AD", dialCode: "+376", flag: "🇦🇩" },
  { name: "Angola", code: "AO", dialCode: "+244", flag: "🇦🇴" },
  { name: "Antigua and Barbuda", code: "AG", dialCode: "+1-268", flag: "🇦🇬" },
  { name: "Argentina", code: "AR", dialCode: "+54", flag: "🇦🇷" },
  { name: "Armenia", code: "AM", dialCode: "+374", flag: "🇦🇲" },
  { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
  { name: "Austria", code: "AT", dialCode: "+43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "AZ", dialCode: "+994", flag: "🇦🇿" },
  { name: "Bahamas", code: "BS", dialCode: "+1-242", flag: "🇧🇸" },
  { name: "Bahrain", code: "BH", dialCode: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "BD", dialCode: "+880", flag: "🇧🇩" },
  { name: "Barbados", code: "BB", dialCode: "+1-246", flag: "🇧🇧" },
  { name: "Belarus", code: "BY", dialCode: "+375", flag: "🇧🇾" },
  { name: "Belgium", code: "BE", dialCode: "+32", flag: "🇧🇪" },
  { name: "Belize", code: "BZ", dialCode: "+501", flag: "🇧🇿" },
  { name: "Benin", code: "BJ", dialCode: "+229", flag: "🇧🇯" },
  { name: "Bhutan", code: "BT", dialCode: "+975", flag: "🇧🇹" },
  { name: "Bolivia", code: "BO", dialCode: "+591", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "BA", dialCode: "+387", flag: "🇧🇦" },
  { name: "Botswana", code: "BW", dialCode: "+267", flag: "🇧🇼" },
  { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
  { name: "Brunei", code: "BN", dialCode: "+673", flag: "🇧🇳" },
  { name: "Bulgaria", code: "BG", dialCode: "+359", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "BF", dialCode: "+226", flag: "🇧🇫" },
  { name: "Burundi", code: "BI", dialCode: "+257", flag: "🇧🇮" },
  { name: "Cabo Verde", code: "CV", dialCode: "+238", flag: "🇨🇻" },
  { name: "Cambodia", code: "KH", dialCode: "+855", flag: "🇰🇭" },
  { name: "Cameroon", code: "CM", dialCode: "+237", flag: "🇨🇲" },
  { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
  {
    name: "Central African Republic",
    code: "CF",
    dialCode: "+236",
    flag: "🇨🇫",
  },
  { name: "Chad", code: "TD", dialCode: "+235", flag: "🇹🇩" },
  { name: "Chile", code: "CL", dialCode: "+56", flag: "🇨🇱" },
  { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳" },
  { name: "Colombia", code: "CO", dialCode: "+57", flag: "🇨🇴" },
  { name: "Comoros", code: "KM", dialCode: "+269", flag: "🇰🇲" },
  { name: "Congo", code: "CG", dialCode: "+242", flag: "🇨🇬" },
  { name: "Costa Rica", code: "CR", dialCode: "+506", flag: "🇨🇷" },
  { name: "Croatia", code: "HR", dialCode: "+385", flag: "🇭🇷" },
  { name: "Cuba", code: "CU", dialCode: "+53", flag: "🇨🇺" },
  { name: "Cyprus", code: "CY", dialCode: "+357", flag: "🇨🇾" },
  { name: "Czech Republic", code: "CZ", dialCode: "+420", flag: "🇨🇿" },
  {
    name: "Democratic Republic of the Congo",
    code: "CD",
    dialCode: "+243",
    flag: "🇨🇩",
  },
  { name: "Denmark", code: "DK", dialCode: "+45", flag: "🇩🇰" },
  { name: "Djibouti", code: "DJ", dialCode: "+253", flag: "🇩🇯" },
  { name: "Dominica", code: "DM", dialCode: "+1-767", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "DO", dialCode: "+1-809", flag: "🇩🇴" },
  { name: "Ecuador", code: "EC", dialCode: "+593", flag: "🇪🇨" },
  { name: "Egypt", code: "EG", dialCode: "+20", flag: "🇪🇬" },
  { name: "El Salvador", code: "SV", dialCode: "+503", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "GQ", dialCode: "+240", flag: "🇬🇶" },
  { name: "Eritrea", code: "ER", dialCode: "+291", flag: "🇪🇷" },
  { name: "Estonia", code: "EE", dialCode: "+372", flag: "🇪🇪" },
  { name: "Eswatini", code: "SZ", dialCode: "+268", flag: "🇸🇿" },
  { name: "Ethiopia", code: "ET", dialCode: "+251", flag: "🇪🇹" },
  { name: "Fiji", code: "FJ", dialCode: "+679", flag: "🇫🇯" },
  { name: "Finland", code: "FI", dialCode: "+358", flag: "🇫🇮" },
  { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
  { name: "Gabon", code: "GA", dialCode: "+241", flag: "🇬🇦" },
  { name: "Gambia", code: "GM", dialCode: "+220", flag: "🇬🇲" },
  { name: "Georgia", code: "GE", dialCode: "+995", flag: "🇬🇪" },
  { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
  { name: "Ghana", code: "GH", dialCode: "+233", flag: "🇬🇭" },
  { name: "Greece", code: "GR", dialCode: "+30", flag: "🇬🇷" },
  { name: "Grenada", code: "GD", dialCode: "+1-473", flag: "🇬🇩" },
  { name: "Guatemala", code: "GT", dialCode: "+502", flag: "🇬🇹" },
  { name: "Guinea", code: "GN", dialCode: "+224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "GW", dialCode: "+245", flag: "🇬🇼" },
  { name: "Guyana", code: "GY", dialCode: "+592", flag: "🇬🇾" },
  { name: "Haiti", code: "HT", dialCode: "+509", flag: "🇭🇹" },
  { name: "Honduras", code: "HN", dialCode: "+504", flag: "🇭🇳" },
  { name: "Hungary", code: "HU", dialCode: "+36", flag: "🇭🇺" },
  { name: "Iceland", code: "IS", dialCode: "+354", flag: "🇮🇸" },
  { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
  { name: "Indonesia", code: "ID", dialCode: "+62", flag: "🇮🇩" },
  { name: "Iran", code: "IR", dialCode: "+98", flag: "🇮🇷" },
  { name: "Iraq", code: "IQ", dialCode: "+964", flag: "🇮🇶" },
  { name: "Ireland", code: "IE", dialCode: "+353", flag: "🇮🇪" },
  { name: "Israel", code: "IL", dialCode: "+972", flag: "🇮🇱" },
  { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
  { name: "Jamaica", code: "JM", dialCode: "+1-876", flag: "🇯🇲" },
  { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
  { name: "Jordan", code: "JO", dialCode: "+962", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "KZ", dialCode: "+7", flag: "🇰🇿" },
  { name: "Kenya", code: "KE", dialCode: "+254", flag: "🇰🇪" },
  { name: "Kiribati", code: "KI", dialCode: "+686", flag: "🇰🇮" },
  { name: "Kuwait", code: "KW", dialCode: "+965", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "KG", dialCode: "+996", flag: "🇰🇬" },
  { name: "Laos", code: "LA", dialCode: "+856", flag: "🇱🇦" },
  { name: "Latvia", code: "LV", dialCode: "+371", flag: "🇱🇻" },
  { name: "Lebanon", code: "LB", dialCode: "+961", flag: "🇱🇧" },
  { name: "Lesotho", code: "LS", dialCode: "+266", flag: "🇱🇸" },
  { name: "Liberia", code: "LR", dialCode: "+231", flag: "🇱🇷" },
  { name: "Libya", code: "LY", dialCode: "+218", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "LI", dialCode: "+423", flag: "🇱🇮" },
  { name: "Lithuania", code: "LT", dialCode: "+370", flag: "🇱🇹" },
  { name: "Luxembourg", code: "LU", dialCode: "+352", flag: "🇱🇺" },
  { name: "Madagascar", code: "MG", dialCode: "+261", flag: "🇲🇬" },
  { name: "Malawi", code: "MW", dialCode: "+265", flag: "🇲🇼" },
  { name: "Malaysia", code: "MY", dialCode: "+60", flag: "🇲🇾" },
  { name: "Maldives", code: "MV", dialCode: "+960", flag: "🇲🇻" },
  { name: "Mali", code: "ML", dialCode: "+223", flag: "🇲🇱" },
  { name: "Malta", code: "MT", dialCode: "+356", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "MH", dialCode: "+692", flag: "🇲🇭" },
  { name: "Mauritania", code: "MR", dialCode: "+222", flag: "🇲🇷" },
  { name: "Mauritius", code: "MU", dialCode: "+230", flag: "🇲🇺" },
  { name: "Mexico", code: "MX", dialCode: "+52", flag: "🇲🇽" },
  { name: "Micronesia", code: "FM", dialCode: "+691", flag: "🇫🇲" },
  { name: "Moldova", code: "MD", dialCode: "+373", flag: "🇲🇩" },
  { name: "Monaco", code: "MC", dialCode: "+377", flag: "🇲🇨" },
  { name: "Mongolia", code: "MN", dialCode: "+976", flag: "🇲🇳" },
  { name: "Montenegro", code: "ME", dialCode: "+382", flag: "🇲🇪" },
  { name: "Morocco", code: "MA", dialCode: "+212", flag: "🇲🇦" },
  { name: "Mozambique", code: "MZ", dialCode: "+258", flag: "🇲🇿" },
  { name: "Myanmar", code: "MM", dialCode: "+95", flag: "🇲🇲" },
  { name: "Namibia", code: "NA", dialCode: "+264", flag: "🇳🇦" },
  { name: "Nauru", code: "NR", dialCode: "+674", flag: "🇳🇷" },
  { name: "Nepal", code: "NP", dialCode: "+977", flag: "🇳🇵" },
  { name: "Netherlands", code: "NL", dialCode: "+31", flag: "🇳🇱" },
  { name: "New Zealand", code: "NZ", dialCode: "+64", flag: "🇳🇿" },
  { name: "Nicaragua", code: "NI", dialCode: "+505", flag: "🇳🇮" },
  { name: "Niger", code: "NE", dialCode: "+227", flag: "🇳🇪" },
  { name: "Nigeria", code: "NG", dialCode: "+234", flag: "🇳🇬" },
  { name: "North Korea", code: "KP", dialCode: "+850", flag: "🇰🇵" },
  { name: "North Macedonia", code: "MK", dialCode: "+389", flag: "🇲🇰" },
  { name: "Norway", code: "NO", dialCode: "+47", flag: "🇳🇴" },
  { name: "Oman", code: "OM", dialCode: "+968", flag: "🇴🇲" },
  { name: "Pakistan", code: "PK", dialCode: "+92", flag: "🇵🇰" },
  { name: "Palau", code: "PW", dialCode: "+680", flag: "🇵🇼" },
  { name: "Palestine", code: "PS", dialCode: "+970", flag: "🇵🇸" },
  { name: "Panama", code: "PA", dialCode: "+507", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "PG", dialCode: "+675", flag: "🇵🇬" },
  { name: "Paraguay", code: "PY", dialCode: "+595", flag: "🇵🇾" },
  { name: "Peru", code: "PE", dialCode: "+51", flag: "🇵🇪" },
  { name: "Philippines", code: "PH", dialCode: "+63", flag: "🇵🇭" },
  { name: "Poland", code: "PL", dialCode: "+48", flag: "🇵🇱" },
  { name: "Portugal", code: "PT", dialCode: "+351", flag: "🇵🇹" },
  { name: "Qatar", code: "QA", dialCode: "+974", flag: "🇶🇦" },
  { name: "Romania", code: "RO", dialCode: "+40", flag: "🇷🇴" },
  { name: "Russia", code: "RU", dialCode: "+7", flag: "🇷🇺" },
  { name: "Rwanda", code: "RW", dialCode: "+250", flag: "🇷🇼" },
  { name: "Saint Kitts and Nevis", code: "KN", dialCode: "+1-869", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "LC", dialCode: "+1-758", flag: "🇱🇨" },
  {
    name: "Saint Vincent and the Grenadines",
    code: "VC",
    dialCode: "+1-784",
    flag: "🇻🇨",
  },
  { name: "Samoa", code: "WS", dialCode: "+685", flag: "🇼🇸" },
  { name: "San Marino", code: "SM", dialCode: "+378", flag: "🇸🇲" },
  { name: "Sao Tome and Principe", code: "ST", dialCode: "+239", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966", flag: "🇸🇦" },
  { name: "Senegal", code: "SN", dialCode: "+221", flag: "🇸🇳" },
  { name: "Serbia", code: "RS", dialCode: "+381", flag: "🇷🇸" },
  { name: "Seychelles", code: "SC", dialCode: "+248", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "SL", dialCode: "+232", flag: "🇸🇱" },
  { name: "Singapore", code: "SG", dialCode: "+65", flag: "🇸🇬" },
  { name: "Slovakia", code: "SK", dialCode: "+421", flag: "🇸🇰" },
  { name: "Slovenia", code: "SI", dialCode: "+386", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "SB", dialCode: "+677", flag: "🇸🇧" },
  { name: "Somalia", code: "SO", dialCode: "+252", flag: "🇸🇴" },
  { name: "South Africa", code: "ZA", dialCode: "+27", flag: "🇿🇦" },
  { name: "South Korea", code: "KR", dialCode: "+82", flag: "🇰🇷" },
  { name: "South Sudan", code: "SS", dialCode: "+211", flag: "🇸🇸" },
  { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "LK", dialCode: "+94", flag: "🇱🇰" },
  { name: "Sudan", code: "SD", dialCode: "+249", flag: "🇸🇩" },
  { name: "Suriname", code: "SR", dialCode: "+597", flag: "🇸🇷" },
  { name: "Sweden", code: "SE", dialCode: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "CH", dialCode: "+41", flag: "🇨🇭" },
  { name: "Syria", code: "SY", dialCode: "+963", flag: "🇸🇾" },
  { name: "Taiwan", code: "TW", dialCode: "+886", flag: "🇹🇼" },
  { name: "Tajikistan", code: "TJ", dialCode: "+992", flag: "🇹🇯" },
  { name: "Tanzania", code: "TZ", dialCode: "+255", flag: "🇹🇿" },
  { name: "Thailand", code: "TH", dialCode: "+66", flag: "🇹🇭" },
  { name: "Timor-Leste", code: "TL", dialCode: "+670", flag: "🇹🇱" },
  { name: "Togo", code: "TG", dialCode: "+228", flag: "🇹🇬" },
  { name: "Tonga", code: "TO", dialCode: "+676", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "TT", dialCode: "+1-868", flag: "🇹🇹" },
  { name: "Tunisia", code: "TN", dialCode: "+216", flag: "🇹🇳" },
  { name: "Turkey", code: "TR", dialCode: "+90", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "TM", dialCode: "+993", flag: "🇹🇲" },
  { name: "Tuvalu", code: "TV", dialCode: "+688", flag: "🇹🇻" },
  { name: "Uganda", code: "UG", dialCode: "+256", flag: "🇺🇬" },
  { name: "Ukraine", code: "UA", dialCode: "+380", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971", flag: "🇦🇪" },
  { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
  { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
  { name: "Uruguay", code: "UY", dialCode: "+598", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "UZ", dialCode: "+998", flag: "🇺🇿" },
  { name: "Vanuatu", code: "VU", dialCode: "+678", flag: "🇻🇺" },
  { name: "Vatican City", code: "VA", dialCode: "+379", flag: "🇻🇦" },
  { name: "Venezuela", code: "VE", dialCode: "+58", flag: "🇻🇪" },
  { name: "Vietnam", code: "VN", dialCode: "+84", flag: "🇻🇳" },
  { name: "Yemen", code: "YE", dialCode: "+967", flag: "🇾🇪" },
  { name: "Zambia", code: "ZM", dialCode: "+260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "ZW", dialCode: "+263", flag: "🇿🇼" },
];

export type GovernorateOption = {
  label: string;
  value: string;
};

export const egyptGovernorates: GovernorateOption[] = [
  { label: "Cairo", value: "Cairo" },
  { label: "Giza", value: "Giza" },
  { label: "Alexandria", value: "Alexandria" },
  { label: "Dakahlia", value: "Dakahlia" },
  { label: "Sharqia", value: "Sharqia" },
  { label: "Gharbia", value: "Gharbia" },
  { label: "Monufia", value: "Monufia" },
  { label: "Qalyubia", value: "Qalyubia" },
  { label: "Beheira", value: "Beheira" },
  { label: "Kafr El Sheikh", value: "Kafr El Sheikh" },
  { label: "Damietta", value: "Damietta" },
  { label: "Port Said", value: "Port Said" },
  { label: "Suez", value: "Suez" },
  { label: "Ismailia", value: "Ismailia" },
  { label: "Fayoum", value: "Fayoum" },
  { label: "Beni Suef", value: "Beni Suef" },
  { label: "Minya", value: "Minya" },
  { label: "Assiut", value: "Assiut" },
  { label: "Sohag", value: "Sohag" },
  { label: "Qena", value: "Qena" },
  { label: "Luxor", value: "Luxor" },
  { label: "Aswan", value: "Aswan" },
  { label: "Red Sea", value: "Red Sea" },
  { label: "New Valley", value: "New Valley" },
  { label: "Matrouh", value: "Matrouh" },
  { label: "North Sinai", value: "North Sinai" },
  { label: "South Sinai", value: "South Sinai" },
];

export function getCountryByCode(code?: string) {
  if (!code) return undefined;

  return countries.find((country) => country.code === code);
}

export function getCountryByName(name?: string) {
  if (!name) return undefined;

  const normalizedName = name.trim().toLowerCase();

  return countries.find(
    (country) => country.name.trim().toLowerCase() === normalizedName,
  );
}

export function buildEmployeeLocation(countryName?: string, city?: string) {
  const cleanCountry = countryName?.trim() || "";
  const cleanCity = city?.trim() || "";

  if (cleanCity && cleanCountry) {
    return `${cleanCity}, ${cleanCountry}`;
  }

  return cleanCountry;
}

export function parseEmployeeLocation(location?: string) {
  const cleanLocation = location?.trim();

  if (!cleanLocation) {
    return {
      countryName: "",
      countryCode: "",
      city: "",
    };
  }

  const parts = cleanLocation
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    const countryName = parts[parts.length - 1];
    const city = parts.slice(0, -1).join(", ");
    const country = getCountryByName(countryName);

    return {
      countryName,
      countryCode: country?.code || "",
      city,
    };
  }

  const country = getCountryByName(cleanLocation);

  return {
    countryName: cleanLocation,
    countryCode: country?.code || "",
    city: "",
  };
}

export const employeeSkillOptions: EmployeeSkillOption[] = [
  { label: "HTML", value: "HTML", category: "frontend" },
  { label: "CSS", value: "CSS", category: "frontend" },
  { label: "JavaScript", value: "JavaScript", category: "frontend" },
  { label: "TypeScript", value: "TypeScript", category: "frontend" },
  { label: "React", value: "React", category: "frontend" },
  { label: "Next.js", value: "Next.js", category: "frontend" },
  { label: "Vue.js", value: "Vue.js", category: "frontend" },
  { label: "Nuxt", value: "Nuxt", category: "frontend" },
  { label: "Angular", value: "Angular", category: "frontend" },
  { label: "Svelte", value: "Svelte", category: "frontend" },
  { label: "Tailwind CSS", value: "Tailwind CSS", category: "frontend" },
  {
    label: "Responsive Design",
    value: "Responsive Design",
    category: "frontend",
  },
  { label: "Accessibility", value: "Accessibility", category: "frontend" },
  {
    label: "Frontend Architecture",
    value: "Frontend Architecture",
    category: "frontend",
  },
  {
    label: "Component Design",
    value: "Component Design",
    category: "frontend",
  },
  {
    label: "State Management",
    value: "State Management",
    category: "frontend",
  },
  { label: "Zustand", value: "Zustand", category: "frontend" },
  { label: "Redux", value: "Redux", category: "frontend" },
  { label: "React Query", value: "React Query", category: "frontend" },
  { label: "Framer Motion", value: "Framer Motion", category: "frontend" },
  { label: "Recharts", value: "Recharts", category: "frontend" },

  { label: "Node.js", value: "Node.js", category: "backend" },
  { label: "Express.js", value: "Express.js", category: "backend" },
  { label: "NestJS", value: "NestJS", category: "backend" },
  { label: "REST APIs", value: "REST APIs", category: "backend" },
  { label: "GraphQL", value: "GraphQL", category: "backend" },
  { label: "API Design", value: "API Design", category: "backend" },
  { label: "Authentication", value: "Authentication", category: "backend" },
  { label: "Authorization", value: "Authorization", category: "backend" },
  { label: "JWT", value: "JWT", category: "backend" },
  { label: "OAuth", value: "OAuth", category: "backend" },
  { label: "Database Design", value: "Database Design", category: "backend" },
  { label: "PostgreSQL", value: "PostgreSQL", category: "backend" },
  { label: "MySQL", value: "MySQL", category: "backend" },
  { label: "MongoDB", value: "MongoDB", category: "backend" },
  { label: "Redis", value: "Redis", category: "backend" },
  { label: "Prisma", value: "Prisma", category: "backend" },
  { label: "Drizzle ORM", value: "Drizzle ORM", category: "backend" },
  { label: "Supabase", value: "Supabase", category: "backend" },
  { label: "Firebase", value: "Firebase", category: "backend" },
  { label: "WebSockets", value: "WebSockets", category: "backend" },

  {
    label: "Full-stack Development",
    value: "Full-stack Development",
    category: "fullstack",
  },
  {
    label: "SaaS Architecture",
    value: "SaaS Architecture",
    category: "fullstack",
  },
  {
    label: "Dashboard Development",
    value: "Dashboard Development",
    category: "fullstack",
  },
  {
    label: "Multi-language Apps",
    value: "Multi-language Apps",
    category: "fullstack",
  },
  { label: "Multi-theme UI", value: "Multi-theme UI", category: "fullstack" },
  { label: "App Router", value: "App Router", category: "fullstack" },
  {
    label: "Server Components",
    value: "Server Components",
    category: "fullstack",
  },
  { label: "Server Actions", value: "Server Actions", category: "fullstack" },

  { label: "React Native", value: "React Native", category: "mobile" },
  { label: "Flutter", value: "Flutter", category: "mobile" },
  { label: "Dart", value: "Dart", category: "mobile" },
  { label: "Swift", value: "Swift", category: "mobile" },
  { label: "Kotlin", value: "Kotlin", category: "mobile" },
  { label: "Mobile UI", value: "Mobile UI", category: "mobile" },
  {
    label: "App Store Deployment",
    value: "App Store Deployment",
    category: "mobile",
  },

  { label: "UI Design", value: "UI Design", category: "design" },
  { label: "UX Design", value: "UX Design", category: "design" },
  { label: "UX Research", value: "UX Research", category: "design" },
  { label: "Product Design", value: "Product Design", category: "design" },
  { label: "Design Systems", value: "Design Systems", category: "design" },
  { label: "Wireframing", value: "Wireframing", category: "design" },
  { label: "Prototyping", value: "Prototyping", category: "design" },
  { label: "Figma", value: "Figma", category: "design" },
  { label: "Adobe XD", value: "Adobe XD", category: "design" },
  { label: "Brand Identity", value: "Brand Identity", category: "design" },
  {
    label: "Interaction Design",
    value: "Interaction Design",
    category: "design",
  },
  {
    label: "Usability Testing",
    value: "Usability Testing",
    category: "design",
  },

  {
    label: "Product Management",
    value: "Product Management",
    category: "product",
  },
  { label: "Roadmapping", value: "Roadmapping", category: "product" },
  { label: "Feature Planning", value: "Feature Planning", category: "product" },
  { label: "User Stories", value: "User Stories", category: "product" },
  { label: "Product Strategy", value: "Product Strategy", category: "product" },
  { label: "A/B Testing", value: "A/B Testing", category: "product" },
  {
    label: "Product Analytics",
    value: "Product Analytics",
    category: "product",
  },

  { label: "Manual Testing", value: "Manual Testing", category: "qa" },
  { label: "Automated Testing", value: "Automated Testing", category: "qa" },
  { label: "Unit Testing", value: "Unit Testing", category: "qa" },
  {
    label: "Integration Testing",
    value: "Integration Testing",
    category: "qa",
  },
  { label: "E2E Testing", value: "E2E Testing", category: "qa" },
  { label: "Playwright", value: "Playwright", category: "qa" },
  { label: "Cypress", value: "Cypress", category: "qa" },
  { label: "Jest", value: "Jest", category: "qa" },
  { label: "Vitest", value: "Vitest", category: "qa" },
  { label: "Bug Reporting", value: "Bug Reporting", category: "qa" },
  { label: "Test Plans", value: "Test Plans", category: "qa" },

  { label: "Git", value: "Git", category: "devops" },
  { label: "GitHub", value: "GitHub", category: "devops" },
  { label: "CI/CD", value: "CI/CD", category: "devops" },
  { label: "Docker", value: "Docker", category: "devops" },
  { label: "Kubernetes", value: "Kubernetes", category: "devops" },
  { label: "Linux", value: "Linux", category: "devops" },
  { label: "Nginx", value: "Nginx", category: "devops" },
  { label: "Vercel", value: "Vercel", category: "devops" },
  { label: "AWS", value: "AWS", category: "devops" },
  { label: "Azure", value: "Azure", category: "devops" },
  { label: "Google Cloud", value: "Google Cloud", category: "devops" },
  { label: "Monitoring", value: "Monitoring", category: "devops" },
  { label: "Logging", value: "Logging", category: "devops" },

  { label: "Data Analysis", value: "Data Analysis", category: "data" },
  { label: "SQL", value: "SQL", category: "data" },
  { label: "Python", value: "Python", category: "data" },
  { label: "Pandas", value: "Pandas", category: "data" },
  {
    label: "Data Visualization",
    value: "Data Visualization",
    category: "data",
  },
  {
    label: "Business Intelligence",
    value: "Business Intelligence",
    category: "data",
  },
  { label: "Power BI", value: "Power BI", category: "data" },
  { label: "Tableau", value: "Tableau", category: "data" },
  { label: "ETL", value: "ETL", category: "data" },

  { label: "AI Integration", value: "AI Integration", category: "ai" },
  { label: "Prompt Engineering", value: "Prompt Engineering", category: "ai" },
  { label: "LLM Applications", value: "LLM Applications", category: "ai" },
  { label: "OpenAI API", value: "OpenAI API", category: "ai" },
  { label: "Vector Databases", value: "Vector Databases", category: "ai" },
  { label: "RAG", value: "RAG", category: "ai" },
  { label: "Embeddings", value: "Embeddings", category: "ai" },
  {
    label: "Chatbot Development",
    value: "Chatbot Development",
    category: "ai",
  },
  {
    label: "Automation Workflows",
    value: "Automation Workflows",
    category: "ai",
  },

  {
    label: "Application Security",
    value: "Application Security",
    category: "security",
  },
  {
    label: "Security Reviews",
    value: "Security Reviews",
    category: "security",
  },
  { label: "OWASP", value: "OWASP", category: "security" },
  { label: "Access Control", value: "Access Control", category: "security" },
  { label: "Data Privacy", value: "Data Privacy", category: "security" },

  {
    label: "Team Leadership",
    value: "Team Leadership",
    category: "management",
  },
  {
    label: "Project Management",
    value: "Project Management",
    category: "management",
  },
  { label: "Agile", value: "Agile", category: "management" },
  { label: "Scrum", value: "Scrum", category: "management" },
  {
    label: "Sprint Planning",
    value: "Sprint Planning",
    category: "management",
  },
  {
    label: "Technical Planning",
    value: "Technical Planning",
    category: "management",
  },

  { label: "Operations", value: "Operations", category: "operations" },
  { label: "Scheduling", value: "Scheduling", category: "operations" },
  { label: "Reporting", value: "Reporting", category: "operations" },
  {
    label: "Workflow Management",
    value: "Workflow Management",
    category: "operations",
  },
  {
    label: "Process Improvement",
    value: "Process Improvement",
    category: "operations",
  },
  { label: "Documentation", value: "Documentation", category: "operations" },

  { label: "Sales", value: "Sales", category: "sales" },
  { label: "Lead Generation", value: "Lead Generation", category: "sales" },
  { label: "CRM", value: "CRM", category: "sales" },
  { label: "B2B Sales", value: "B2B Sales", category: "sales" },
  { label: "Negotiation", value: "Negotiation", category: "sales" },

  {
    label: "Digital Marketing",
    value: "Digital Marketing",
    category: "marketing",
  },
  { label: "SEO", value: "SEO", category: "marketing" },
  {
    label: "Content Marketing",
    value: "Content Marketing",
    category: "marketing",
  },
  { label: "Social Media", value: "Social Media", category: "marketing" },
  {
    label: "Performance Marketing",
    value: "Performance Marketing",
    category: "marketing",
  },
  { label: "Email Marketing", value: "Email Marketing", category: "marketing" },

  {
    label: "Client Success",
    value: "Client Success",
    category: "clientSuccess",
  },
  {
    label: "Account Management",
    value: "Account Management",
    category: "clientSuccess",
  },
  {
    label: "Customer Onboarding",
    value: "Customer Onboarding",
    category: "clientSuccess",
  },
  {
    label: "Customer Support",
    value: "Customer Support",
    category: "clientSuccess",
  },
  {
    label: "Client Communication",
    value: "Client Communication",
    category: "clientSuccess",
  },

  { label: "Budgeting", value: "Budgeting", category: "finance" },
  { label: "Invoicing", value: "Invoicing", category: "finance" },
  {
    label: "Financial Reporting",
    value: "Financial Reporting",
    category: "finance",
  },
  { label: "Payroll", value: "Payroll", category: "finance" },

  { label: "Recruiting", value: "Recruiting", category: "hr" },
  { label: "Interviewing", value: "Interviewing", category: "hr" },
  { label: "Employee Relations", value: "Employee Relations", category: "hr" },
  {
    label: "Performance Reviews",
    value: "Performance Reviews",
    category: "hr",
  },
  { label: "Onboarding", value: "Onboarding", category: "hr" },

  {
    label: "Technical Support",
    value: "Technical Support",
    category: "support",
  },
  { label: "Help Desk", value: "Help Desk", category: "support" },
  { label: "Troubleshooting", value: "Troubleshooting", category: "support" },
  { label: "Customer Tickets", value: "Customer Tickets", category: "support" },

  { label: "Communication", value: "Communication", category: "softSkills" },
  {
    label: "Problem Solving",
    value: "Problem Solving",
    category: "softSkills",
  },
  {
    label: "Critical Thinking",
    value: "Critical Thinking",
    category: "softSkills",
  },
  { label: "Collaboration", value: "Collaboration", category: "softSkills" },
  {
    label: "Time Management",
    value: "Time Management",
    category: "softSkills",
  },
  { label: "Adaptability", value: "Adaptability", category: "softSkills" },
  {
    label: "Attention to Detail",
    value: "Attention to Detail",
    category: "softSkills",
  },
];
const employeeSkillArabicLabels: Record<string, string> = {
  HTML: "HTML",
  CSS: "CSS",
  JavaScript: "JavaScript",
  TypeScript: "TypeScript",
  React: "React",
  "Next.js": "Next.js",
  "Vue.js": "Vue.js",
  Nuxt: "Nuxt",
  Angular: "Angular",
  Svelte: "Svelte",
  "Tailwind CSS": "Tailwind CSS",
  "Responsive Design": "تصميم متجاوب",
  Accessibility: "إتاحة الوصول",
  "Frontend Architecture": "معمارية الواجهات الأمامية",
  "Component Design": "تصميم المكونات",
  "State Management": "إدارة الحالة",
  Zustand: "Zustand",
  Redux: "Redux",
  "React Query": "React Query",
  "Framer Motion": "Framer Motion",
  Recharts: "Recharts",

  "Node.js": "Node.js",
  "Express.js": "Express.js",
  NestJS: "NestJS",
  "REST APIs": "REST APIs",
  GraphQL: "GraphQL",
  "API Design": "تصميم واجهات API",
  Authentication: "المصادقة",
  Authorization: "الصلاحيات",
  JWT: "JWT",
  OAuth: "OAuth",
  "Database Design": "تصميم قواعد البيانات",
  PostgreSQL: "PostgreSQL",
  MySQL: "MySQL",
  MongoDB: "MongoDB",
  Redis: "Redis",
  Prisma: "Prisma",
  "Drizzle ORM": "Drizzle ORM",
  Supabase: "Supabase",
  Firebase: "Firebase",
  WebSockets: "WebSockets",

  "Full-stack Development": "تطوير Full-stack",
  "SaaS Architecture": "معمارية SaaS",
  "Dashboard Development": "تطوير لوحات التحكم",
  "Multi-language Apps": "تطبيقات متعددة اللغات",
  "Multi-theme UI": "واجهات متعددة الثيمات",
  "App Router": "App Router",
  "Server Components": "Server Components",
  "Server Actions": "Server Actions",

  "React Native": "React Native",
  Flutter: "Flutter",
  Dart: "Dart",
  Swift: "Swift",
  Kotlin: "Kotlin",
  "Mobile UI": "واجهات الموبايل",
  "App Store Deployment": "نشر التطبيقات على المتاجر",

  "UI Design": "تصميم واجهات المستخدم",
  "UX Design": "تصميم تجربة المستخدم",
  "UX Research": "بحث تجربة المستخدم",
  "Product Design": "تصميم المنتج",
  "Design Systems": "أنظمة التصميم",
  Wireframing: "رسم النماذج الأولية",
  Prototyping: "النماذج التفاعلية",
  Figma: "Figma",
  "Adobe XD": "Adobe XD",
  "Brand Identity": "هوية العلامة التجارية",
  "Interaction Design": "تصميم التفاعل",
  "Usability Testing": "اختبار قابلية الاستخدام",

  "Product Management": "إدارة المنتج",
  Roadmapping: "خارطة الطريق",
  "Feature Planning": "تخطيط المزايا",
  "User Stories": "قصص المستخدم",
  "Product Strategy": "استراتيجية المنتج",
  "A/B Testing": "اختبار A/B",
  "Product Analytics": "تحليلات المنتج",

  "Manual Testing": "اختبار يدوي",
  "Automated Testing": "اختبار آلي",
  "Unit Testing": "اختبار الوحدات",
  "Integration Testing": "اختبار التكامل",
  "E2E Testing": "اختبار شامل E2E",
  Playwright: "Playwright",
  Cypress: "Cypress",
  Jest: "Jest",
  Vitest: "Vitest",
  "Bug Reporting": "تسجيل الأخطاء",
  "Test Plans": "خطط الاختبار",

  Git: "Git",
  GitHub: "GitHub",
  "CI/CD": "CI/CD",
  Docker: "Docker",
  Kubernetes: "Kubernetes",
  Linux: "Linux",
  Nginx: "Nginx",
  Vercel: "Vercel",
  AWS: "AWS",
  Azure: "Azure",
  "Google Cloud": "Google Cloud",
  Monitoring: "المراقبة",
  Logging: "تسجيل السجلات",

  "Data Analysis": "تحليل البيانات",
  SQL: "SQL",
  Python: "Python",
  Pandas: "Pandas",
  "Data Visualization": "تصور البيانات",
  "Business Intelligence": "ذكاء الأعمال",
  "Power BI": "Power BI",
  Tableau: "Tableau",
  ETL: "ETL",

  "AI Integration": "تكامل الذكاء الاصطناعي",
  "Prompt Engineering": "هندسة الأوامر",
  "LLM Applications": "تطبيقات النماذج اللغوية",
  "OpenAI API": "OpenAI API",
  "Vector Databases": "قواعد البيانات المتجهية",
  RAG: "RAG",
  Embeddings: "Embeddings",
  "Chatbot Development": "تطوير روبوتات المحادثة",
  "Automation Workflows": "سير عمل الأتمتة",

  "Application Security": "أمان التطبيقات",
  "Security Reviews": "مراجعات الأمان",
  OWASP: "OWASP",
  "Access Control": "التحكم في الوصول",
  "Data Privacy": "خصوصية البيانات",

  "Team Leadership": "قيادة الفريق",
  "Project Management": "إدارة المشاريع",
  Agile: "Agile",
  Scrum: "Scrum",
  "Sprint Planning": "تخطيط السبرنت",
  "Technical Planning": "التخطيط التقني",

  Operations: "العمليات",
  Scheduling: "الجدولة",
  Reporting: "التقارير",
  "Workflow Management": "إدارة سير العمل",
  "Process Improvement": "تحسين العمليات",
  Documentation: "التوثيق",

  Sales: "المبيعات",
  "Lead Generation": "توليد العملاء المحتملين",
  CRM: "CRM",
  "B2B Sales": "مبيعات B2B",
  Negotiation: "التفاوض",

  "Digital Marketing": "التسويق الرقمي",
  SEO: "SEO",
  "Content Marketing": "تسويق المحتوى",
  "Social Media": "وسائل التواصل الاجتماعي",
  "Performance Marketing": "تسويق الأداء",
  "Email Marketing": "التسويق عبر البريد الإلكتروني",

  "Client Success": "نجاح العملاء",
  "Account Management": "إدارة الحسابات",
  "Customer Onboarding": "تهيئة العملاء",
  "Customer Support": "دعم العملاء",
  "Client Communication": "التواصل مع العملاء",

  Budgeting: "إعداد الميزانية",
  Invoicing: "الفوترة",
  "Financial Reporting": "التقارير المالية",
  Payroll: "الرواتب",

  Recruiting: "التوظيف",
  Interviewing: "إجراء المقابلات",
  "Employee Relations": "علاقات الموظفين",
  "Performance Reviews": "مراجعات الأداء",
  Onboarding: "تهيئة الموظفين",

  "Technical Support": "الدعم الفني",
  "Help Desk": "مكتب المساعدة",
  Troubleshooting: "استكشاف الأخطاء وإصلاحها",
  "Customer Tickets": "تذاكر العملاء",

  Communication: "التواصل",
  "Problem Solving": "حل المشكلات",
  "Critical Thinking": "التفكير النقدي",
  Collaboration: "التعاون",
  "Time Management": "إدارة الوقت",
  Adaptability: "المرونة",
  "Attention to Detail": "الاهتمام بالتفاصيل",
};
export function getEmployeeSkillLabel(
  skill: string,
  locale: EmployeeSkillLocale,
) {
  if (locale === "ar") {
    return employeeSkillArabicLabels[skill] || skill;
  }

  return skill;
}

export function getCountryLabel(country: CountryOption) {
  return `${country.flag} ${country.name} ${country.dialCode}`;
}

export function getCountrySearchText(country: CountryOption) {
  return `${country.name} ${country.code} ${country.dialCode}`.toLowerCase();
}

export function getSkillSearchText(skill: EmployeeSkillOption) {
  const arabicLabel = employeeSkillArabicLabels[skill.value] || "";

  return `${skill.label} ${skill.value} ${arabicLabel} ${skill.category}`.toLowerCase();
}

export function normalizeOptionSearch(value: string) {
  return value.trim().toLowerCase();
}

export const employeeSkillLimits = {
  maxSkills: 8,
} as const;

type EmployeeSkillSuggestionInput = {
  department?: string;
  role?: string;
  selectedSkills?: string[];
  query?: string;
  limit?: number;
};

const defaultSkillCategories: EmployeeSkillCategory[] = [
  "softSkills",
  "management",
];

const departmentSkillCategoryMap: Record<string, EmployeeSkillCategory[]> = {
  engineering: ["frontend", "backend", "fullstack", "devops", "qa", "security"],
  frontend: ["frontend", "design", "qa", "softSkills"],
  backend: ["backend", "devops", "security", "data"],
  "full stack": ["fullstack", "frontend", "backend", "devops"],
  mobile: ["mobile", "frontend", "qa"],
  design: ["design", "product", "softSkills"],
  product: ["product", "management", "data", "softSkills"],
  "quality assurance": ["qa", "softSkills"],
  devops: ["devops", "security", "backend"],
  data: ["data", "ai", "backend"],
  ai: ["ai", "data", "backend"],
  security: ["security", "backend", "devops"],
  operations: ["operations", "management", "softSkills"],
  "client success": ["clientSuccess", "support", "sales", "softSkills"],
  sales: ["sales", "marketing", "clientSuccess", "softSkills"],
  marketing: ["marketing", "sales", "data", "softSkills"],
  finance: ["finance", "operations", "softSkills"],
  hr: ["hr", "operations", "softSkills"],
  support: ["support", "clientSuccess", "softSkills"],
  legal: ["operations", "softSkills"],
};

const roleSkillCategoryRules = [
  {
    keywords: ["product designer", "ui", "ux", "designer", "figma"],
    categories: ["design", "product", "softSkills"],
  },
  {
    keywords: ["frontend", "react", "next", "ui engineer"],
    categories: ["frontend", "design", "qa"],
  },
  {
    keywords: ["backend", "api", "server", "database"],
    categories: ["backend", "security", "devops"],
  },
  {
    keywords: ["full stack", "fullstack"],
    categories: ["fullstack", "frontend", "backend"],
  },
  {
    keywords: ["mobile", "ios", "android", "flutter", "react native"],
    categories: ["mobile", "frontend", "qa"],
  },
  {
    keywords: ["qa", "tester", "quality"],
    categories: ["qa", "softSkills"],
  },
  {
    keywords: ["devops", "cloud", "infrastructure"],
    categories: ["devops", "security", "backend"],
  },
  {
    keywords: ["data", "analyst", "analytics"],
    categories: ["data", "ai", "operations"],
  },
  {
    keywords: ["ai", "machine learning", "ml", "automation"],
    categories: ["ai", "data", "backend"],
  },
  {
    keywords: ["manager", "lead", "head", "owner"],
    categories: ["management", "operations", "softSkills"],
  },
  {
    keywords: ["sales", "account"],
    categories: ["sales", "clientSuccess", "softSkills"],
  },
  {
    keywords: ["marketing", "seo", "content", "social"],
    categories: ["marketing", "data", "softSkills"],
  },
  {
    keywords: ["support", "help desk", "customer"],
    categories: ["support", "clientSuccess", "softSkills"],
  },
  {
    keywords: ["hr", "recruiter", "people"],
    categories: ["hr", "operations", "softSkills"],
  },
  {
    keywords: ["finance", "accountant", "payroll"],
    categories: ["finance", "operations", "softSkills"],
  },
] satisfies {
  keywords: string[];
  categories: EmployeeSkillCategory[];
}[];

function uniqueSkillCategories(categories: EmployeeSkillCategory[]) {
  return Array.from(new Set(categories));
}

function getDepartmentSkillCategories(department?: string) {
  const normalizedDepartment = normalizeOptionSearch(department || "");

  if (!normalizedDepartment) return [];

  const directCategories = departmentSkillCategoryMap[normalizedDepartment];

  if (directCategories) return directCategories;

  const matchedEntry = Object.entries(departmentSkillCategoryMap).find(
    ([departmentKey]) =>
      normalizedDepartment.includes(departmentKey) ||
      departmentKey.includes(normalizedDepartment),
  );

  return matchedEntry?.[1] || [];
}

function getRoleSkillCategories(role?: string) {
  const normalizedRole = normalizeOptionSearch(role || "");

  if (!normalizedRole) return [];

  return roleSkillCategoryRules
    .filter((rule) =>
      rule.keywords.some((keyword) => normalizedRole.includes(keyword)),
    )
    .flatMap((rule) => rule.categories);
}

export function getEmployeePreferredSkillCategories({
  department,
  role,
}: {
  department?: string;
  role?: string;
}) {
  return uniqueSkillCategories([
    ...getDepartmentSkillCategories(department),
    ...getRoleSkillCategories(role),
    ...defaultSkillCategories,
  ]);
}

export function normalizeEmployeeSkillKey(value: string) {
  return normalizeOptionSearch(value);
}

export function normalizeEmployeeSkills(
  skills: string[],
  maxSkills = employeeSkillLimits.maxSkills,
) {
  const seenSkills = new Set<string>();

  return skills
    .map((skill) => skill.trim())
    .filter(Boolean)
    .filter((skill) => {
      const skillKey = normalizeEmployeeSkillKey(skill);

      if (seenSkills.has(skillKey)) return false;

      seenSkills.add(skillKey);
      return true;
    })
    .slice(0, maxSkills);
}

export function getEmployeeSkillSuggestions({
  department,
  role,
  selectedSkills = [],
  query = "",
  limit = 16,
}: EmployeeSkillSuggestionInput) {
  const preferredCategories = getEmployeePreferredSkillCategories({
    department,
    role,
  });

  const preferredCategorySet = new Set(preferredCategories);
  const selectedSkillSet = new Set(
    selectedSkills.map((skill) => normalizeEmployeeSkillKey(skill)),
  );
  const normalizedQuery = normalizeOptionSearch(query);

  return employeeSkillOptions
    .filter(
      (skill) => !selectedSkillSet.has(normalizeEmployeeSkillKey(skill.value)),
    )
    .filter((skill) => {
      if (!normalizedQuery) return true;

      return getSkillSearchText(skill).includes(normalizedQuery);
    })
    .map((skill) => {
      let score = 0;

      if (preferredCategorySet.has(skill.category)) {
        score += 30;
      }

      if (skill.category === "softSkills") {
        score += 5;
      }

      if (normalizedQuery) {
        const label = normalizeOptionSearch(skill.label);

        if (label.startsWith(normalizedQuery)) score += 20;
        if (label.includes(normalizedQuery)) score += 10;
        if (skill.category.includes(normalizedQuery)) score += 6;
      }

      return { skill, score };
    })
    .sort((firstItem, secondItem) => {
      if (secondItem.score !== firstItem.score) {
        return secondItem.score - firstItem.score;
      }

      return firstItem.skill.label.localeCompare(secondItem.skill.label);
    })
    .slice(0, limit)
    .map((item) => item.skill);
}
