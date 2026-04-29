"use client";

import { TaskStatus } from "@/types/task";
import { useTaskStore } from "@/store/task-store";
import TaskCard from "./task-card";

type Props = {
  title: string;
  status: TaskStatus;
};

export default function TaskColumn({ title, status }: Props) {
  const tasks = useTaskStore((state) =>
    state.tasks.filter((task) => task.status === status),
  );

  return (
    <div className="min-w-[260px] flex-1">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">{title}</p>
        <span className="text-xs text-[var(--topbar-muted)]">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}