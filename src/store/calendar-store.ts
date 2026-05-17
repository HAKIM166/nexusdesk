"use client";

import { create } from "zustand";

import {
  createCalendarEvent,
  deleteCalendarEventById,
  getCalendarEvents,
  updateCalendarEventById,
} from "@/services/calendar.service";
import { NexusCalendarEvent } from "@/types/calendar";

type CalendarEventInput = Omit<NexusCalendarEvent, "id">;

type CalendarStore = {
  events: NexusCalendarEvent[];
  isLoading: boolean;
  error: string | null;

  initializeEvents: () => Promise<void>;
  addEvent: (event: CalendarEventInput) => Promise<void>;
  updateEvent: (id: string, event: CalendarEventInput) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
};

export const useCalendarStore = create<CalendarStore>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  initializeEvents: async () => {
    set({ isLoading: true, error: null });

    try {
      const events = await getCalendarEvents();

      set({
        events,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load calendar events.",
        isLoading: false,
      });
    }
  },

  addEvent: async (event) => {
    set({ error: null });

    try {
      const newEvent = await createCalendarEvent(event);

      set((state) => ({
        events: [...state.events, newEvent],
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create calendar event.",
      });
    }
  },

  updateEvent: async (id, event) => {
    set({ error: null });

    try {
      const updatedEvent = await updateCalendarEventById(id, event);

      set((state) => ({
        events: state.events.map((item) =>
          item.id === id ? updatedEvent : item,
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update calendar event.",
      });
    }
  },

  deleteEvent: async (id) => {
    set({ error: null });

    try {
      await deleteCalendarEventById(id);

      set((state) => ({
        events: state.events.filter((item) => item.id !== id),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete calendar event.",
      });
    }
  },
}));