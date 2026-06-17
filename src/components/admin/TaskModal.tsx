"use client";
import { useState, useEffect } from "react";

// ─── Types ──────────────────────────────────────────────
export interface Task {
  _id: string;
  projectId: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface TaskModalProps {
  task: Partial<Task> | null; // null = creating new, partial = editing
  projectId: string;
  onClose: () => void;
  onSave: (task: Task) => void;
  onToast: (msg: string, type: "success" | "error") => void;
}

// ─── Priority config ────────────────────────────────────
const priorityOptions: { value: Task["priority"]; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "bg-gray-500/20 text-gray-400 border-gray-500/20" },
  { value: "medium", label: "Medium", color: "bg-blue-500/20 text-blue-400 border-blue-500/20" },
  { value: "high", label: "High", color: "bg-orange-500/20 text-orange-400 border-orange-500/20" },
  { value: "urgent", label: "Urgent", color: "bg-red-500/20 text-red-400 border-red-500/20" },
];

const statusOptions: { value: Task["status"]; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

// ─── Component ──────────────────────────────────────────
export default function TaskModal({ task, projectId, onClose, onSave, onToast }: TaskModalProps) {
  const isEditing = task?._id != null;

  const [title, setTitle] = useState(task?.title || "");
  const [status, setStatus] = useState<Task["status"]>(task?.status || "todo");
  const [priority, setPriority] = useState<Task["priority"]>(task?.priority || "medium");
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.slice(0, 10) : "");
  const [saving, setSaving] = useState(false);

  // Focus title input on mount
  useEffect(() => {
    const el = document.getElementById("task-title-input");
    if (el) el.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onToast("Title is required", "error");
      return;
    }

    setSaving(true);
    try {
      const body = {
        projectId,
        title: title.trim(),
        status,
        priority,
        dueDate: dueDate || null,
        order: task?.order ?? 0,
      };

      const url = isEditing ? `/api/pm/tasks/${task._id}` : "/api/pm/tasks";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const saved = await res.json();
        onSave(saved);
        onToast(isEditing ? "Task updated" : "Task created", "success");
        onClose();
      } else {
        onToast("Failed to save task", "error");
      }
    } catch {
      onToast("Network error", "error");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!isEditing || !task._id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/pm/tasks/${task._id}`, { method: "DELETE" });
      if (res.ok) {
        onToast("Task deleted", "success");
        onSave({ ...task, _id: task._id } as Task); // Signal parent to refresh
        onClose();
      } else {
        onToast("Failed to delete", "error");
      }
    } catch {
      onToast("Network error", "error");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-white/[0.1] bg-[#0a0a1a] shadow-2xl animate-scale-up sm:rounded-2xl"
      >
        {/* Header */}
        <div className="p-5 pb-0">
          <h3 className="text-lg font-semibold text-white">
            {isEditing ? "Edit Task" : "New Task"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {isEditing ? "Update task details" : "Add a new task to this project"}
          </p>
        </div>

        {/* Fields */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5 block">Title</label>
            <input
              id="task-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5 block">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`min-h-10 px-2 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    status === opt.value
                      ? "bg-indigo-500/20 text-indigo-200 border-indigo-500/30"
                      : "bg-white/[0.02] text-gray-500 border-white/[0.06] hover:bg-white/[0.04]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5 block">Priority</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`min-h-10 px-2 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    priority === opt.value
                      ? opt.color
                      : "bg-white/[0.02] text-gray-500 border-white/[0.06] hover:bg-white/[0.04]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5 block">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 pt-0 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="order-2 sm:order-none">
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="min-h-11 w-full px-4 py-2 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer disabled:opacity-50 sm:w-auto"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="min-h-11 px-5 py-2 text-sm bg-indigo-500/20 text-indigo-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md rounded-lg hover:bg-indigo-500/30 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50 font-medium"
            >
              {saving ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        @keyframes scale-up {
          0% { opacity: 0; transform: scale(0.95); }
          50% { transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
