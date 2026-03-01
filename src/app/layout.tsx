import type { Metadata } from "next"
import Sidebar from "@/components/Sidebar"
import "./globals.css"

export const metadata: Metadata = {
  title: "ProspectHunter",
  description: "CRM de prospection pour freelance web",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body style={{ backgroundColor: "#FFFFC7" }} className="min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8 pt-20 md:pt-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}