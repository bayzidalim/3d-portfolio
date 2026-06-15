"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// ─── Icons ──────────────────────────────────────────────
const IconProjects = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
);
const IconExperiences = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);
const IconReviews = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);
const IconSocials = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" />
  </svg>
);

const tabIcons: Record<string, React.ReactNode> = {
  projects: <IconProjects />,
  experiences: <IconExperiences />,
  reviews: <IconReviews />,
  socials: <IconSocials />,
};

const tabGlassActive: Record<string, string> = {
  projects: "bg-blue-500/20 text-blue-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
  experiences: "bg-purple-500/20 text-purple-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
  reviews: "bg-amber-500/20 text-amber-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
  socials: "bg-green-500/20 text-green-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md",
};

const tabGlassHover: Record<string, string> = {
  projects: "hover:bg-blue-500/30 hover:border-white/20",
  experiences: "hover:bg-purple-500/30 hover:border-white/20",
  reviews: "hover:bg-amber-500/30 hover:border-white/20",
  socials: "hover:bg-green-500/30 hover:border-white/20",
};

const tabBorderColors: Record<string, string> = {
  projects: "border-blue-500/30",
  experiences: "border-purple-500/30",
  reviews: "border-amber-500/30",
  socials: "border-green-500/30",
};

const templates: Record<string, any> = {
  projects: { title: "New Project", description: "Edit this project description", subDescription: ["Feature 1", "Feature 2"], href: "https://example.com", logo: "/assets/logos/react.svg", image: "", tags: [{ id: 1, name: "React.js", path: "/assets/logos/react.svg" }], order: 99 },
  experiences: { title: "New Role", job: "Company Name", date: "2024 - Present", contents: ["Responsibility 1", "Responsibility 2"], order: 99 },
  reviews: { name: "Client Name", username: "@username", body: "Review text here", img: "https://robohash.org/newclient", order: 99 },
  socials: { name: "Platform", href: "https://example.com", icon: "/assets/socials/linkedIn.svg", order: 99 },
};

// ─── Portfolio Content (inner, uses useSearchParams) ─────
function PortfolioContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "projects";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content");
      if (res.ok) setData(await res.json());
    } catch (e) {
      showToast("Failed to load data", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async () => {
    setAdding(true);
    try {
      const res = await fetch(`/api/content/${activeTab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templates[activeTab] || {}),
      });
      if (res.ok) {
        showToast(`New ${activeTab.slice(0, -1)} added successfully`);
        await fetchData();
      } else {
        showToast("Failed to add item", "error");
      }
    } catch (e) {
      showToast("Network error", "error");
    }
    setAdding(false);
  };

  const currentItems = data?.[activeTab] || [];

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
          <h1 className="text-2xl md:text-3xl font-bold capitalize">{activeTab}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {currentItems.length} {currentItems.length === 1 ? "item" : "items"} total
          </p>
        </div>
        <button
          onClick={handleAdd}
          disabled={adding}
          className={`inline-flex items-center gap-2 px-5 py-2.5 ${tabGlassActive[activeTab]} ${tabGlassHover[activeTab]} text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50`}
        >
          {adding ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Adding...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add {activeTab.slice(0, -1)}
            </>
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-white/[0.02] animate-pulse border border-white/[0.04]" />
          ))}
        </div>
      ) : currentItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className={`w-16 h-16 rounded-2xl ${tabGlassActive[activeTab]} flex items-center justify-center mb-4`}>
            {tabIcons[activeTab]}
          </div>
          <p className="text-gray-500 text-sm">No {activeTab} yet</p>
          <p className="text-gray-600 text-xs mt-1">Click the button above to add your first one</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {currentItems.map((item: any, index: number) => (
            <AdminItem
              key={item._id}
              type={activeTab}
              item={item}
              index={index}
              onUpdate={fetchData}
              onToast={showToast}
              borderColor={tabBorderColors[activeTab]}
            />
          ))}
        </div>
      )}
    </>
  );
}

// ─── Exported Page (Suspense wrapper for useSearchParams) ─
export default function PortfolioPage() {
  return (
    <Suspense fallback={
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-white/[0.02] animate-pulse border border-white/[0.04]" />
        ))}
      </div>
    }>
      <PortfolioContent />
    </Suspense>
  );
}

// ─── Item Card ──────────────────────────────────────────
function AdminItem({
  type,
  item,
  index,
  onUpdate,
  onToast,
  borderColor,
}: {
  type: string;
  item: any;
  index: number;
  onUpdate: () => void;
  onToast: (msg: string, type: "success" | "error") => void;
  borderColor: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openEditor = () => {
    // Remove internal MongoDB fields for cleaner editing
    const { _id, __v, createdAt, updatedAt, ...clean } = item;
    setFormData(JSON.stringify(clean, null, 2));
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsed = JSON.parse(formData);
      const res = await fetch(`/api/content/${type}/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (res.ok) {
        setIsEditing(false);
        onToast("Updated successfully", "success");
        onUpdate();
      } else {
        onToast("Failed to update", "error");
      }
    } catch (e) {
      onToast("Invalid JSON format", "error");
    }
    setSaving(false);
  };

  const confirmDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/content/${type}/${item._id}`, { method: "DELETE" });
      if (res.ok) {
        onToast("Deleted successfully", "success");
        setShowDeleteModal(false);
        onUpdate();
      } else {
        onToast("Failed to delete", "error");
        setShowDeleteModal(false);
      }
    } catch (e) {
      onToast("Network error", "error");
      setShowDeleteModal(false);
    }
    setDeleting(false);
  };

  // Editing view
  if (isEditing) {
    return (
      <div className={`rounded-xl border ${borderColor} bg-white/[0.02] overflow-hidden`}>
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-sm font-medium text-yellow-400">Editing</span>
          </div>
          <span className="text-[11px] text-gray-600 font-mono">{item._id}</span>
        </div>
        <textarea
          className="w-full min-h-[320px] bg-transparent text-gray-300 p-5 font-mono text-[13px] leading-relaxed focus:outline-none resize-y"
          value={formData}
          onChange={(e) => setFormData(e.target.value)}
          spellCheck={false}
        />
        <div className="p-4 border-t border-white/[0.06] flex items-center gap-2 justify-end bg-white/[0.01]">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm bg-blue-500/20 text-blue-200 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md rounded-lg hover:bg-blue-500/30 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50 font-medium"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    );
  }

  // Display view
  const title = item.title || item.name || item.job || "Untitled";
  const subtitle = item.description || item.body || item.href || item.date || "";

  return (
    <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200 p-4 flex items-center gap-4">
      {/* Order badge */}
      <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
        <span className="text-xs text-gray-500 font-mono">{index + 1}</span>
      </div>

      {/* Thumbnail for projects */}
      {type === "projects" && item.image && (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/[0.04] shrink-0 hidden sm:block">
          <img src={item.image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-white truncate">{title}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{subtitle}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
        <button
          onClick={openEditor}
          className="p-2 rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer text-gray-400 hover:text-blue-400"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </button>
        <button
          onClick={confirmDelete}
          className="p-2 rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer text-gray-400 hover:text-white"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDeleteModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#0a0a0a] border border-white/[0.1] rounded-2xl p-6 md:p-8 w-full max-w-sm shadow-2xl animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center mb-5 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-white text-center mb-2">Delete this {type.slice(0, -1)}?</h3>
            <p className="text-sm text-gray-400 text-center mb-8">
              This action cannot be undone. &quot;{title}&quot; will be permanently removed.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {deleting ? (
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  "Delete Permanently"
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="w-full py-3 bg-transparent text-gray-400 font-medium rounded-xl hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
