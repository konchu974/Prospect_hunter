"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push("/")
    } else {
      setError("Mot de passe incorrect")
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#FFFFC7" }}
    >
      <div
        className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-sm"
        style={{ border: "1px solid #FCAA67" }}
      >
        <h1
          className="text-2xl font-black mb-2"
          style={{ color: "#B0413E" }}
        >
          ProspectHunter
        </h1>
        <p
          className="text-sm mb-8"
          style={{ color: "#B0413E", opacity: 0.6 }}
        >
          Connectez-vous pour acceder a votre CRM
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wide mb-1 block"
              style={{ color: "#B0413E" }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              style={{ borderColor: "#FCAA67", color: "#B0413E" }}
            />
          </div>

          {error && (
            <p
              className="text-sm font-medium"
              style={{ color: "#B0413E" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full font-bold py-2.5 rounded-xl transition hover:opacity-90"
            style={{ backgroundColor: "#B0413E", color: "#FFFFC7" }}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}