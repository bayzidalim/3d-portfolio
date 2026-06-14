"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to fetch data", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    setAdding(true);
    const templates: Record<string, any> = {
      projects: { title: "New Project", description: "Edit me", subDescription: [], href: "", logo: "", image: "", tags: [], order: 99 },
      experiences: { title: "New Role", job: "Company Name", date: "2024 - Present", contents: ["Description here"], order: 99 },
      reviews: { name: "Client Name", username: "@username", body: "Review text here", img: "https://robohash.org/newclient", order: 99 },
      socials: { name: "Platform", href: "https://example.com", icon: "/assets/socials/linkedIn.svg", order: 99 },
    };
    try {
      const res = await fetch(`/api/content/${activeTab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templates[activeTab] || {}),
      });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json();
        alert("Failed to add: " + (err.error || "Unknown error"));
      }
    } catch (e) {
      alert("Network error while adding item");
    }
    setAdding(false);
  };

  const handleLogout = () => {
    // Clear the cookie by setting it to expire in the past for all paths
    document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/admin";
    // Force a hard navigation to bypass client-side cache
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
        {["projects", "experiences", "reviews", "socials"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded capitalize cursor-pointer transition-colors ${
              activeTab === tab
                ? "bg-white text-black font-bold"
                : "bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#111] p-4 md:p-6 rounded-lg border border-[#333]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold capitalize">{activeTab} Management</h2>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {adding ? "Adding..." : `+ Add New`}
          </button>
        </div>

        {data && data[activeTab] && data[activeTab].length > 0 ? (
          data[activeTab].map((item: any) => (
            <AdminItem key={item._id} type={activeTab} item={item} onUpdate={fetchData} />
          ))
        ) : (
          <p className="text-gray-500">No {activeTab} found. Click &quot;Add New&quot; to create one.</p>
        )}
      </div>
    </div>
  );
}

function AdminItem({ type, item, onUpdate }: { type: string; item: any; onUpdate: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(JSON.stringify(item, null, 2));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsed = JSON.parse(formData);
      // Remove MongoDB internal fields before sending
      const { _id, __v, createdAt, updatedAt, ...cleanData } = parsed;
      const res = await fetch(`/api/content/${type}/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });
      if (res.ok) {
        setIsEditing(false);
        onUpdate();
      } else {
        const err = await res.json();
        alert("Failed to update: " + (err.error || "Unknown error"));
      }
    } catch (e) {
      alert("Invalid JSON format. Please check your input.");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/content/${type}/${item._id}`, { method: "DELETE" });
      if (res.ok) {
        onUpdate();
      } else {
        alert("Failed to delete");
      }
    } catch (e) {
      alert("Network error while deleting");
    }
  };

  if (isEditing) {
    return (
      <div className="mb-4 p-4 border border-[#444] rounded-lg bg-[#0a0a0a]">
        <textarea
          className="w-full h-64 bg-[#1a1a1a] text-white p-3 font-mono text-sm rounded border border-[#333] focus:outline-none focus:border-blue-500"
          value={formData}
          onChange={(e) => setFormData(e.target.value)}
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              setFormData(JSON.stringify(item, null, 2));
              setIsEditing(false);
            }}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 p-4 border border-[#333] rounded-lg flex justify-between items-center bg-[#1a1a1a] hover:bg-[#222] transition-colors">
      <div className="flex-1 min-w-0 mr-4">
        <p className="font-bold truncate">{item.title || item.name || item.job}</p>
        <p className="text-sm text-gray-400 truncate">{item.description || item.body || item.href}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1.5 bg-blue-600 rounded hover:bg-blue-700 transition-colors cursor-pointer text-sm"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 bg-red-600 rounded hover:bg-red-700 transition-colors cursor-pointer text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
