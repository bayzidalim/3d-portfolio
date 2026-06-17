"use client";
import { useState, useMemo } from "react";
import type { Task } from "./TaskModal";

// ─── Priority config ────────────────────────────────────
const priorityLabel: Record<string, { label: string; color: string; sortWeight: number }> = {
  urgent: { label: "Urgent", color: "text-red-400", sortWeight: 0 },
  high: { label: "High", color: "text-orange-400", sortWeight: 1 },
  medium: { label: "Medium", color: "text-blue-400", sortWeight: 2 },
  low: { label: "Low", color: "text-gray-400", sortWeight: 3 },
};

type SortBy = "priority" | "dueDate" | "title" | "status";

interface ChecklistViewProps {
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
  onTaskToggle: (task: Task) => void; // Toggle between todo <-> done
  onTaskAdd: () => void;
}

export default function ChecklistView({ tasks, onTaskEdit, onTaskToggle, onTaskAdd }: ChecklistViewProps) {
  const [sortBy, setSortBy] = useState<SortBy>("priority");
  const [showDone, setShowDone] = useState(true);

  // Stats
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  // Sort & filter
  const sorted = useMemo(() => {
    let list = [...tasks];
    if (!showDone) list = list.filter((t) => t.status !== "done");

    list.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return (priorityLabel[a.priority]?.sortWeight ?? 9) - (priorityLabel[b.priority]?.sortWeight ?? 9);
        case "dueDate": {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        case "title":
          return a.title.localeCompare(b.title);
        case "status": {
          const statusOrder: Record<string, number> = { todo: 0, in_progress: 1, done: 2 };
          return (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9);
        }
        default:
          return 0;
      }
    });
    return list;
  }, [tasks, sortBy, showDone]);

  const formatDue = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.status === "done") return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
        <div className="flex flex-col gap-3 mb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white">{percent}%</span>
            <span className="text-xs text-gray-500">
              {done} of {total} tasks completed
            </span>
          </div>
          <button
            onClick={onTaskAdd}
            className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-indigo-500/20 text-indigo-200 border border-white/10 rounded-lg hover:bg-indigo-500/30 transition-all cursor-pointer sm:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Task
          </button>
        </div>
        <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Sort */}
        <div className="min-w-0">
          <span className="mb-1.5 block text-[10px] uppercase tracking-wider text-gray-600 font-semibold">Sort by</span>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {(["priority", "dueDate", "title", "status"] as SortBy[]).map((opt) => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={`min-h-9 shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                  sortBy === opt
                    ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/20"
                    : "bg-white/[0.02] text-gray-500 border-white/[0.04] hover:text-gray-300 hover:bg-white/[0.04]"
                }`}
              >
                {opt === "dueDate" ? "Due Date" : opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Show done toggle */}
        <button
          onClick={() => setShowDone(!showDone)}
          className={`flex min-h-10 items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer sm:justify-start ${
            showDone
              ? "bg-white/[0.03] text-gray-400 border-white/[0.06]"
              : "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded border transition-all flex items-center justify-center ${
            showDone ? "border-gray-600" : "border-indigo-400 bg-indigo-500/30"
          }`}>
            {!showDone && (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </div>
          Hide completed
        </button>
      </div>

      {/* Task list */}
      <div className="space-y-1.5">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              {!showDone ? "All tasks are completed!" : "No tasks yet"}
            </p>
          </div>
        ) : (
          sorted.map((task) => (
            <div
              key={task._id}
              className="group flex items-center gap-2.5 px-3 py-3 rounded-xl border border-white/[0.04] hover:border-white/[0.08] bg-white/[0.01] hover:bg-white/[0.03] transition-all sm:gap-3 sm:px-4"
            >
              {/* Checkbox */}
              <button
                onClick={() => onTaskToggle(task)}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer sm:h-5 sm:w-5 ${
                  task.status === "done"
                    ? "border-green-500/50 bg-green-500/20"
                    : "border-gray-600 hover:border-indigo-400"
                }`}
              >
                {task.status === "done" && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>

              {/* Title */}
              <button
                onClick={() => onTaskEdit(task)}
                className={`flex-1 text-left text-sm transition-colors cursor-pointer min-w-0 ${
                  task.status === "done"
                    ? "text-gray-600 line-through"
                    : "text-white hover:text-indigo-200"
                }`}
              >
                <span className="truncate block">{task.title}</span>
              </button>

              {/* Priority */}
              <span className={`text-[10px] font-medium shrink-0 hidden sm:block ${priorityLabel[task.priority]?.color || "text-gray-500"}`}>
                {priorityLabel[task.priority]?.label}
              </span>

              {/* Status badge (non-done) */}
              {task.status === "in_progress" && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/10 shrink-0 hidden sm:inline-block">
                  In Progress
                </span>
              )}

              {/* Due date */}
              {task.dueDate && (
                <span className={`text-[11px] shrink-0 ${
                  isOverdue(task) ? "text-red-400 font-medium" : "text-gray-600"
                }`}>
                  {formatDue(task.dueDate)}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
