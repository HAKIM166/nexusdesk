"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import arLocale from "@fullcalendar/core/locales/ar";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import type {
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
} from "@fullcalendar/core";

import type { NexusCalendarEvent } from "@/types/calendar";

import { CalendarPlus } from "lucide-react";
import { Locale } from "@/lib/constants";
import { getMessages } from "@/lib/helpers";

import { useCalendarStore } from "@/store/calendar-store";

function formatEventDateRange(
  start: string,
  end: string | undefined,
  locale: Locale,
) {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;

  const formatter = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!endDate) return formatter.format(startDate);

  const fixedEndDate = new Date(endDate);
  fixedEndDate.setDate(fixedEndDate.getDate() - 1);

  if (startDate.toDateString() === fixedEndDate.toDateString()) {
    return formatter.format(startDate);
  }

  return `${formatter.format(startDate)} → ${formatter.format(fixedEndDate)}`;
}

export default function CalendarPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const messages = getMessages(locale);
  const calendarMessages = messages.calendar;
  const isArabic = locale === "ar";

  const events = useCalendarStore((state) => state.events);
  const initializeEvents = useCalendarStore((state) => state.initializeEvents);
  const addEvent = useCalendarStore((state) => state.addEvent);
  const updateEvent = useCalendarStore((state) => state.updateEvent);
  const deleteEvent = useCalendarStore((state) => state.deleteEvent);
  const isLoading = useCalendarStore((state) => state.isLoading);
  const [title, setTitle] = useState("");
  const [selectedStart, setSelectedStart] = useState("");
  const [selectedEnd, setSelectedEnd] = useState("");
  const [isCompactCalendar, setIsCompactCalendar] = useState(false);

  useEffect(() => {
    function updateCalendarMode() {
      setIsCompactCalendar(window.innerWidth < 768);
    }

    updateCalendarMode();
    window.addEventListener("resize", updateCalendarMode);

    return () => {
      window.removeEventListener("resize", updateCalendarMode);
    };
  }, []);

  useEffect(() => {
    initializeEvents();
  }, [initializeEvents]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      total: events.length,
      upcoming: events.filter((event) => {
        const eventDate = new Date(event.start);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      }).length,
    };
  }, [events]);

  function handleSelect(selection: DateSelectArg) {
    setSelectedStart(selection.startStr);
    setSelectedEnd(selection.endStr);
  }

  async function handleAddEvent() {
    if (!title.trim() || !selectedStart) return;

    await addEvent({
      title: title.trim(),
      start: selectedStart,
      end: selectedEnd || undefined,
    });

    setTitle("");
  }

  async function handleEventClick(info: EventClickArg) {
    const shouldDelete = window.confirm(calendarMessages.deleteConfirm);

    if (!shouldDelete) return;

    await deleteEvent(info.event.id);
  }

  async function handleEventChange(info: EventChangeArg) {
    await updateEvent(info.event.id, {
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr || undefined,
    });
  }

  const selectedLabel = selectedStart
    ? selectedEnd && selectedEnd !== selectedStart
      ? formatEventDateRange(selectedStart, selectedEnd, locale)
      : formatEventDateRange(selectedStart, undefined, locale)
    : calendarMessages.selectDateHint;

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`space-y-5 md:space-y-8 ${
        isArabic ? "text-right" : "text-left"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <header className="flex flex-col justify-between gap-4 md:gap-5 lg:flex-row lg:items-end">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-[var(--primary)] md:text-sm">
            {calendarMessages.kicker}
          </p>

          <h1 className="mt-1.5 text-[26px] font-bold tracking-[-0.04em] text-[var(--foreground)] md:mt-2 md:text-3xl">
            {calendarMessages.title}
          </h1>

          <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[var(--foreground-muted)] md:text-sm">
            {calendarMessages.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm sm:flex sm:gap-6">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
            <p className="text-[22px] font-bold leading-none text-[var(--foreground)] md:text-2xl">
              {stats.total}
            </p>
            <p className="mt-1 text-[12px] text-[var(--foreground-muted)] md:text-sm">
              {calendarMessages.totalEvents}
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
            <p className="text-[22px] font-bold leading-none text-[var(--foreground)] md:text-2xl">
              {stats.upcoming}
            </p>
            <p className="mt-1 text-[12px] text-[var(--foreground-muted)] md:text-sm">
              {calendarMessages.upcoming}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 md:gap-8 lg:grid-cols-[1fr_300px]">
        <div className="nexus-calendar min-w-0">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            locale={isArabic ? arLocale : "en"}
            direction={isArabic ? "rtl" : "ltr"}
            initialView="dayGridMonth"
            height={isCompactCalendar ? 390 : 620}
            contentHeight={isCompactCalendar ? 300 : 560}
            events={events}
            selectable
            editable
            unselectAuto={false}
            nowIndicator
            dayMaxEvents={isCompactCalendar ? 1 : 2}
            select={handleSelect}
            eventClick={handleEventClick}
            eventChange={handleEventChange}
            headerToolbar={
              isCompactCalendar
                ? {
                    left: "prev,next",
                    center: "title",
                    right: "",
                  }
                : {
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }
            }
            footerToolbar={false}
            buttonText={{
              today: calendarMessages.buttons.today,
              month: calendarMessages.buttons.month,
              week: calendarMessages.buttons.week,
              day: calendarMessages.buttons.day,
            }}
          />
        </div>

        <aside className="space-y-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 pt-4 md:space-y-6 md:border-0 md:bg-transparent md:p-0 md:pt-1">
          <div>
            <h2 className="text-[17px] font-semibold text-[var(--foreground)] md:text-lg">
              {calendarMessages.addEvent}
            </h2>

            <p className="mt-1.5 text-[13px] leading-6 text-[var(--foreground-muted)] md:mt-2 md:text-sm">
              {calendarMessages.addEventDescription}
            </p>
          </div>

          <div className="space-y-3">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={calendarMessages.eventTitlePlaceholder}
              className="input-base"
            />

            <p className="text-[13px] leading-5 text-[var(--foreground-muted)] md:text-sm">
              <span className="font-medium text-[var(--foreground)]">
                {calendarMessages.selected}:
              </span>{" "}
              {selectedLabel}
            </p>

            <button
              type="button"
              onClick={handleAddEvent}
              disabled={!title.trim() || !selectedStart}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--calendar-action-border)] bg-[var(--calendar-action-bg)] px-4 py-2.5 text-[13px] font-bold text-[var(--calendar-action-text)] transition hover:border-[var(--calendar-action-hover-border)] hover:bg-[var(--calendar-action-hover-bg)] hover:text-[var(--calendar-action-hover-text)] disabled:cursor-not-allowed disabled:border-[var(--border)] disabled:bg-[var(--surface-muted)] disabled:text-[var(--foreground-soft)] md:rounded-2xl md:px-5 md:py-3 md:text-sm"
            >
              <CalendarPlus className="h-4 w-4 text-[var(--calendar-action-icon)] transition group-hover:text-[var(--calendar-action-hover-text)]" />
              <span>{calendarMessages.addToCalendar}</span>
            </button>
          </div>

          <div className="border-t border-[var(--border)] pt-4 md:pt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground-soft)] md:text-xs md:tracking-[0.18em]">
              {calendarMessages.upcoming}
            </p>

            <div className="mt-3 space-y-2.5 md:mt-4 md:space-y-3">
              {events.length > 0 ? (
                events.slice(0, 5).map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={async () => {
                      await deleteEvent(event.id);
                    }}
                    className={`block w-full rounded-md border border-transparent px-2 py-2 transition hover:border-[var(--border)] hover:bg-[var(--surface-muted)] ${
                      isArabic ? "text-right" : "text-left"
                    }`}
                  >
                    <p className="truncate text-[13px] font-semibold text-[var(--foreground)] md:text-sm">
                      {event.title}
                    </p>

                    <p className="mt-1 text-[11px] text-[var(--foreground-muted)] md:text-xs">
                      {formatEventDateRange(event.start, event.end, locale)}
                    </p>
                  </button>
                ))
              ) : (
                <p className="text-[13px] text-[var(--foreground-muted)] md:text-sm">
                  {calendarMessages.noEvents}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      <footer className="border-t border-[var(--border)] pt-4 md:pt-5">
        <p className="text-[13px] leading-6 text-[var(--foreground-muted)] md:text-sm">
          {calendarMessages.localSaveNote}
        </p>
      </footer>
    </div>
  );
}
