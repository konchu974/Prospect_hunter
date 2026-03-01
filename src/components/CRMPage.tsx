"use client";
import { useState, useEffect } from "react";

interface Prospect {
  id: string;
  siren: string;
  name: string;
  city: string;
  activity: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  contacted: "Contacté",
  interested: "Intéressé",
  won: "Client",
  lost: "Perdu",
}

const STATUS_BG: Record<string, string> = {
  new: "#FFFFC7",
  contacted: "#FFFFC7",
  interested: "#FCAA67",
  won: "#B0413E",
  lost: "#B0413E",
}

const STATUS_TEXT: Record<string, string> = {
  new: "#B0413E",
  contacted: "#B0413E",
  interested: "white",
  won: "#FFFFC7",
  lost: "#FFFFC7",
}

export default function CRMPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadProspects()
  }, []);

  async function loadProspects() {
    const res = await fetch("/api/prospects");
    const data = await res.json();
    setProspects(data);
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/prospects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadProspects();
  }

  async function deleteProspect(id: string) {
    await fetch(`/api/prospects/${id}`, { method: "DELETE" });
    setProspects((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = filter === "all"
    ? prospects
    : prospects.filter(p => p.status === filter)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black" style={{ color: "#B0413E" }}>Mes Prospects</h1>
        <p className="mt-1" style={{ color: "#B0413E", opacity: 0.6 }}>{prospects.length} entreprises dans votre pipeline</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: "all", label: `Tous (${prospects.length})` },
          { value: "new", label: `Nouveaux (${prospects.filter(p => p.status === "new").length})` },
          { value: "contacted", label: `Contactés (${prospects.filter(p => p.status === "contacted").length})` },
          { value: "interested", label: `Intéressés (${prospects.filter(p => p.status === "interested").length})` },
          { value: "won", label: `Clients (${prospects.filter(p => p.status === "won").length})` },
          { value: "lost", label: `Perdus (${prospects.filter(p => p.status === "lost").length})` },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition"
            style={
              filter === f.value
                ? { backgroundColor: "#B0413E", color: "#FFFFC7" }
                : { backgroundColor: "white", color: "#B0413E", border: "1px solid #FCAA67" }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "#B0413E", opacity: 0.4 }}>
          <p className="font-medium">Aucun prospect ici</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((prospect) => (
            <div
              key={prospect.id}
              className="bg-white rounded-2xl shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4 transition hover:shadow-md"
              style={{ border: "1px solid #FFFFC7" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <strong className="font-semibold" style={{ color: "#B0413E" }}>
                    {prospect.name}
                  </strong>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: STATUS_BG[prospect.status],
                      color: STATUS_TEXT[prospect.status]
                    }}
                  >
                    {STATUS_LABELS[prospect.status]}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: "#B0413E", opacity: 0.6 }}>
                  <span>{prospect.city}</span>
                  <span>{prospect.activity}</span>
                  {prospect.phone && <span>{prospect.phone}</span>}
                  {prospect.website && (
                    
                      <a href={prospect.website}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                      style={{ color: "#FCAA67" }}
                    >
                      Voir le site
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={prospect.status}
                  onChange={(e) => updateStatus(prospect.id, e.target.value)}
                  className="border rounded-xl px-3 py-2 text-sm focus:outline-none flex-1 md:flex-none"
                  style={{ borderColor: "#FCAA67", color: "#B0413E" }}
                >
                  <option value="new">Nouveau</option>
                  <option value="contacted">Contacté</option>
                  <option value="interested">Intéressé</option>
                  <option value="won">Client</option>
                  <option value="lost">Perdu</option>
                </select>

                <button
                  onClick={() => deleteProspect(prospect.id)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold transition shrink-0"
                  style={{ backgroundColor: "#FFFFC7", color: "#B0413E" }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}