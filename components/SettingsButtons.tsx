// src/components/SettingsButtons.tsx
'use client' // ต้องมีบรรทัดนี้เพื่อใช้ onClick

import { undoLastQuest, resetCharacter } from "@/app/actions"
import { useState } from "react"

export function SettingsButtons() {
  const [loading, setLoading] = useState(false)

  const handleUndo = async () => {
    if (loading) return
    setLoading(true)
    await undoLastQuest()
    setLoading(false)
  }

  const handleReset = async () => {
    if (loading) return
    // แจ้งเตือนก่อนลบ!
    const confirmed = window.confirm(
      "⚠️ คำเตือน: คุณต้องการรีเซ็ตตัวละครกลับไปเริ่มต้นใช่ไหม?\n\nเลเวล, ค่าพลัง, และประวัติเควสทั้งหมดจะหายไป!"
    )
    
    if (confirmed) {
      setLoading(true)
      await resetCharacter()
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 opacity-50 hover:opacity-100 transition-opacity">
      {/* ปุ่ม Undo */}
      <button 
        onClick={handleUndo}
        disabled={loading}
        className="text-xs text-orange-400 hover:text-orange-300 hover:bg-orange-900/30 px-3 py-1 rounded border border-orange-500/30 transition-all flex items-center gap-1"
      >
        ↩️ Undo Last
      </button>

      {/* ปุ่ม Reset */}
      <button 
        onClick={handleReset}
        disabled={loading}
        className="text-xs text-red-500 hover:text-red-400 hover:bg-red-900/30 px-3 py-1 rounded border border-red-500/30 transition-all flex items-center gap-1"
      >
        💣 Reset Character
      </button>
    </div>
  )
}