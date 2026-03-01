import { NextRequest, NextResponse } from "next/server"
import { checkWebsite } from "@/lib/google"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const companyName = searchParams.get("companyName") || ""
    const city = searchParams.get("city") || ""
    const sirenWebsite = searchParams.get("sirenWebsite") || null

    const result = await checkWebsite(companyName, city, sirenWebsite)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    )
  }
}