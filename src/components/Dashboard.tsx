"use client"
import { useState, useEffect } from "react"

interface Prospect {
  id: string
  siren: string
  name: string
  city: string
  activity: string
  email: string | null
  status: string
  notes: string | null
  createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-gray-100 text-gray-600",
  contacted: "text-white",
  interested: "text-white",
  won: "text-white",
  lost: "text-white",
}

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  contacted: "Contacté",
  interested: "Intéressé",
  won: "Client",
  lost: "Perdu",
}

export default function Dashboard() {
  const [prospects, setProspects] = useState<Prospect[]>([])

  useEffect(() => {
    async function loadProspects() {
      const res = await fetch("/api/prospects")
      const data = await res.json()
      setProspects(data)
    }
    loadProspects()
  }, [])

  const total = prospects.length
  const nouveaux = prospects.filter(p => p.status === "new").length
  const contactes = prospects.filter(p => p.status === "contacted").length
  const interesses = prospects.filter(p => p.status === "interested").length
  const clients = prospects.filter(p => p.status === "won").length
  const perdus = prospects.filter(p => p.status === "lost").length
  const tauxContact = total ? Math.round((contactes + interesses + clients + perdus) / total * 100) : 0

  const recent = [...prospects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black" style={{ color: "#B0413E" }}>Tableau de bord</h1>
        <p className="mt-1" style={{ color: "#B0413E", opacity: 0.6 }}>Vue d'ensemble de votre prospection</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total prospects", value: total, bg: "#B0413E" },
          { label: "Contactés", value: contactes, bg: "#B0413E" },
          { label: "Intéressés", value: interesses, bg: "#FCAA67" },
          { label: "Clients", value: clients, bg: "#B0413E" },
        ].map(kpi => (
          <div
            key={kpi.label}
            className="rounded-2xl p-5 shadow-sm"
            style={{ backgroundColor: kpi.bg }}
          >
            <div className="text-4xl font-black" style={{ color: "#FFFFC7" }}>{kpi.value}</div>
            <div className="text-sm mt-1" style={{ color: "#FFFFC7", opacity: 0.8 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Taux de contact */}
        <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: "white" }}>
          <h2 className="font-bold mb-4" style={{ color: "#B0413E" }}>Taux de contact</h2>
          <div className="flex items-end gap-3 mb-3">
            <span className="text-4xl font-black" style={{ color: "#B0413E" }}>{tauxContact}%</span>
            <span className="text-gray-400 text-sm mb-1">des prospects contactés</span>
          </div>
          <div className="w-full rounded-full h-3" style={{ backgroundColor: "#FFFFC7" }}>
            <div
              className="h-3 rounded-full transition-all"
              style={{ width: `${tauxContact}%`, backgroundColor: "#FCAA67" }}
            />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {[
              { label: "Nouveaux", value: nouveaux, color: "#B0413E" },
              { label: "Contactés", value: contactes, color: "#FCAA67" },
              { label: "Intéressés", value: interesses, color: "#FCAA67" },
              { label: "Clients", value: clients, color: "#B0413E" },
              { label: "Perdus", value: perdus, color: "#B0413E" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-500 flex-1">{item.label}</span>
                <span className="text-sm font-semibold" style={{ color: "#B0413E" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Derniers ajoutés */}
        <div className="rounded-2xl shadow-sm p-6" style={{ backgroundColor: "white" }}>
          <h2 className="font-bold mb-4" style={{ color: "#B0413E" }}>Derniers ajoutés</h2>
          {recent.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucun prospect pour l'instant</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recent.map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "#B0413E" }}>{p.name}</p>
                    <p className="text-xs text-gray-400">{p.city}</p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: p.status === "won" ? "#B0413E" : p.status === "interested" ? "#FCAA67" : "#FFFFC7",
                      color: p.status === "new" || p.status === "contacted" ? "#B0413E" : "white"
                    }}
                  >
                    {STATUS_LABELS[p.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}