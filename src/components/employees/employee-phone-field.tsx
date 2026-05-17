"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import type { ComponentProps } from "react";
import type { Country } from "react-phone-number-input";
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import PhoneInput from "react-phone-number-input/input";
import flags from "react-phone-number-input/flags";
import { Check, ChevronDown, Search } from "lucide-react";

import { countries } from "@/data/employee-options";

type PhoneInputProps = ComponentProps<typeof PhoneInput>;
type PhoneFieldValue = PhoneInputProps["value"];
type PhoneInputChangeHandler = NonNullable<PhoneInputProps["onChange"]>;

type EmployeePhoneFieldProps = {
  label: string;
  value?: string;
  isArabic: boolean;
  optionalText?: string;
  placeholder?: string;
  searchCountryPlaceholder: string;
  invalidText: string;
  possibleText?: string;
  onValidityChange?: (isValid: boolean) => void;
};

type PhoneCountryOption = {
  name: string;
  code: Country;
  dialCode: string;
};

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

type PhoneState = {
  value: PhoneFieldValue;
  selectedCountry: Country;
};

type PhoneStateAction =
  | {
      type: "reset";
      value: PhoneFieldValue;
      selectedCountry: Country;
    }
  | {
      type: "phone";
      value: PhoneFieldValue;
    }
  | {
      type: "country";
      selectedCountry: Country;
    };

const defaultCountry: Country = "EG";
const phoneCountryDisplayNames = {
  ar: new Intl.DisplayNames(["ar"], { type: "region" }),
  en: new Intl.DisplayNames(["en"], { type: "region" }),
};

function phoneStateReducer(
  state: PhoneState,
  action: PhoneStateAction,
): PhoneState {
  switch (action.type) {
    case "reset":
      return {
        value: action.value,
        selectedCountry: action.selectedCountry,
      };

    case "phone":
      return {
        ...state,
        value: action.value,
      };

    case "country":
      return {
        value: undefined,
        selectedCountry: action.selectedCountry,
      };

    default:
      return state;
  }
}

function hasPhoneValue(value: PhoneFieldValue): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

function normalizePhoneInputValue(value?: string) {
  const cleanValue = value?.trim();

  if (!cleanValue) return "";

  if (!cleanValue.startsWith("+")) {
    return cleanValue.replace(/[^\d]/g, "");
  }

  return `+${cleanValue.slice(1).replace(/[^\d]/g, "")}`;
}

function toPhoneFieldValue(value?: string): PhoneFieldValue {
  const normalizedValue = normalizePhoneInputValue(value);

  if (!normalizedValue) return undefined;

  return normalizedValue as PhoneFieldValue;
}

function getInitialCountry(value?: string): Country {
  const normalizedValue = normalizePhoneInputValue(value);

  if (!normalizedValue) return defaultCountry;

  const matchedCountry = countries
    .filter((country) => country.code.length === 2)
    .sort((firstCountry, secondCountry) => {
      return secondCountry.dialCode.length - firstCountry.dialCode.length;
    })
    .find((country) => normalizedValue.startsWith(country.dialCode));

  return (matchedCountry?.code as Country) || defaultCountry;
}

function getCountryOptions(): PhoneCountryOption[] {
  return countries
    .filter((country) => country.code.length === 2)
    .map((country) => ({
      name: country.name,
      code: country.code as Country,
      dialCode: country.dialCode,
    }));
}

function getPhoneCountryLabel(
  country: PhoneCountryOption,
  locale: "ar" | "en",
) {
  return phoneCountryDisplayNames[locale].of(country.code) || country.name;
}

function getCountryFlag(countryCode: Country) {
  const FlagComponent = flags[countryCode];

  if (!FlagComponent) return null;

  return (
    <span className="inline-flex size-5 shrink-0 items-center justify-center overflow-hidden">
      <FlagComponent title={countryCode} />
    </span>
  );
}

export default function EmployeePhoneField({
  label,
  value,
  isArabic,
  optionalText,
  placeholder = "Enter phone number",
  searchCountryPlaceholder,
  invalidText,
  possibleText,
  onValidityChange,
}: EmployeePhoneFieldProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const countryButtonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [phoneState, dispatchPhoneState] = useReducer(phoneStateReducer, {
    value: toPhoneFieldValue(value),
    selectedCountry: getInitialCountry(value),
  });

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition | null>(null);

  const countryOptions = useMemo(() => getCountryOptions(), []);
  const countryLocale = isArabic ? "ar" : "en";

  useEffect(() => {
    dispatchPhoneState({
      type: "reset",
      value: toPhoneFieldValue(value),
      selectedCountry: getInitialCountry(value),
    });
  }, [value]);

  const selectedCountryOption = useMemo(() => {
    return (
      countryOptions.find(
        (country) => country.code === phoneState.selectedCountry,
      ) || countryOptions.find((country) => country.code === defaultCountry)
    );
  }, [countryOptions, phoneState.selectedCountry]);

  const filteredCountryOptions = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(searchValue);

    if (!normalizedSearch) {
      return countryOptions.slice(0, 80);
    }

    return countryOptions
      .filter((country) => {
        const countryLabel = getPhoneCountryLabel(country, countryLocale);
        const searchText = normalizeSearchValue(
          `${country.name} ${countryLabel} ${country.code} ${country.dialCode}`,
        );

        return searchText.includes(normalizedSearch);
      })
      .slice(0, 80);
  }, [countryLocale, countryOptions, searchValue]);

  const validationState = useMemo(() => {
    if (!hasPhoneValue(phoneState.value)) {
      return {
        hasValue: false,
        isPossible: true,
        isValid: true,
      };
    }

    return {
      hasValue: true,
      isPossible: isPossiblePhoneNumber(phoneState.value),
      isValid: isValidPhoneNumber(phoneState.value),
    };
  }, [phoneState.value]);

  const showError =
    validationState.hasValue &&
    (!validationState.isPossible || !validationState.isValid);

  const updateDropdownPosition = () => {
    const button = countryButtonRef.current;

    if (!button) return;

    const rect = button.getBoundingClientRect();
    const viewportPadding = window.innerWidth < 640 ? 12 : 18;
    const preferredWidth = window.innerWidth < 640 ? window.innerWidth - 24 : 320;
    const dropdownWidth = Math.max(
      rect.width,
      Math.min(320, preferredWidth),
    );

    const safeLeft = Math.min(
      Math.max(viewportPadding, rect.left),
      window.innerWidth - dropdownWidth - viewportPadding,
    );

    setDropdownPosition({
      top: rect.bottom + 8,
      left: safeLeft,
      width: dropdownWidth,
    });
  };

  useEffect(() => {
    if (!isCountryOpen) return;

    updateDropdownPosition();

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      const clickedInsideWrapper = wrapperRef.current?.contains(target);
      const clickedInsideDropdown = dropdownRef.current?.contains(target);

      if (!clickedInsideWrapper && !clickedInsideDropdown) {
        setIsCountryOpen(false);
        setSearchValue("");
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCountryOpen(false);
        setSearchValue("");
      }
    };

    const handleScroll = (event: Event) => {
      const target = event.target as Node | null;

      if (target && dropdownRef.current?.contains(target)) {
        return;
      }

      updateDropdownPosition();
    };

    const handleResize = () => {
      setIsCountryOpen(false);
      setSearchValue("");
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isCountryOpen]);

  const handlePhoneChange: PhoneInputChangeHandler = (nextValue) => {
    dispatchPhoneState({
      type: "phone",
      value: nextValue,
    });

    if (!hasPhoneValue(nextValue)) {
      onValidityChange?.(true);
      return;
    }

    onValidityChange?.(
      isPossiblePhoneNumber(nextValue) && isValidPhoneNumber(nextValue),
    );
  };

  const handleCountryToggle = () => {
    setIsCountryOpen((currentState) => {
      const nextState = !currentState;

      if (nextState) {
        window.requestAnimationFrame(updateDropdownPosition);
      } else {
        setSearchValue("");
      }

      return nextState;
    });
  };

  const handleCountrySelect = (countryCode: Country) => {
    dispatchPhoneState({
      type: "country",
      selectedCountry: countryCode,
    });

    setIsCountryOpen(false);
    setSearchValue("");
    onValidityChange?.(true);
  };

  return (
    <div ref={wrapperRef} className="block space-y-1.5 md:space-y-2">
      <input name="phone" value={phoneState.value || ""} readOnly hidden />

      <span className="flex items-center justify-between gap-3 text-xs font-medium text-[color:var(--foreground)] md:text-sm">
        <span>{label}</span>

        {optionalText ? (
          <span className="text-[11px] font-normal text-[color:var(--foreground-muted)] md:text-xs">
            {optionalText}
          </span>
        ) : null}
      </span>

      <div
        className={[
          "relative rounded-lg border bg-[color:var(--background)] text-sm text-[color:var(--foreground)] transition md:rounded-xl",
          showError
            ? "border-red-500/60"
            : "border-[color:var(--employee-card-border)] focus-within:border-[color:var(--employee-primary-action-border)]",
        ].join(" ")}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 md:py-3" dir="ltr">
          <button
            ref={countryButtonRef}
            type="button"
            onClick={handleCountryToggle}
            className="flex shrink-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--employee-action-hover-bg)] md:gap-2 md:rounded-lg md:px-2"
          >
            {getCountryFlag(phoneState.selectedCountry)}

            <span className="text-xs text-[color:var(--foreground-muted)]">
              {selectedCountryOption?.dialCode}
            </span>

            <ChevronDown
              size={14}
              className={`text-[color:var(--foreground-muted)] transition ${
                isCountryOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <PhoneInput
            country={phoneState.selectedCountry}
            international
            value={phoneState.value}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-left text-sm text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--foreground-soft)]"
          />
        </div>

        {isCountryOpen && dropdownPosition ? (
          <div
            ref={dropdownRef}
            className="fixed z-[9999] overflow-hidden rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] shadow-[0_18px_50px_var(--employee-card-shadow)] ring-1 ring-[color:var(--border)] backdrop-blur-xl md:rounded-2xl md:shadow-[0_28px_90px_var(--employee-card-shadow)]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }}
          >
            <div className="border-b border-[color:var(--border)] bg-[color:var(--surface-muted)] p-2 md:p-2.5">
              <div className="flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--background-soft)] px-3 py-2 md:rounded-xl md:py-2.5">
                <Search
                  size={15}
                  className="shrink-0 text-[color:var(--foreground-muted)]"
                />

                <input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  autoFocus
                  placeholder={searchCountryPlaceholder}
                  className="w-full bg-transparent text-sm text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--foreground-soft)]"
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto p-1.5 md:max-h-72 md:p-2">
              {filteredCountryOptions.map((country) => {
                const isSelected = country.code === phoneState.selectedCountry;
                const countryLabel = getPhoneCountryLabel(
                  country,
                  countryLocale,
                );

                return (
                  <button
                    key={`${country.code}-${country.dialCode}`}
                    type="button"
                    onClick={() => handleCountrySelect(country.code)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-start text-sm transition md:rounded-xl md:px-3 md:py-2.5 ${
                      isSelected
                        ? "bg-[color:var(--employee-chip-bg)] text-[color:var(--employee-chip-text)] ring-1 ring-[color:var(--employee-chip-border)]"
                        : "text-[color:var(--foreground)] hover:bg-[color:var(--employee-row-hover-bg)]"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      {getCountryFlag(country.code)}

                      <span className="min-w-0">
                        <span className="block truncate font-semibold">
                          {countryLabel}
                        </span>

                        <span className="mt-0.5 block truncate text-[11px] text-[color:var(--foreground-muted)] md:text-xs">
                          {country.dialCode}
                        </span>
                      </span>
                    </span>

                    {isSelected ? (
                      <Check
                        size={15}
                        className="shrink-0 text-[color:var(--employee-chip-text)]"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {showError ? (
        <p className="text-xs font-medium text-red-500">
          {!validationState.isPossible && possibleText
            ? possibleText
            : invalidText}
        </p>
      ) : null}
    </div>
  );
}