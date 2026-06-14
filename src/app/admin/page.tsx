"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/content");
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    const newItem = { title: "New Item", name: "New Item", description: "Edit me", body: "Edit me" };
    const res = await fetch(`/api/content/${activeTab}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });
    if (res.ok) fetchData();
  };

  const handleLogout = async () => {
    document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/admin/login");
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black-200 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">Logout</button>
      </div>
      
      <div className="flex gap-4 mb-8">
        {['projects', 'experiences', 'reviews', 'socials'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded capitalize ${activeTab === tab ? 'bg-white text-black' : 'bg-black-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-black-300 p-6 rounded border border-black-400">
        <h2 className="text-2xl font-bold mb-4 capitalize">{activeTab} Management</h2>
        {data && data[activeTab] && data[activeTab].map((item: any) => (
          <AdminItem key={item._id} type={activeTab} item={item} onUpdate={fetchData} />
        ))}
        <button onClick={handleAdd} className="mt-4 px-4 py-2 bg-green-600 rounded">
          + Add New {activeTab.slice(0, -1)}
        </button>
      </div>
    </div>
  );
}

function AdminItem({ type, item, onUpdate }: { type: string, item: any, onUpdate: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(JSON.stringify(item, null, 2));

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(formData);
      const res = await fetch(`/api/content/${type}/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed)
      });
      if (res.ok) {
        setIsEditing(false);
        onUpdate();
      } else {
        alert("Failed to update");
      }
    } catch (e) {
      alert("Invalid JSON");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/content/${type}/${item._id}`, { method: "DELETE" });
    if (res.ok) onUpdate();
  };

  if (isEditing) {
    return (
      <div className="mb-4 p-4 border border-black-400 rounded">
        <textarea 
          className="w-full h-64 bg-black-200 text-white p-2 font-mono text-sm"
          value={formData}
          onChange={(e) => setFormData(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 rounded">Save</button>
          <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 border border-black-400 rounded flex justify-between items-center bg-black-200">
      <div>
        <p className="font-bold">{item.title || item.name || item.job}</p>
        <p className="text-sm text-gray-400">{item.description || item.body || item.href}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setIsEditing(true)} className="px-3 py-1 bg-blue-600 rounded">Edit JSON</button>
        <button onClick={handleDelete} className="px-3 py-1 bg-red-600 rounded">Delete</button>
      </div>
    </div>
  );
}
