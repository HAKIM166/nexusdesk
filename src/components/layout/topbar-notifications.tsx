"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  FolderPlus,
  Languages,
  Moon,
  Sparkles,
  Sun,
  UserPlus,
  X,
} from "lucide-react";
import { Locale } from "@/lib/constants";
import {
  NotificationItem,
  NotificationType,
  useNotificationStore,
} from "@/store/notification-store";

type Props = {
  locale: Locale;
  isArabic: boolean;
  actionButtonClass: string;
};

function formatTime(time: string) {
  const diff = Date.now() - new Date(time).getTime();

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}

function isToday(time: string) {
  const date = new Date(time);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}



export default function TopbarNotifications({
  locale,
  isArabic,
  actionButtonClass,
}: Props) {
  const [open, setOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  }

  if (open) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [open]);

  const notifications = useNotificationStore((s) => s.notifications);
  const removeNotification = useNotificationStore((s) => s.removeNotification);
  const clearNotifications = useNotificationStore((s) => s.clearNotifications);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  const unreadCount = notifications.filter((notification) => {
    return !notification.read;
  }).length;

  const todayNotifications = useMemo(() => {
    return notifications.filter((notification) => isToday(notification.time));
  }, [notifications]);

  const earlierNotifications = useMemo(() => {
    return notifications.filter((notification) => !isToday(notification.time));
  }, [notifications]);

  function handleToggleNotifications() {
    setOpen((current) => {
      const nextOpenState = !current;

      if (nextOpenState) {
        window.setTimeout(() => {
          markAllAsRead();
        }, 400);
      }

      return nextOpenState;
    });
  }

  function getIcon(type: NotificationType) {
    if (type === "client") return <UserPlus size={15} />;
    if (type === "project") return <FolderPlus size={15} />;
    if (type === "language") return <Languages size={15} />;
    if (type === "theme") {
      return locale === "ar" ? <Moon size={15} /> : <Sun size={15} />;
    }

    return <Sparkles size={15} />;
  }

  function renderNotification(notification: NotificationItem) {
    return (
      <div
        key={notification.id}
        className={`group flex gap-3 border-b border-[var(--border)] px-4 py-3 last:border-b-0 ${
          notification.read ? "opacity-75" : "bg-emerald-400/[0.04]"
        }`}
      >
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
          {getIcon(notification.type)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {!notification.read && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                )}

                <p className="text-sm font-medium text-[var(--topbar-text)]">
                  {notification.title}
                </p>
              </div>

              <p className="mt-1 text-xs leading-5 text-[var(--topbar-muted)]">
                {notification.description}
              </p>

              <p className="mt-2 text-[11px] text-emerald-300/80">
                {formatTime(notification.time)}
              </p>
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                removeNotification(notification.id);
              }}
              className="rounded-lg p-1 text-[var(--topbar-muted)] opacity-70 transition hover:bg-white/5 hover:text-[var(--topbar-text)] group-hover:opacity-100"
              aria-label={
                locale === "ar" ? "إخفاء الإشعار" : "Dismiss notification"
              }
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={notificationsRef} className="relative">
      <button
        type="button"
        onClick={handleToggleNotifications}
        className={`${actionButtonClass} relative h-10 w-10`}
        aria-label={locale === "ar" ? "فتح الإشعارات" : "Open notifications"}
      >
        <Bell
          key={unreadCount}
          size={17}
          className={
            unreadCount > 0 ? "animate-[notification-bell_0.7s_ease-in-out]" : ""
          }
        />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 animate-[notification-pulse_0.7s_ease-in-out] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--topbar-bg)] shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
            isArabic ? "left-0 text-right" : "right-0 text-left"
          }`}
        >
          <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--topbar-text)]">
                {isArabic ? "الإشعارات" : "Notifications"}
              </p>

              <p className="mt-1 text-xs text-[var(--topbar-muted)]">
                {isArabic
                  ? "آخر تحديثات مساحة العمل"
                  : "Latest workspace updates"}
              </p>
            </div>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  clearNotifications();
                }}
                className="rounded-lg px-2 py-1 text-[11px] font-medium text-[var(--topbar-muted)] transition hover:bg-white/5 hover:text-[var(--topbar-text)]"
              >
                {isArabic ? "مسح الكل" : "Clear all"}
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {notifications.length > 0 ? (
              <>
                {todayNotifications.length > 0 && (
                  <div>
                    <p className="border-b border-[var(--border)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--topbar-muted)]">
                      {isArabic ? "اليوم" : "Today"}
                    </p>

                    {todayNotifications.map(renderNotification)}
                  </div>
                )}

                {earlierNotifications.length > 0 && (
                  <div>
                    <p className="border-b border-[var(--border)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--topbar-muted)]">
                      {isArabic ? "سابقًا" : "Earlier"}
                    </p>

                    {earlierNotifications.map(renderNotification)}
                  </div>
                )}
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium text-[var(--topbar-text)]">
                  {isArabic ? "لا توجد إشعارات" : "No notifications"}
                </p>

                <p className="mt-1 text-xs text-[var(--topbar-muted)]">
                  {isArabic
                    ? "أي إجراء جديد سيظهر هنا تلقائيًا."
                    : "New actions will appear here automatically."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}