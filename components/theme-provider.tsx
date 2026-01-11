// src/components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// ✅ แก้ตรงนี้: ลบ import ยาวๆ ทิ้ง แล้วใช้ React.ComponentProps แทน
export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}