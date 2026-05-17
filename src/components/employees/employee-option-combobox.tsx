"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

export type EmployeeComboboxOption = {
  label: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  searchText?: string;
};

type EmployeeOptionComboboxProps = {
  name: string;
  label: string;
  value: string;
  options: EmployeeComboboxOption[];
  placeholder: string;
  emptyText: string;
  optionalText?: string;
  required?: boolean;
  maxVisibleOptions?: number;
  onChange: (value: string) => void;
};

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

export default function EmployeeOptionCombobox({
  name,
  label,
  value,
  options,
  placeholder,
  emptyText,
  optionalText,
  required = false,
  maxVisibleOptions = 80,
  onChange,
}: EmployeeOptionComboboxProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition | null>(null);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(searchValue);

    if (!normalizedSearch) {
      return options.slice(0, maxVisibleOptions);
    }

    return options
      .filter((option) => {
        const searchText = normalizeSearchValue(
          option.searchText ||
            `${option.label} ${option.value} ${option.description || ""}`,
        );

        return searchText.includes(normalizedSearch);
      })
      .slice(0, maxVisibleOptions);
  }, [maxVisibleOptions, options, searchValue]);

  const updateDropdownPosition = () => {
    const trigger = triggerRef.current;

    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const gap = 8;
    const viewportPadding = 14;
    const preferredHeight = window.innerWidth < 640 ? 300 : 360;

    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
    const spaceAbove = rect.top - viewportPadding;

    const shouldOpenUp =
      spaceBelow < preferredHeight && spaceAbove > spaceBelow;

    const availableHeight = shouldOpenUp
      ? Math.max(190, Math.min(preferredHeight, spaceAbove - gap))
      : Math.max(190, Math.min(preferredHeight, spaceBelow - gap));

    const preferredTop = shouldOpenUp
      ? rect.top - availableHeight - gap
      : rect.bottom + gap;

    const safeTop = Math.min(
      Math.max(viewportPadding, preferredTop),
      window.innerHeight - availableHeight - viewportPadding,
    );

    const safeLeft = Math.min(
      Math.max(viewportPadding, rect.left),
      window.innerWidth - rect.width - viewportPadding,
    );

    setDropdownPosition({
      top: safeTop,
      left: safeLeft,
      width: rect.width,
      maxHeight: availableHeight,
    });
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchValue("");
  };

  const openDropdown = () => {
    setIsOpen(true);
    window.requestAnimationFrame(updateDropdownPosition);
  };

  useEffect(() => {
    if (!isOpen) return;

    updateDropdownPosition();

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      const clickedInsideTrigger = wrapperRef.current?.contains(target);
      const clickedInsideDropdown = dropdownRef.current?.contains(target);

      if (!clickedInsideTrigger && !clickedInsideDropdown) {
        closeDropdown();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
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
      closeDropdown();
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
  }, [isOpen]);

  const handleToggle = () => {
    if (isOpen) {
      closeDropdown();
      return;
    }

    openDropdown();
  };

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    closeDropdown();
  };

  const handleClear = () => {
    onChange("");
    closeDropdown();
  };

  return (
    <div ref={wrapperRef} className="relative space-y-1.5 md:space-y-2">
      <input name={name} value={value} readOnly hidden required={required} />

      <span className="flex items-center justify-between gap-3 text-xs font-medium text-[color:var(--foreground)] md:text-sm">
        <span>{label}</span>

        {!required && optionalText ? (
          <span className="text-[11px] font-normal text-[color:var(--foreground-muted)] md:text-xs">
            {optionalText}
          </span>
        ) : null}
      </span>

      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--background)] px-3.5 py-2.5 text-start text-sm text-[color:var(--foreground)] outline-none transition hover:border-[color:var(--employee-primary-action-border)] hover:bg-[color:var(--employee-row-hover-bg)] focus:border-[color:var(--employee-primary-action-border)] focus:ring-2 focus:ring-[color:var(--employee-primary-action-border)] md:rounded-xl md:px-4 md:py-3"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {selectedOption?.icon ? (
            <span className="inline-flex size-5 shrink-0 items-center justify-center overflow-hidden">
              {selectedOption.icon}
            </span>
          ) : null}

          <span
            className={`truncate ${
              selectedOption
                ? "text-[color:var(--foreground)]"
                : "text-[color:var(--foreground-soft)]"
            }`}
          >
            {selectedOption?.label || placeholder}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2">
          {value && !required ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                handleClear();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  handleClear();
                }
              }}
              className="flex size-6 items-center justify-center rounded-md text-[color:var(--foreground-muted)] transition hover:bg-[color:var(--employee-row-hover-bg)] hover:text-[color:var(--foreground)]"
            >
              <X size={14} />
            </span>
          ) : null}

          <ChevronDown
            size={16}
            className={`text-[color:var(--foreground-muted)] transition ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {isOpen && dropdownPosition ? (
        <div
          ref={dropdownRef}
          className="fixed z-[9999] overflow-hidden rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] shadow-[0_18px_50px_var(--employee-card-shadow)] ring-1 ring-[color:var(--border)] backdrop-blur-xl md:rounded-2xl md:shadow-[0_28px_90px_var(--employee-card-shadow)]"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            maxHeight: dropdownPosition.maxHeight,
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
                placeholder={placeholder}
                className="w-full bg-transparent text-sm text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--foreground-soft)]"
              />
            </div>
          </div>

          <div
            role="listbox"
            className="overflow-y-auto p-1.5 md:p-2"
            style={{
              maxHeight: Math.max(150, dropdownPosition.maxHeight - 62),
            }}
          >
            {filteredOptions.length ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;

                return (
                  <button
                    key={`${name}-${option.value}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-start text-sm transition md:rounded-xl md:px-3 md:py-2.5 ${
                      isSelected
                        ? "bg-[color:var(--employee-chip-bg)] text-[color:var(--employee-chip-text)] ring-1 ring-[color:var(--employee-chip-border)]"
                        : "text-[color:var(--foreground)] hover:bg-[color:var(--employee-row-hover-bg)]"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      {option.icon ? (
                        <span className="inline-flex size-5 shrink-0 items-center justify-center overflow-hidden">
                          {option.icon}
                        </span>
                      ) : null}

                      <span className="min-w-0">
                        <span className="block truncate font-semibold">
                          {option.label}
                        </span>

                        {option.description ? (
                          <span className="mt-0.5 block truncate text-[11px] text-[color:var(--foreground-muted)] md:text-xs">
                            {option.description}
                          </span>
                        ) : null}
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
              })
            ) : (
              <div className="px-3 py-5 text-center text-sm text-[color:var(--foreground-muted)] md:py-6">
                {emptyText}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}