"use client"

import { useState } from "react"
import { completeQuest } from "@/app/actions"

interface QuestButtonProps {
  questId: string
  title: string
  xpReward: number
  statReward: number
  statType: string
  isCompleted: boolean
}

export function QuestButton({ questId, title, xpReward, statReward, statType, isCompleted }: QuestButtonProps) {
  const [floats, setFloats] = useState<{ id: number, x: number, y: number, text: string }[]>([])
  const [loading, setLoading] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    if (isCompleted || loading) return
    setLoading(true)

    // 1. สร้าง Floating Text ณ ตำแหน่งเมาส์
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    // สุ่มตำแหน่งนิดหน่อยให้ดูธรรมชาติ
    const x = e.clientX - 20 + (Math.random() * 40 - 20) 
    const y = e.clientY - 40 
    
    const newFloat = { id: Date.now(), x, y, text: `+${xpReward} XP` }
    setFloats(prev => [...prev, newFloat])

    // ลบ Floating Text ออกเมื่อเวลาผ่านไป (Cleanup)
    setTimeout(() => {
      setFloats(prev => prev.filter(f => f.id !== newFloat.id))
    }, 1000)

    // 2. เรียก Server Action
    await completeQuest(questId)
    setLoading(false)
  }

  return (
    <>
      {/* Floating Text Overlay (ลอยอยู่เหนือทุกสิ่ง) */}
      {floats.map(f => (
        <div
          key={f.id}
          className="fixed pointer-events-none text-2xl font-black text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-50 animate-float-up"
          style={{ left: f.x, top: f.y }}
        >
          {f.text}
        </div>
      ))}

      {/* ปุ่มกด */}
      <button 
        onClick={handleClick}
        disabled={isCompleted || loading}
        className={`w-full group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 
            ${isCompleted 
                ? 'bg-secondary/50 border-border opacity-60 cursor-default' 
                : 'bg-card border-border hover:border-primary hover:shadow-md active:scale-95'
            }`}
      >
        <div className="flex flex-col items-start gap-1">
            <span className={`font-bold transition-colors text-left ${isCompleted ? 'text-muted-foreground line-through' : 'text-card-foreground group-hover:text-primary'}`}>
            {title}
            </span>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
            +{statReward} {statType}
            </span>
        </div>
        
        <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
            +{xpReward} XP
            </span>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-green-500 text-white' : 'bg-secondary group-hover:bg-primary group-hover:text-white'}`}>
            {isCompleted ? '✓' : (loading ? '⏳' : '➜')}
            </div>
        </div>
      </button>
    </>
  )
}