"use client";
import Link from "next/link";

export interface PMProject {
  _id: string;
  title: string;
  description: string;
  color: string;
  status: "active" | "archived";
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project: PMProject;
  taskStats: { total: number; done: number };
  onEdit: (project: PMProject) => void;
  onDelete: (project: PMProject) => void;
}

export default function ProjectCard({ project, taskStats, onEdit, onDelete }: ProjectCardProps) {
  const percent = taskStats.total > 0 ? Math.round((taskStats.done / taskStats.total) * 100) : 0;

  return (
    <Link
      href={`/admin/pm/${project._id}`}
      className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200 p-5 relative overflow-hidden"
    >
      {/* Color accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: project.color }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3 mt-1">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/[0.06]"
            style={{ background: `${project.color}20` }}
          >
            <span className="font-bold text-sm" style={{ color: project.color }}>
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-white truncate">{project.title}</h3>
            {project.description && (
              <p className="text-xs text-gray-500 truncate mt-0.5">{project.description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={(e) => { e.preventDefault(); onEdit(project); }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            title="Edit project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onDelete(project); }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            title="Delete project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold">Progress</span>
          <span className="text-[11px] text-gray-500">
            {taskStats.done}/{taskStats.total} tasks
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percent}%`,
              background: `linear-gradient(90deg, ${project.color}80, ${project.color})`,
            }}
          />
        </div>
      </div>

      {/* Status badge */}
      {project.status === "archived" && (
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider font-semibold bg-gray-500/10 text-gray-500 border border-gray-500/10">
          Archived
        </span>
      )}
    </Link>
  );
}
