"use client";
import { useState } from "react";
import type { Task } from "./TaskModal";

// ─── Priority badge config ──────────────────────────────
const priorityConfig: Record<Task["priority"], { label: string; dot: string; bg: string }> = {
  low: { label: "Low", dot: "bg-gray-400", bg: "bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400" },
  medium: { label: "Med", dot: "bg-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  high: { label: "High", dot: "bg-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  urgent: { label: "Urgent", dot: "bg-red-400", bg: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" },
};

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function KanbanCard({ task, onEdit }: KanbanCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const p = priorityConfig[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ _id: task._id, status: task.status }));
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
    
    const el = e.currentTarget as HTMLElement;
    // Add a slight delay for the ghost effect
    requestAnimationFrame(() => {
      if (el) el.style.opacity = "0.4";
    });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    (e.currentTarget as HTMLElement).style.opacity = "1";
  };

  // Format due date
  const formatDue = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff <= 7) return `${diff}d left`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onEdit(task)}
      className={`group p-3.5 rounded-xl border transition-all duration-300 ease-out cursor-grab active:cursor-grabbing animate-[fade-in-up_0.4s_ease-out_forwards] ${
        isDragging
          ? "border-indigo-500/40 bg-indigo-500/10 ring-2 ring-indigo-500/20 scale-[1.02]"
          : "border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.04] hover:border-gray-300 dark:hover:border-white/[0.12] hover:-translate-y-1 active:scale-95 hover:shadow-xl hover:shadow-gray-200 dark:hover:shadow-white/5 shadow-sm dark:shadow-none"
      } ${task.status === "done" ? "opacity-60" : ""}`}
    >
      {/* Title */}
      <p className={`text-sm font-medium mb-2.5 leading-snug ${
        task.status === "done" ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-900 dark:text-white"
      }`}>
        {task.title}
      </p>

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Priority badge */}
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium border border-gray-200 dark:border-white/[0.04] ${p.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
          {p.label}
        </span>

        {/* Due date */}
        {task.dueDate && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${
            isOverdue ? "text-red-500 dark:text-red-400" : task.status === "done" ? "text-gray-400 dark:text-gray-600" : "text-gray-500"
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDue(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
