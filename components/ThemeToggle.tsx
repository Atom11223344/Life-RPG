// src/components/ThemeToggle.tsx
"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // ป้องกัน Error เรื่อง Server/Client mismatch
  React.useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-700"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        // Icon ดวงจันทร์
        <span className="text-lg">🌙</span>
      ) : (
        // Icon ดวงอาทิตย์
        <span className="text-lg">☀️</span>
      )}
    </button>
  )
}