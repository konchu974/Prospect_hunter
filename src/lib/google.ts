export interface WebsiteCheckResult {
  hasWebsite: boolean
  websiteUrl: string | null
  phone: string | null
  source: "sirene" | "google" | "none"
}

export async function checkWebsite(
  companyName: string,
  city: string,
  sirenWebsite: string | null
): Promise<WebsiteCheckResult> {
  if (sirenWebsite) {
    return { hasWebsite: true, websiteUrl: sirenWebsite, phone: null, source: "sirene" }
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return { hasWebsite: false, websiteUrl: null, phone: null, source: "none" }
  }

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.websiteUri,places.nationalPhoneNumber"
      },
      body: JSON.stringify({
        textQuery: `${companyName} ${city}`
      })
    })

    const data = await res.json()
    const place = data.places?.[0]

    if (place?.displayName?.text) {
      const googleName = place.displayName.text.toLowerCase()
      const searchName = companyName.toLowerCase()
      const firstWord = searchName.split(" ")[0]

      if (googleName.includes(firstWord) || searchName.includes(googleName.split(" ")[0])) {
        return {
          hasWebsite: !!place.websiteUri,
          websiteUrl: place.websiteUri || null,
          phone: place.nationalPhoneNumber || null,
          source: "google"
        }
      }
    }

    return { hasWebsite: false, websiteUrl: null, phone: null, source: "google" }
  } catch {
    return { hasWebsite: false, websiteUrl: null, phone: null, source: "none" }
  }
}