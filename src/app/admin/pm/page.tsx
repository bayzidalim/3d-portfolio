"use client";
import { useEffect, useState, useCallback } from "react";
import ProjectCard from "@/components/admin/ProjectCard";
import type { PMProject } from "@/components/admin/ProjectCard";

// ─── Project form modal ─────────────────────────────────
function ProjectFormModal({
  project,
  onClose,
  onSaved,
  onToast,
}: {
  project: Partial<PMProject> | null;
  onClose: () => void;
  onSaved: () => void;
  onToast: (msg: string, type: "success" | "error") => void;
}) {
  const isEditing = project?._id != null;
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [color, setColor] = useState(project?.color || "#6366f1");
  const [saving, setSaving] = useState(false);

  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { onToast("Title is required", "error"); return; }
    setSaving(true);
    try {
      const url = isEditing ? `/api/pm/projects/${project._id}` : "/api/pm/projects";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim(), color }),
      });
      if (res.ok) {
        onToast(isEditing ? "Project updated" : "Project created", "success");
        onSaved();
        onClose();
      } else {
        onToast("Failed to save project", "error");
      }
    } catch {
      onToast("Network error", "error");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-white dark:bg-[#0a0a1a] border border-gray-200 dark:border-white/[0.1] rounded-2xl w-full max-w-md shadow-2xl animate-scale-up overflow-hidden">
        <div className="p-5 pb-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{isEditing ? "Edit Project" : "New Project"}</h3>
        </div>
        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5 block">Project Name</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My awesome project"
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          {/* Description */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5 block">Description <span className="text-gray-700">(optional)</span></label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief summary"
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          {/* Color */}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all cursor-pointer ${
                    color === c ? "border-gray-900 dark:border-white scale-110" : "border-transparent hover:border-gray-400 dark:hover:border-white/30"
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 pt-0 flex items-center gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all cursor-pointer">Cancel</button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 text-sm bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-200 border border-indigo-200 dark:border-white/10 shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/30 hover:border-indigo-300 dark:hover:border-white/20 transition-all cursor-pointer disabled:opacity-50 font-medium"
          >
            {saving ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
        </div>
      </form>
      <style jsx>{`
        @keyframes scale-up { 0% { opacity: 0; transform: scale(0.95); } 50% { transform: scale(1.02); } 100% { opacity: 1; transform: scale(1); } }
        .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

// ─── Delete confirmation modal ──────────────────────────
function DeleteModal({
  project,
  onClose,
  onDeleted,
  onToast,
}: {
  project: PMProject;
  onClose: () => void;
  onDeleted: () => void;
  onToast: (msg: string, type: "success" | "error") => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/pm/projects/${project._id}`, { method: "DELETE" });
      if (res.ok) {
        onToast("Project deleted", "success");
        onDeleted();
        onClose();
      } else {
        onToast("Failed to delete", "error");
      }
    } catch {
      onToast("Network error", "error");
    }
    setDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/[0.1] rounded-2xl p-6 md:p-8 w-full max-w-sm shadow-2xl animate-scale-up">
        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-white/[0.05] flex items-center justify-center mb-5 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">Delete &quot;{project.title}&quot;?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8">This will permanently delete the project and all its tasks.</p>
        <div className="flex flex-col gap-3">
          <button onClick={handleDelete} disabled={deleting} className="w-full py-3 bg-red-500 dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-red-600 dark:hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center">
            {deleting ? (
              <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            ) : "Delete Permanently"}
          </button>
          <button onClick={onClose} disabled={deleting} className="w-full py-3 bg-transparent text-gray-600 dark:text-gray-400 font-medium rounded-xl hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer disabled:opacity-50">Cancel</button>
        </div>
      </div>
      <style jsx>{`
        @keyframes scale-up { 0% { opacity: 0; transform: scale(0.95); } 50% { transform: scale(1.02); } 100% { opacity: 1; transform: scale(1); } }
        .animate-scale-up { animation: scale-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

// ─── Main PM Dashboard ──────────────────────────────────
export default function PMDashboard() {
  const [projects, setProjects] = useState<PMProject[]>([]);
  const [taskStats, setTaskStats] = useState<Record<string, { total: number; done: number }>>({});
  const [loading, setLoading] = useState(true);
  const [formProject, setFormProject] = useState<Partial<PMProject> | null | "new">(null);
  const [deleteProject, setDeleteProject] = useState<PMProject | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pm/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);

        // Fetch task counts for each project
        const stats: Record<string, { total: number; done: number }> = {};
        await Promise.all(
          data.map(async (p: PMProject) => {
            try {
              const taskRes = await fetch(`/api/pm/tasks?projectId=${p._id}`);
              if (taskRes.ok) {
                const tasks = await taskRes.json();
                stats[p._id] = {
                  total: tasks.length,
                  done: tasks.filter((t: any) => t.status === "done").length,
                };
              } else {
                stats[p._id] = { total: 0, done: 0 };
              }
            } catch {
              stats[p._id] = { total: 0, done: 0 };
            }
          })
        );
        setTaskStats(stats);
      }
    } catch {
      showToast("Failed to load projects", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">
            {projects.length} {projects.length === 1 ? "project" : "projects"} total
          </p>
        </div>
        <button
          onClick={() => setFormProject("new")}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-200 border border-indigo-200 dark:border-white/10 shadow-sm dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md hover:bg-indigo-100 dark:hover:bg-indigo-500/30 hover:border-indigo-300 dark:hover:border-white/20 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Project
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-gray-100 dark:bg-white/[0.02] animate-pulse border border-gray-200 dark:border-white/[0.04]" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No projects yet</p>
          <p className="text-gray-600 text-xs mt-1">Create your first project to start managing tasks</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              taskStats={taskStats[project._id] || { total: 0, done: 0 }}
              onEdit={(p) => setFormProject(p)}
              onDelete={(p) => setDeleteProject(p)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {formProject && (
        <ProjectFormModal
          project={formProject === "new" ? {} : formProject}
          onClose={() => setFormProject(null)}
          onSaved={fetchProjects}
          onToast={showToast}
        />
      )}
      {deleteProject && (
        <DeleteModal
          project={deleteProject}
          onClose={() => setDeleteProject(null)}
          onDeleted={fetchProjects}
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
