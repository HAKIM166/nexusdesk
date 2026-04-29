"use client";

import TaskColumn from "./task-column";

export default function KanbanBoard() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      <TaskColumn title="Backlog" status="backlog" />
      <TaskColumn title="In Progress" status="in-progress" />
      <TaskColumn title="Done" status="done" />
    </div>
  );
}