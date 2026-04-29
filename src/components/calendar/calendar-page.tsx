"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
} from "@fullcalendar/core";

import type { NexusCalendarEvent } from "@/types/calendar";

const STORAGE_KEY = "nexusdesk-calendar-events";

type EventsAction =
  | NexusCalendarEvent[]
  | ((currentEvents: NexusCalendarEvent[]) => NexusCalendarEvent[]);

function eventsReducer(
  currentEvents: NexusCalendarEvent[],
  action: EventsAction
) {
  return typeof action === "function" ? action(currentEvents) : action;
}

function formatEventDateRange(start: string, end?: string) {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;

  const formatter = new Intl.DateTimeFormat("en", {
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
  const [events, dispatchEvents] = useReducer(eventsReducer, []);
  const [title, setTitle] = useState("");
  const [selectedStart, setSelectedStart] = useState("");
  const [selectedEnd, setSelectedEnd] = useState("");

  useEffect(() => {
    const savedEvents = window.localStorage.getItem(STORAGE_KEY);

    if (!savedEvents) return;

    try {
      const parsedEvents = JSON.parse(savedEvents) as NexusCalendarEvent[];

      if (Array.isArray(parsedEvents)) {
        dispatchEvents(parsedEvents);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

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

  function handleAddEvent() {
    if (!title.trim() || !selectedStart) return;

    dispatchEvents((currentEvents) => [
      ...currentEvents,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        start: selectedStart,
        end: selectedEnd || undefined,
      },
    ]);

    setTitle("");
  }

  function handleEventClick(info: EventClickArg) {
    const shouldDelete = window.confirm(`Delete "${info.event.title}"?`);

    if (!shouldDelete) return;

    dispatchEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== info.event.id)
    );
  }

  function handleEventChange(info: EventChangeArg) {
    dispatchEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === info.event.id
          ? {
              ...event,
              start: info.event.startStr,
              end: info.event.endStr || undefined,
            }
          : event
      )
    );
  }

  const selectedLabel = selectedStart
    ? selectedEnd && selectedEnd !== selectedStart
      ? formatEventDateRange(selectedStart, selectedEnd)
      : formatEventDateRange(selectedStart)
    : "Select a day or drag across multiple days";

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold text-[var(--primary)]">
            Schedule workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[var(--foreground)]">
            Calendar
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
            Add meetings, deadlines, follow-ups, and project checkpoints in one clean schedule.
          </p>
        </div>

        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {stats.total}
            </p>
            <p className="text-[var(--foreground-muted)]">Events</p>
          </div>

          <div>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {stats.upcoming}
            </p>
            <p className="text-[var(--foreground-muted)]">Upcoming</p>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="nexus-calendar min-w-0">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            events={events}
            selectable
            editable
            unselectAuto={false}
            nowIndicator
            dayMaxEvents={2}
            select={handleSelect}
            eventClick={handleEventClick}
            eventChange={handleEventChange}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
            }}
          />
        </div>

        <aside className="space-y-6 pt-1">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Add event
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              Select a day or drag across multiple days, then add a title.
            </p>
          </div>

          <div className="space-y-3">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Event title"
              className="input-base"
            />

            <p className="text-sm text-[var(--foreground-muted)]">
              <span className="text-[var(--foreground)]">Selected:</span>{" "}
              {selectedLabel}
            </p>

            <button
              type="button"
              onClick={handleAddEvent}
              disabled={!title.trim() || !selectedStart}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to calendar
            </button>
          </div>

          <div className="border-t border-[var(--border)] pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground-soft)]">
              Upcoming
            </p>

            <div className="mt-4 space-y-3">
              {events.length > 0 ? (
                events.slice(0, 5).map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() =>
                      dispatchEvents((currentEvents) =>
                        currentEvents.filter((item) => item.id !== event.id)
                      )
                    }
                    className="block w-full text-left"
                  >
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      {event.title}
                    </p>

                    <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                      {formatEventDateRange(event.start, event.end)}
                    </p>
                  </button>
                ))
              ) : (
                <p className="text-sm text-[var(--foreground-muted)]">
                  No events yet.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      <footer className="border-t border-[var(--border)] pt-5">
        <p className="text-sm text-[var(--foreground-muted)]">
          Your schedule is saved locally for now. Later, we can connect it with clients, projects, and tasks.
        </p>
      </footer>
    </div>
  );
}