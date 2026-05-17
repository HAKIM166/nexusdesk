import { Country } from "react-phone-number-input";

export type EmployeeLocationCountry = {
  name: string;
  code: Country;
  cities: string[];
};

export type ParsedEmployeeLocation = {
  countryCode: string;
  city: string;
};

export type EmployeeLocationLocale = "ar" | "en";

export const employeeLocationCountries: EmployeeLocationCountry[] = [
  {
    name: "Egypt",
    code: "EG",
    cities: [
      "Cairo",
      "Giza",
      "Alexandria",
      "Dakahlia",
      "Sharqia",
      "Gharbia",
      "Monufia",
      "Qalyubia",
      "Beheira",
      "Kafr El Sheikh",
      "Damietta",
      "Port Said",
      "Suez",
      "Ismailia",
      "Fayoum",
      "Beni Suef",
      "Minya",
      "Assiut",
      "Sohag",
      "Qena",
      "Luxor",
      "Aswan",
      "Red Sea",
      "New Valley",
      "Matrouh",
      "North Sinai",
      "South Sinai",
    ],
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    cities: [
      "Riyadh",
      "Jeddah",
      "Makkah",
      "Madinah",
      "Dammam",
      "Khobar",
      "Taif",
      "Tabuk",
      "Abha",
      "Jazan",
      "Hail",
      "Najran",
      "Al Ahsa",
      "Qassim",
    ],
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    cities: [
      "Dubai",
      "Abu Dhabi",
      "Sharjah",
      "Ajman",
      "Ras Al Khaimah",
      "Fujairah",
      "Umm Al Quwain",
    ],
  },
  {
    name: "Kuwait",
    code: "KW",
    cities: [
      "Kuwait City",
      "Hawalli",
      "Farwaniya",
      "Ahmadi",
      "Jahra",
      "Mubarak Al-Kabeer",
    ],
  },
  {
    name: "Qatar",
    code: "QA",
    cities: ["Doha", "Al Rayyan", "Al Wakrah", "Umm Salal", "Al Khor"],
  },
  {
    name: "Bahrain",
    code: "BH",
    cities: ["Manama", "Muharraq", "Riffa", "Hamad Town", "Isa Town"],
  },
  {
    name: "Oman",
    code: "OM",
    cities: ["Muscat", "Salalah", "Sohar", "Nizwa", "Sur", "Ibri"],
  },
  {
    name: "Jordan",
    code: "JO",
    cities: ["Amman", "Zarqa", "Irbid", "Aqaba", "Madaba", "Karak"],
  },
  {
    name: "Lebanon",
    code: "LB",
    cities: ["Beirut", "Tripoli", "Sidon", "Tyre", "Zahle", "Byblos"],
  },
  {
    name: "Palestine",
    code: "PS",
    cities: ["Ramallah", "Gaza", "Nablus", "Hebron", "Bethlehem", "Jenin"],
  },
  {
    name: "Iraq",
    code: "IQ",
    cities: ["Baghdad", "Basra", "Mosul", "Erbil", "Najaf", "Karbala"],
  },
  {
    name: "Syria",
    code: "SY",
    cities: ["Damascus", "Aleppo", "Homs", "Hama", "Latakia", "Tartus"],
  },
  {
    name: "Yemen",
    code: "YE",
    cities: ["Sana'a", "Aden", "Taiz", "Hadhramaut", "Ibb", "Hodeidah"],
  },
  {
    name: "Morocco",
    code: "MA",
    cities: [
      "Casablanca",
      "Rabat",
      "Marrakesh",
      "Fes",
      "Tangier",
      "Agadir",
      "Meknes",
    ],
  },
  {
    name: "Algeria",
    code: "DZ",
    cities: [
      "Algiers",
      "Oran",
      "Constantine",
      "Annaba",
      "Blida",
      "Setif",
      "Batna",
    ],
  },
  {
    name: "Tunisia",
    code: "TN",
    cities: ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabes"],
  },
  {
    name: "Libya",
    code: "LY",
    cities: ["Tripoli", "Benghazi", "Misrata", "Zawiya", "Sabha", "Derna"],
  },
  {
    name: "Sudan",
    code: "SD",
    cities: [
      "Khartoum",
      "Omdurman",
      "Port Sudan",
      "Kassala",
      "El Obeid",
      "Wad Madani",
    ],
  },
  {
    name: "United States",
    code: "US",
    cities: [
      "New York",
      "California",
      "Texas",
      "Florida",
      "Illinois",
      "Washington",
    ],
  },
  {
    name: "United Kingdom",
    code: "GB",
    cities: [
      "London",
      "Manchester",
      "Birmingham",
      "Liverpool",
      "Leeds",
      "Glasgow",
    ],
  },
];

const employeeLocationCountryArabicLabels: Partial<Record<Country, string>> = {
  EG: "مصر",
  SA: "السعودية",
  AE: "الإمارات",
  KW: "الكويت",
  QA: "قطر",
  BH: "البحرين",
  OM: "عمان",
  JO: "الأردن",
  LB: "لبنان",
  PS: "فلسطين",
  IQ: "العراق",
  SY: "سوريا",
  YE: "اليمن",
  MA: "المغرب",
  DZ: "الجزائر",
  TN: "تونس",
  LY: "ليبيا",
  SD: "السودان",
  US: "الولايات المتحدة",
  GB: "المملكة المتحدة",
};

const employeeLocationCityArabicLabels: Record<string, string> = {
  Cairo: "القاهرة",
  Giza: "الجيزة",
  Alexandria: "الإسكندرية",
  Dakahlia: "الدقهلية",
  Sharqia: "الشرقية",
  Gharbia: "الغربية",
  Monufia: "المنوفية",
  Qalyubia: "القليوبية",
  Beheira: "البحيرة",
  "Kafr El Sheikh": "كفر الشيخ",
  Damietta: "دمياط",
  "Port Said": "بورسعيد",
  Suez: "السويس",
  Ismailia: "الإسماعيلية",
  Fayoum: "الفيوم",
  "Beni Suef": "بني سويف",
  Minya: "المنيا",
  Assiut: "أسيوط",
  Sohag: "سوهاج",
  Qena: "قنا",
  Luxor: "الأقصر",
  Aswan: "أسوان",
  "Red Sea": "البحر الأحمر",
  "New Valley": "الوادي الجديد",
  Matrouh: "مطروح",
  "North Sinai": "شمال سيناء",
  "South Sinai": "جنوب سيناء",

  Riyadh: "الرياض",
  Jeddah: "جدة",
  Makkah: "مكة",
  Madinah: "المدينة",
  Dammam: "الدمام",
  Khobar: "الخبر",
  Taif: "الطائف",
  Tabuk: "تبوك",
  Abha: "أبها",
  Jazan: "جازان",
  Hail: "حائل",
  Najran: "نجران",
  "Al Ahsa": "الأحساء",
  Qassim: "القصيم",

  Dubai: "دبي",
  "Abu Dhabi": "أبو ظبي",
  Sharjah: "الشارقة",
  Ajman: "عجمان",
  "Ras Al Khaimah": "رأس الخيمة",
  Fujairah: "الفجيرة",
  "Umm Al Quwain": "أم القيوين",

  "Kuwait City": "مدينة الكويت",
  Hawalli: "حولي",
  Farwaniya: "الفروانية",
  Ahmadi: "الأحمدي",
  Jahra: "الجهراء",
  "Mubarak Al-Kabeer": "مبارك الكبير",

  Doha: "الدوحة",
  "Al Rayyan": "الريان",
  "Al Wakrah": "الوكرة",
  "Umm Salal": "أم صلال",
  "Al Khor": "الخور",

  Manama: "المنامة",
  Muharraq: "المحرق",
  Riffa: "الرفاع",
  "Hamad Town": "مدينة حمد",
  "Isa Town": "مدينة عيسى",

  Muscat: "مسقط",
  Salalah: "صلالة",
  Sohar: "صحار",
  Nizwa: "نزوى",
  Sur: "صور",
  Ibri: "عبري",

  Amman: "عمّان",
  Zarqa: "الزرقاء",
  Irbid: "إربد",
  Aqaba: "العقبة",
  Madaba: "مادبا",
  Karak: "الكرك",

  Beirut: "بيروت",
  Tripoli: "طرابلس",
  Sidon: "صيدا",
  Tyre: "صور",
  Zahle: "زحلة",
  Byblos: "جبيل",

  Ramallah: "رام الله",
  Gaza: "غزة",
  Nablus: "نابلس",
  Hebron: "الخليل",
  Bethlehem: "بيت لحم",
  Jenin: "جنين",

  Baghdad: "بغداد",
  Basra: "البصرة",
  Mosul: "الموصل",
  Erbil: "أربيل",
  Najaf: "النجف",
  Karbala: "كربلاء",

  Damascus: "دمشق",
  Aleppo: "حلب",
  Homs: "حمص",
  Hama: "حماة",
  Latakia: "اللاذقية",
  Tartus: "طرطوس",

  "Sana'a": "صنعاء",
  Aden: "عدن",
  Taiz: "تعز",
  Hadhramaut: "حضرموت",
  Ibb: "إب",
  Hodeidah: "الحديدة",

  Casablanca: "الدار البيضاء",
  Rabat: "الرباط",
  Marrakesh: "مراكش",
  Fes: "فاس",
  Tangier: "طنجة",
  Agadir: "أكادير",
  Meknes: "مكناس",

  Algiers: "الجزائر",
  Oran: "وهران",
  Constantine: "قسنطينة",
  Annaba: "عنابة",
  Blida: "البليدة",
  Setif: "سطيف",
  Batna: "باتنة",

  Tunis: "تونس",
  Sfax: "صفاقس",
  Sousse: "سوسة",
  Kairouan: "القيروان",
  Bizerte: "بنزرت",
  Gabes: "قابس",

  Benghazi: "بنغازي",
  Misrata: "مصراتة",
  Zawiya: "الزاوية",
  Sabha: "سبها",
  Derna: "درنة",

  Khartoum: "الخرطوم",
  Omdurman: "أم درمان",
  "Port Sudan": "بورتسودان",
  Kassala: "كسلا",
  "El Obeid": "الأبيض",
  "Wad Madani": "ود مدني",

  "New York": "نيويورك",
  California: "كاليفورنيا",
  Texas: "تكساس",
  Florida: "فلوريدا",
  Illinois: "إلينوي",
  Washington: "واشنطن",

  London: "لندن",
  Manchester: "مانشستر",
  Birmingham: "برمنغهام",
  Liverpool: "ليفربول",
  Leeds: "ليدز",
  Glasgow: "غلاسكو",
};

function normalizeLocationValue(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getEmployeeLocationCountryByCode(countryCode?: string) {
  if (!countryCode) return undefined;

  return employeeLocationCountries.find(
    (country) => country.code === countryCode,
  );
}

export function getEmployeeLocationCountryByName(countryName?: string) {
  if (!countryName) return undefined;

  const normalizedCountryName = normalizeLocationValue(countryName);

  return employeeLocationCountries.find(
    (country) => normalizeLocationValue(country.name) === normalizedCountryName,
  );
}

export function getEmployeeLocationCountryLabel(
  country: EmployeeLocationCountry,
  locale: EmployeeLocationLocale,
) {
  if (locale === "ar") {
    return employeeLocationCountryArabicLabels[country.code] || country.name;
  }

  return country.name;
}

export function getEmployeeLocationCityLabel(
  city: string,
  locale: EmployeeLocationLocale,
) {
  if (locale === "ar") {
    return employeeLocationCityArabicLabels[city] || city;
  }

  return city;
}

export function parseEmployeeLocation(
  location?: string,
): ParsedEmployeeLocation {
  const cleanLocation = location?.trim();

  if (!cleanLocation) {
    return {
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
    const country = getEmployeeLocationCountryByName(countryName);

    return {
      countryCode: country?.code || "",
      city,
    };
  }

  const country = getEmployeeLocationCountryByName(cleanLocation);

  if (country) {
    return {
      countryCode: country.code,
      city: "",
    };
  }

  return {
    countryCode: "",
    city: cleanLocation,
  };
}

export function buildEmployeeLocation(countryCode: string, city: string) {
  const country = getEmployeeLocationCountryByCode(countryCode);
  const cleanCity = city.trim();

  if (country && cleanCity) {
    return `${cleanCity}, ${country.name}`;
  }

  if (country) {
    return country.name;
  }

  return cleanCity;
}
