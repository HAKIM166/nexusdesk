"use client";

import { Task } from "@/types/task";
import { useTaskStore } from "@/store/task-store";
import { ArrowRight, Check, RotateCcw, Trash2 } from "lucide-react";

type Props = {
  task: Task;
};

export default function TaskCard({ task }: Props) {
  const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  function handleMoveForward() {
    if (task.status === "backlog") {
      updateTaskStatus(task.id, "in-progress");
    } else if (task.status === "in-progress") {
      updateTaskStatus(task.id, "done");
    }
  }

  function handleMoveBack() {
    if (task.status === "in-progress") {
      updateTaskStatus(task.id, "backlog");
    } else if (task.status === "done") {
      updateTaskStatus(task.id, "in-progress");
    }
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-3 space-y-3">
      <div>
        <p className="text-sm font-semibold">{task.title}</p>
        <p className="text-xs text-[var(--topbar-muted)] mt-1">
          {task.description}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* forward */}
        {task.status !== "done" && (
          <button
            onClick={handleMoveForward}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
          >
            <ArrowRight size={12} />
            {task.status === "backlog" ? "Start" : "Complete"}
          </button>
        )}

        {/* back */}
        {task.status !== "backlog" && (
          <button
            onClick={handleMoveBack}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
          >
            <RotateCcw size={12} />
            Back
          </button>
        )}

        {/* delete */}
        <button
          onClick={() => deleteTask(task.id)}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}