"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import ViewSwitcher from "@/components/admin/ViewSwitcher";
import KanbanBoard from "@/components/admin/KanbanBoard";
import CalendarView from "@/components/admin/CalendarView";
import ChecklistView from "@/components/admin/ChecklistView";
import TaskModal from "@/components/admin/TaskModal";
import type { ViewType } from "@/components/admin/ViewSwitcher";
import type { Task } from "@/components/admin/TaskModal";
import type { PMProject } from "@/components/admin/ProjectCard";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<PMProject | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>("kanban");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Task modal state
  const [modalTask, setModalTask] = useState<Partial<Task> | null>(null);
  const [showModal, setShowModal] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Data fetching ────────────────────────────────────
  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch("/api/pm/projects");
      if (res.ok) {
        const projects = await res.json();
        const found = projects.find((p: PMProject) => p._id === projectId);
        if (found) setProject(found);
        else { router.push("/admin/pm"); return; }
      }
    } catch {
      showToast("Failed to load project", "error");
    }
  }, [projectId, router]);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`/api/pm/tasks?projectId=${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch {
      showToast("Failed to load tasks", "error");
    }
  }, [projectId]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchProject(), fetchTasks()]);
      setLoading(false);
    };
    load();
  }, [fetchProject, fetchTasks]);

  // ─── Task operations ─────────────────────────────────
  const handleTaskEdit = (task: Task) => {
    setModalTask(task);
    setShowModal(true);
  };

  const handleTaskAdd = (statusOrDate?: string) => {
    const newTask: Partial<Task> = { projectId };

    // If called from Kanban with a status
    if (statusOrDate === "todo" || statusOrDate === "in_progress" || statusOrDate === "done") {
      newTask.status = statusOrDate;
    }
    // If called from Calendar with a date string
    else if (statusOrDate && statusOrDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      newTask.dueDate = statusOrDate;
    }

    setModalTask(newTask);
    setShowModal(true);
  };

  const handleTaskSaved = () => {
    fetchTasks(); // Refresh tasks after create/edit/delete
  };

  const handleReorder = async (updates: { _id: string; status: string; order: number }[]) => {
    // Optimistic update
    setTasks((prev) => {
      const next = [...prev];
      updates.forEach((update) => {
        const idx = next.findIndex((t) => t._id === update._id);
        if (idx !== -1) {
          next[idx] = { ...next[idx], status: update.status as Task["status"], order: update.order };
        }
      });
      return next;
    });

    // Persist to server
    try {
      const res = await fetch("/api/pm/tasks/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: updates }),
      });
      if (!res.ok) {
        showToast("Failed to save order", "error");
        fetchTasks(); // Revert
      }
    } catch {
      showToast("Network error", "error");
      fetchTasks(); // Revert
    }
  };

  const handleTaskToggle = async (task: Task) => {
    const newStatus = task.status === "done" ? "todo" : "done";

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: newStatus as Task["status"] } : t))
    );

    try {
      const res = await fetch(`/api/pm/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        showToast("Failed to update task", "error");
        fetchTasks();
      }
    } catch {
      showToast("Network error", "error");
      fetchTasks();
    }
  };

  // ─── Stats ────────────────────────────────────────────
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 rounded-xl bg-gray-200 dark:bg-white/[0.02] animate-pulse" />
        <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-white/[0.02] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-gray-100 dark:bg-white/[0.02] animate-pulse border border-gray-200 dark:border-white/[0.04]" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl backdrop-blur-xl border transition-all duration-300 animate-slide-in ${
          toast.type === "success"
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Breadcrumb + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/pm")}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 dark:border-white/[0.06]"
            style={{ background: `${project.color}20` }}
          >
            <span className="font-bold text-xs" style={{ color: project.color }}>
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
            {project.description && (
              <p className="text-xs text-gray-500 mt-0.5">{project.description}</p>
            )}
          </div>
        </div>

        {/* Controls row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
            <span className="text-xs text-gray-600 hidden sm:block">
              {doneTasks}/{totalTasks} completed
            </span>
          </div>

          {activeView === "kanban" && (
            <button
              onClick={() => handleTaskAdd("todo")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-200 border border-indigo-200 dark:border-white/10 text-xs font-medium rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Task
            </button>
          )}
        </div>
      </div>

      {/* Active View */}
      {activeView === "kanban" && (
        <KanbanBoard
          tasks={tasks}
          onTaskEdit={handleTaskEdit}
          onTaskAdd={(status) => handleTaskAdd(status)}
          onReorder={handleReorder}
        />
      )}

      {activeView === "calendar" && (
        <CalendarView
          tasks={tasks}
          onTaskEdit={handleTaskEdit}
          onTaskAdd={(date) => handleTaskAdd(date)}
        />
      )}

      {activeView === "checklist" && (
        <ChecklistView
          tasks={tasks}
          onTaskEdit={handleTaskEdit}
          onTaskToggle={handleTaskToggle}
          onTaskAdd={() => handleTaskAdd()}
        />
      )}

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={modalTask}
          projectId={projectId}
          onClose={() => { setShowModal(false); setModalTask(null); }}
          onSave={handleTaskSaved}
          onToast={showToast}
        />
      )}

      <style jsx>{`
        @keyframes slide-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </>
  );
}
