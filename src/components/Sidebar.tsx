"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/search", label: "Recherche" },
  { href: "/crm", label: "Prospects" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile header */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: "#B0413E" }}
      >
        <span className="font-black text-lg" style={{ color: "#FFFFC7" }}>ProspectHunter</span>
        <button
          onClick={() => setOpen(!open)}
          className="font-bold text-xl"
          style={{ color: "#FFFFC7" }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden fixed top-12 left-0 right-0 z-40 p-4 flex flex-col gap-2"
          style={{ backgroundColor: "#B0413E" }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold"
              style={
                pathname === link.href
                  ? { backgroundColor: "#FFFFC7", color: "#B0413E" }
                  : { color: "#FFFFC7" }
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Desktop sidebar */}
      <nav
        className="hidden md:flex w-56 min-h-screen flex-col p-4 shadow-xl"
        style={{ backgroundColor: "#B0413E" }}
      >
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
    </>
  )
}