"use client";

import { create } from "zustand";

export type NotificationType =
  | "client"
  | "project"
  | "employee"
  | "task"
  | "ai"
  | "theme"
  | "language";

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  read: boolean;
};

type NotificationStore = {
  notifications: NotificationItem[];
  addNotification: (
    notification: Omit<NotificationItem, "id" | "time" | "read">,
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markAllAsRead: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  addNotification: (notification) =>
    set((state) => {
      const shouldReplaceSameType =
        notification.type === "language" || notification.type === "theme";

      const filteredNotifications = shouldReplaceSameType
        ? state.notifications.filter((item) => item.type !== notification.type)
        : state.notifications;

      return {
        notifications: [
          {
            id: crypto.randomUUID(),
            time: new Date().toISOString(),
            read: false,
            ...notification,
          },
          ...filteredNotifications,
        ],
      };
    }),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((notification) => {
        return notification.id !== id;
      }),
    })),

  clearNotifications: () => set({ notifications: [] }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    })),
}));