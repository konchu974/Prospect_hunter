export interface Company {
  siren: string
  name: string
  activity: string
  city: string
  postal: string
  email: string | null
  phone: string | null
  website: string | null
  address: string
}

export async function searchCompanies(
  query: string,
  dept: string,
  naf: string,
  perPage = 25
): Promise<Company[]> {
  const params = new URLSearchParams()
  if (query) params.set("q", query)
  if (dept) params.set("departement", dept)
  if (naf) params.set("activite_principale", naf)
  params.set("per_page", String(perPage))
  params.set("etat_administratif", "A")

  const fullUrl = `https://recherche-entreprises.api.gouv.fr/search?${params}`
  console.log("URL appelée:", fullUrl)
  const res = await fetch(fullUrl)

  if (!res.ok) {
      const errorText = await res.text()
      console.log("Status:", res.status)
      console.log("Erreur API:", errorText)
      throw new Error("Erreur API SIRENE")
    }

  const data = await res.json()

  return (data.results || []).map((raw: any): Company => {
    const etab = raw.matching_etablissements?.[0] || raw.siege || {}
    return {
      siren: raw.siren,
      name: raw.nom_complet || raw.personne_morale_attributs?.raison_sociale || "Entreprise",
      activity: raw.activite_principale_libelle || "—",
      city: etab.libelle_commune || raw.siege?.libelle_commune || "—",
      postal: etab.code_postal || raw.siege?.code_postal || "",
      email: etab.email || null,
      phone: etab.telephone || raw.siege?.telephone || null,
      website: raw.complements?.site_internet || raw.siege?.url || null,
      address: [etab.numero_voie, etab.type_voie, etab.libelle_voie]
        .filter(Boolean)
        .join(" "),
    }
  })
}