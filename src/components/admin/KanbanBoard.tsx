"use client";
import { useState, useCallback } from "react";
import KanbanCard from "./KanbanCard";
import type { Task } from "./TaskModal";

// ─── Column config ──────────────────────────────────────
const columns: { id: Task["status"]; title: string; accent: string; dotColor: string }[] = [
  { id: "todo", title: "To Do", accent: "border-gray-500/20", dotColor: "bg-gray-400" },
  { id: "in_progress", title: "In Progress", accent: "border-blue-500/20", dotColor: "bg-blue-400" },
  { id: "done", title: "Done", accent: "border-green-500/20", dotColor: "bg-green-400" },
];

interface KanbanBoardProps {
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
  onTaskAdd: (status: Task["status"]) => void;
  onReorder: (tasks: { _id: string; status: string; order: number }[]) => void;
}

export default function KanbanBoard({ tasks, onTaskEdit, onTaskAdd, onReorder }: KanbanBoardProps) {
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Group tasks by status
  const grouped = useCallback(() => {
    const map: Record<string, Task[]> = { todo: [], in_progress: [], done: [] };
    tasks.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
    });
    // Sort each column by order
    Object.keys(map).forEach((key) => {
      map[key].sort((a, b) => a.order - b.order);
    });
    return map;
  }, [tasks]);

  const tasksByStatus = grouped();

  // ─── Drag handlers (column-level) ─────────────────────
  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the column, not entering a child
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Task["status"]) => {
    e.preventDefault();
    setDragOverColumn(null);

    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const { _id, status: fromStatus } = data;

      if (fromStatus === targetStatus) return; // Dropped in same column

      // Build the reorder payload
      // 1. Remove task from old column
      // 2. Add to new column at the end
      const updates: { _id: string; status: string; order: number }[] = [];

      // Reorder source column (fill the gap)
      const sourceColumn = tasksByStatus[fromStatus].filter((t) => t._id !== _id);
      sourceColumn.forEach((t, i) => {
        if (t.order !== i) {
          updates.push({ _id: t._id, status: fromStatus, order: i });
        }
      });

      // Add to target column at end
      const targetColumn = tasksByStatus[targetStatus];
      const newOrder = targetColumn.length; // Append at end
      updates.push({ _id, status: targetStatus, order: newOrder });

      onReorder(updates);
    } catch {
      // Invalid drag data
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
      {columns.map((col) => {
        const colTasks = tasksByStatus[col.id] || [];
        const isOver = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col rounded-2xl border transition-all duration-200 ${
              isOver
                ? "border-indigo-500/30 bg-indigo-500/[0.03] ring-1 ring-indigo-500/10"
                : "border-white/[0.06] bg-white/[0.01]"
            }`}
          >
            {/* Column header */}
            <div className={`px-3 py-3 sm:px-4 border-b ${col.accent} flex items-center justify-between`}>
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <span className="text-sm font-semibold text-white">{col.title}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-500">
                  {colTasks.length}
                </span>
              </div>
              <button
                onClick={() => onTaskAdd(col.id)}
                className="min-h-9 min-w-9 p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                title={`Add task to ${col.title}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>

            {/* Cards */}
            <div className="flex-1 p-2.5 sm:p-3 space-y-2.5 min-h-[96px] sm:min-h-[120px]">
              {colTasks.length === 0 ? (
                <div className={`flex items-center justify-center h-20 rounded-xl border-2 border-dashed transition-colors ${
                  isOver ? "border-indigo-500/30 text-indigo-400" : "border-white/[0.04] text-gray-600"
                }`}>
                  <p className="text-xs">{isOver ? "Drop here" : "No tasks"}</p>
                </div>
              ) : (
                colTasks.map((task) => (
                  <KanbanCard key={task._id} task={task} onEdit={onTaskEdit} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
