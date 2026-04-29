"use client";

import { useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Locale } from "@/lib/constants";

type TopbarDatePickerProps = {
  locale: Locale;
  actionButtonClass: string;
};

function formatDateForInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateLabel(value: string, locale: Locale) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function TopbarDatePicker({
  locale,
  actionButtonClass,
}: TopbarDatePickerProps) {
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedDate, setSelectedDate] = useState(() =>
    formatDateForInput(new Date()),
  );

  function openDatePicker() {
    const input = dateInputRef.current;

    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.click();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openDatePicker}
        className={`${actionButtonClass} gap-2 px-3.5 py-2 text-xs font-medium`}
      >
        <CalendarDays size={15} />
        {formatDateLabel(selectedDate, locale)}
      </button>

      <input
        ref={dateInputRef}
        type="date"
        value={selectedDate}
        onChange={(event) => setSelectedDate(event.target.value)}
        className="pointer-events-none absolute right-0 top-0 h-0 w-0 opacity-0"
        aria-label="Select date"
      />
    </div>
  );
}