"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/search", label: "Recherche" },
  { href: "/crm", label: "Prospects" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-56 min-h-screen flex flex-col p-4 shadow-xl" style={{ backgroundColor: "#B0413E" }}>
      <div className="mb-8 px-2">
        <h1 className="font-black text-xl tracking-tight" style={{ color: "#FFFFC7" }}>ProspectHunter</h1>
        <p className="text-xs mt-1" style={{ color: "#FCAA67" }}>Freelance Web CRM</p>
      </div>

      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={
                pathname === link.href
                  ? { backgroundColor: "#FFFFC7", color: "#B0413E" }
                  : { color: "#FFFFC7" }
              }
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      
    </nav>
  )
}