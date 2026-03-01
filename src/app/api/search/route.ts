import { NextRequest, NextResponse } from "next/server"
import { searchCompanies } from "@/lib/sirene"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query") || ""
    const dept = searchParams.get("dept") || ""
    const naf = searchParams.get("naf") || ""

    const companies = await searchCompanies(query, dept, naf)

    return NextResponse.json(companies)
  } catch (error) {
    console.error(error)  
    return NextResponse.json(
      { error: "Erreur lors de la recherche" },
      { status: 500 }
    )
  }
}