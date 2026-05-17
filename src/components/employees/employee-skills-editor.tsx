"use client";

import { useMemo, useState } from "react";
import { Check, Plus, Search, X } from "lucide-react";

import {
  getEmployeeSkillLabel,
  getEmployeeSkillSuggestions,
  normalizeEmployeeSkillKey,
} from "@/data/employee-options";

type EmployeeSkillsEditorLabels = {
  searchPlaceholder: string;
  selectedTitle: string;
  suggestedTitle: string;
  emptyText: string;
  maxReachedText: string;
  addSkillLabel: string;
  removeSkillLabel: string;
};

type EmployeeSkillsEditorProps = {
  value: string[];
  role?: string;
  department?: string;
  isArabic: boolean;
  labels: EmployeeSkillsEditorLabels;
  maxSkills?: number;
  onChange: (skills: string[]) => void;
};

const DEFAULT_MAX_SKILLS = 8;

function getSafeSkillLimit(maxSkills?: number) {
  if (typeof maxSkills !== "number") return DEFAULT_MAX_SKILLS;
  if (!Number.isFinite(maxSkills)) return DEFAULT_MAX_SKILLS;
  if (maxSkills < 1) return DEFAULT_MAX_SKILLS;

  return Math.floor(maxSkills);
}

function normalizeEditorSkills(skills: string[], limit: number) {
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
    .slice(0, limit);
}

export default function EmployeeSkillsEditor({
  value,
  role,
  department,
  isArabic,
  labels,
  maxSkills,
  onChange,
}: EmployeeSkillsEditorProps) {
  const [searchValue, setSearchValue] = useState("");

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const skillLimit = getSafeSkillLimit(maxSkills);
  const skillLocale = isArabic ? "ar" : "en";

  const selectedSkills = useMemo(() => {
    return normalizeEditorSkills(value, skillLimit);
  }, [skillLimit, value]);

  const suggestedSkills = useMemo(() => {
    return getEmployeeSkillSuggestions({
      department,
      role,
      selectedSkills,
      query: "",
      limit: 4,
    });
  }, [department, role, selectedSkills]);

  const searchResults = useMemo(() => {
    if (!searchValue.trim()) return [];

    return getEmployeeSkillSuggestions({
      department,
      role,
      selectedSkills,
      query: searchValue,
      limit: 18,
    });
  }, [department, role, searchValue, selectedSkills]);

  const isFull = selectedSkills.length >= skillLimit;

  const handleAddSkill = (skill: string) => {
    if (isFull) return;

    onChange(normalizeEditorSkills([...selectedSkills, skill], skillLimit));
    setSearchValue("");
  };

  const handleRemoveSkill = (skill: string) => {
    const skillKey = normalizeEmployeeSkillKey(skill);

    onChange(
      selectedSkills.filter(
        (selectedSkill) =>
          normalizeEmployeeSkillKey(selectedSkill) !== skillKey,
      ),
    );
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <div>
        <div
          className="relative"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsSearchOpen(false);
            }
          }}
        >
          <div className="flex items-center gap-2 rounded-lg border border-[color:var(--employee-card-border)] bg-[color:var(--background)] px-3 py-2.5 transition focus-within:border-[color:var(--employee-primary-action-border)] md:px-3.5 md:py-3">
            <Search
              size={15}
              className="shrink-0 text-[color:var(--foreground-muted)]"
            />

            <input
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={labels.searchPlaceholder}
              className="w-full bg-transparent text-sm text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--foreground-soft)]"
            />
          </div>

          {isSearchOpen && searchValue.trim() ? (
            <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--surface-strong)] p-1.5 shadow-[0_16px_42px_var(--employee-card-shadow)] ring-1 ring-[color:var(--border)] backdrop-blur-xl md:max-h-64 md:p-2 md:shadow-[0_22px_70px_var(--employee-card-shadow)]">
              {searchResults.length ? (
                searchResults.map((skill) => {
                  const skillLabel = getEmployeeSkillLabel(
                    skill.value,
                    skillLocale,
                  );

                  return (
                    <button
                      key={skill.value}
                      type="button"
                      disabled={isFull}
                      onClick={() => {
                        handleAddSkill(skill.value);
                        setIsSearchOpen(false);
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-start text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--employee-row-hover-bg)] disabled:cursor-not-allowed disabled:opacity-50 md:px-3 md:py-2.5"
                      aria-label={`${labels.addSkillLabel} ${skillLabel}`}
                    >
                      <span className="truncate">{skillLabel}</span>

                      <Plus
                        size={13}
                        className="shrink-0 text-[color:var(--employee-chip-text)]"
                      />
                    </button>
                  );
                })
              ) : (
                <p className="px-3 py-4 text-center text-sm text-[color:var(--foreground-muted)]">
                  {labels.emptyText}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {selectedSkills.length ? (
          <div className="mt-3 rounded-lg border border-[color:var(--employee-chip-border)] bg-[color:var(--employee-chip-bg)] p-3 ring-1 ring-[color:var(--employee-chip-border)] md:mt-4 md:rounded-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--employee-chip-text)] md:text-xs md:tracking-[0.14em]">
              {labels.selectedTitle}
            </p>

            <div className="mt-2.5 flex max-h-[130px] flex-wrap gap-2 overflow-y-auto pr-1 md:mt-3 md:max-h-none md:overflow-visible md:pr-0">
              {selectedSkills.map((skill) => {
                const skillLabel = getEmployeeSkillLabel(skill, skillLocale);

                return (
                  <span
                    key={skill}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-[color:var(--employee-chip-border)] bg-[color:var(--surface-strong)] px-2.5 py-1.5 text-[11px] font-semibold text-[color:var(--foreground)] shadow-[0_6px_14px_var(--employee-card-shadow)] md:gap-2 md:rounded-full md:px-3 md:text-xs md:shadow-[0_8px_20px_var(--employee-card-shadow)]"
                  >
                    <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--employee-chip-text)] text-[color:var(--primary-foreground)]">
                      <Check size={10} />
                    </span>

                    <span className="truncate">{skillLabel}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[color:var(--foreground-muted)] transition hover:bg-[color:var(--employee-action-hover-bg)] hover:text-[color:var(--danger)]"
                      aria-label={`${labels.removeSkillLabel} ${skillLabel}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--foreground-muted)] md:text-xs md:tracking-[0.14em]">
            {labels.suggestedTitle}
          </p>

          <span className="text-xs font-semibold text-[color:var(--foreground-muted)]">
            {selectedSkills.length}/{skillLimit}
          </span>
        </div>

        {isFull ? (
          <p className="rounded-lg border border-[color:var(--employee-chip-border)] bg-[color:var(--employee-chip-bg)] px-3 py-2 text-xs font-semibold text-[color:var(--employee-chip-text)]">
            {labels.maxReachedText}
          </p>
        ) : null}

        {suggestedSkills.length ? (
          <div className="flex max-h-[128px] flex-wrap gap-2 overflow-y-auto pr-1 md:max-h-none md:overflow-visible md:pr-0">
            {suggestedSkills.map((skill) => {
              const skillLabel = getEmployeeSkillLabel(
                skill.value,
                skillLocale,
              );

              return (
                <button
                  key={skill.value}
                  type="button"
                  disabled={isFull}
                  onClick={() => handleAddSkill(skill.value)}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-dashed border-[color:var(--employee-department-badge-border)] bg-transparent px-2.5 py-1.5 text-[11px] font-semibold text-[color:var(--employee-department-badge-text)] transition hover:border-[color:var(--employee-chip-border)] hover:bg-[color:var(--employee-row-hover-bg)] hover:text-[color:var(--employee-chip-text)] disabled:cursor-not-allowed disabled:opacity-50 md:rounded-full md:px-3 md:text-xs"
                  aria-label={`${labels.addSkillLabel} ${skillLabel}`}
                >
                  <Plus size={12} className="shrink-0" />
                  <span className="truncate">{skillLabel}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="rounded-lg border border-[color:var(--employee-department-row-border)] bg-[color:var(--employee-department-row-bg)] px-3 py-2.5 text-sm text-[color:var(--foreground-muted)] md:py-3">
            {labels.emptyText}
          </p>
        )}
      </div>
    </div>
  );
}