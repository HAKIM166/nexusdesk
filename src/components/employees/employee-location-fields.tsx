"use client";

import { useMemo } from "react";
import { Country } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import EmployeeOptionCombobox, {
  EmployeeComboboxOption,
} from "@/components/employees/employee-option-combobox";
import {
  buildEmployeeLocation,
  employeeLocationCountries,
  getEmployeeLocationCityLabel,
  getEmployeeLocationCountryByCode,
  getEmployeeLocationCountryLabel,
} from "@/data/employee-location-options";

type EmployeeLocationFieldsLabels = {
  location: string;
  country: string;
  city: string;
  optional: string;
  searchCountry: string;
  searchCity: string;
  noCountryResults: string;
  noCityResults: string;
};

type EmployeeLocationFieldsProps = {
  countryCode: string;
  city: string;
  isArabic: boolean;
  labels: EmployeeLocationFieldsLabels;
  onCountryChange: (countryCode: string) => void;
  onCityChange: (city: string) => void;
};

function getCountryFlag(countryCode: Country) {
  const FlagComponent = flags[countryCode];

  if (!FlagComponent) return null;

  return (
    <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-sm shadow-[0_0_0_1px_var(--employee-card-border)]">
      <FlagComponent title={countryCode} />
    </span>
  );
}

export default function EmployeeLocationFields({
  countryCode,
  city,
  isArabic,
  labels,
  onCountryChange,
  onCityChange,
}: EmployeeLocationFieldsProps) {
  const selectedCountry = getEmployeeLocationCountryByCode(countryCode);
  const selectedLocation = buildEmployeeLocation(countryCode, city);
  const locationLocale = isArabic ? "ar" : "en";

  const countryOptions = useMemo<EmployeeComboboxOption[]>(() => {
    return employeeLocationCountries.map((country) => {
      const label = getEmployeeLocationCountryLabel(country, locationLocale);

      return {
        label,
        value: country.code,
        icon: getCountryFlag(country.code),
        searchText: `${country.name} ${label} ${country.code}`,
      };
    });
  }, [locationLocale]);

  const cityOptions = useMemo<EmployeeComboboxOption[]>(() => {
    if (!selectedCountry) return [];

    return selectedCountry.cities.map((cityOption) => {
      const label = getEmployeeLocationCityLabel(cityOption, locationLocale);

      return {
        label,
        value: cityOption,
        searchText: `${cityOption} ${label}`,
      };
    });
  }, [selectedCountry, locationLocale]);

  return (
    <div className="rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--background)]/40 p-3 md:rounded-2xl md:p-4">
      <input name="location" value={selectedLocation} readOnly hidden />

      <div className="mb-3 flex items-center justify-between gap-3 md:mb-4">
        <span className="text-xs font-semibold text-[color:var(--foreground)] md:text-sm">
          {labels.location}
        </span>

        <span className="text-[11px] font-normal text-[color:var(--foreground-muted)] md:text-xs">
          {labels.optional}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        <EmployeeOptionCombobox
          name="locationCountry"
          label={labels.country}
          value={countryCode}
          options={countryOptions}
          placeholder={labels.searchCountry}
          emptyText={labels.noCountryResults}
          optionalText={labels.optional}
          maxVisibleOptions={30}
          onChange={onCountryChange}
        />

        <EmployeeOptionCombobox
          name="locationCity"
          label={labels.city}
          value={city}
          options={cityOptions}
          placeholder={labels.searchCity}
          emptyText={countryCode ? labels.noCityResults : labels.searchCountry}
          optionalText={labels.optional}
          maxVisibleOptions={40}
          onChange={onCityChange}
        />
      </div>
    </div>
  );
}