"use client";
import { useState, useEffect } from "react";

interface Company {
  siren: string
  name: string
  activity: string
  city: string
  postal: string
  email: string | null
  phone: string | null
  website: string | null
  hasWebsite?: boolean
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [naf, setNaf] = useState("");
  const [addedSirens, setAddedSirens] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/prospects")
      .then(res => res.json())
      .then(data => {
        const sirens = new Set<string>(data.map((p: any) => p.siren))
        setAddedSirens(sirens)
      })
  }, [])

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?query=${query}&dept=${dept}&naf=${naf}`);
      const data = await res.json();
      const companies = Array.isArray(data) ? data : [];
      const checked = await Promise.all(
        companies.map(async (company: Company) => {
          const res = await fetch(
            `/api/check-website?companyName=${encodeURIComponent(company.name)}&city=${encodeURIComponent(company.city)}&sirenWebsite=${company.website || ""}`,
          );
          const result = await res.json();
          return {
            ...company,
            hasWebsite: result.hasWebsite,
            website: result.websiteUrl,
            phone: result.phone || company.phone,
          };
        }),
      );
      setResults(checked);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function addProspect(company: Company) {
    await fetch("/api/prospects", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(company),
    });
    setAddedSirens(prev => new Set([...prev, company.siren]))
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black" style={{ color: "#B0413E" }}>Recherche d'entreprises</h1>
        <p className="mt-1" style={{ color: "#B0413E", opacity: 0.6 }}>Trouvez les entreprises locales sans site web</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide mb-1 block" style={{ color: "#B0413E" }}>
              Secteur
            </label>
            <select
              value={naf}
              onChange={(e) => setNaf(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              style={{ borderColor: "#FCAA67", color: "#B0413E" }}
            >
              <option value="">Tous secteurs</option>
              <option value="10.71C">Boulangerie</option>
              <option value="56.10A">Restaurant</option>
              <option value="96.02A">Coiffeur</option>
              <option value="43.22A">Plomberie</option>
              <option value="43.21A">Electricien</option>
              <option value="43.32A">Menuiserie</option>
              <option value="43.34Z">Peinture</option>
              <option value="47.11B">Epicerie</option>
              <option value="45.20A">Garage auto</option>
              <option value="86.21Z">Medecin</option>
              <option value="86.23Z">Dentiste</option>
              <option value="86.90A">Kinesitherapeute</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide mb-1 block" style={{ color: "#B0413E" }}>
              Departement
            </label>
            <input
              type="text"
              placeholder="ex: 29"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              style={{ borderColor: "#FCAA67", color: "#B0413E" }}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full font-bold py-2.5 px-6 rounded-xl transition disabled:opacity-50"
              style={{ backgroundColor: "#B0413E", color: "#FFFFC7" }}
            >
              {loading ? "Recherche en cours..." : "Rechercher"}
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12" style={{ color: "#B0413E", opacity: 0.5 }}>
          <p>Recherche en cours...</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #FFFFC7" }}>
            <p className="text-sm" style={{ color: "#B0413E" }}>
              <span className="font-bold">{results.length}</span> entreprises trouvees
            </p>
          </div>
          <ul>
            {results.map((company) => (
              <li
                key={company.siren}
                className="px-6 py-4 flex items-center gap-4 transition"
                style={{ borderBottom: "1px solid #FFFFC7" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="font-semibold" style={{ color: "#B0413E" }}>
                      {company.name}
                    </strong>
                    {company.hasWebsite ? (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "#FCAA67", color: "white" }}
                      >
                        A un site
                      </span>
                    ) : (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "#B0413E", color: "#FFFFC7" }}
                      >
                        Sans site
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: "#B0413E", opacity: 0.6 }}>
                    <span>{company.city} {company.postal}</span>
                    {company.phone && <span>{company.phone}</span>}
                    {company.hasWebsite && company.website && (
                      
                      <a href={company.website}
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
                <button
                  onClick={() => addProspect(company)}
                  disabled={addedSirens.has(company.siren)}
                  className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                  style={
                    addedSirens.has(company.siren)
                      ? { backgroundColor: "#FFFFC7", color: "#B0413E" }
                      : { backgroundColor: "#B0413E", color: "#FFFFC7" }
                  }
                >
                  {addedSirens.has(company.siren) ? "Deja ajoute" : "Ajouter"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="text-center py-16" style={{ color: "#B0413E", opacity: 0.4 }}>
          <p className="font-medium">Lancez une recherche pour voir les resultats</p>
        </div>
      )}
    </div>
  )
}