import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const prospects = await prisma.prospect.findMany()
  return NextResponse.json(prospects)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await prisma.prospect.create({ data: body })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    )
  }
}