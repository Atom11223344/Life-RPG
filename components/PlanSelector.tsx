"use client"

import { useState } from "react"
import { switchPlan } from "@/app/actions"
import { useRouter } from "next/navigation" // ✅ Import Router
export function PlanSelector({ currentPlan, onClose }: { currentPlan: string, onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter() // ✅ Use Router
  const handleSelect = async (plan: string) => {
    setLoading(true)
    await switchPlan(plan)
    setLoading(false)
    onClose()
    window.location.reload() // รีเฟรชเพื่อโหลดเควสใหม่
  }
// ฟังก์ชันสำหรับ Custom Plan
  const handleCustomPlan = async () => {
      // 1. เปลี่ยนสถานะใน DB เป็น "CUSTOM" (หรือใช้ RANDOM ก็ได้ แต่ตั้งชื่อใหม่ให้ชัดเจน)
      // ในที่นี้เราใช้ "CUSTOM" เพื่อแยกแยะ
      setLoading(true)
      await switchPlan('CUSTOM') 
      setLoading(false)
      onClose()
      
      // 2. พาไปหน้า Manage ทันที เพื่อให้ User เริ่มสร้างเควส
      router.push('/manage')
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border p-6 rounded-2xl shadow-2xl max-w-md w-full space-y-4 relative">
        
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-yellow-500">📋 Select Your Plan</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        
        <p className="text-sm text-muted-foreground">
            เลือกรูปแบบชีวิตที่คุณต้องการ ระบบจะจัดเควสรายวันให้ตามแผนนี้
        </p>

        <div className="grid gap-3">
            {/* Plan 1: Random */}
            <button 
                onClick={() => handleSelect('RANDOM')}
                disabled={loading}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02]
                    ${currentPlan === 'RANDOM' ? 'bg-primary/10 border-primary ring-1 ring-primary' : 'bg-secondary/50 border-border hover:bg-secondary'}
                `}
            >
                <div className="text-3xl">🎲</div>
                <div className="text-left">
                    <div className="font-bold text-foreground">Adventurer (Random)</div>
                    <div className="text-xs text-muted-foreground">สุ่มเควสหลากหลาย เหมาะกับคนขี้เบื่อ</div>
                </div>
            </button>

            {/* Plan 2: Gym Split */}
            <button 
                onClick={() => handleSelect('GYM_SPLIT')}
                disabled={loading}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.02]
                    ${currentPlan === 'GYM_SPLIT' ? 'bg-primary/10 border-primary ring-1 ring-primary' : 'bg-secondary/50 border-border hover:bg-secondary'}
                `}
            >
                <div className="text-3xl">💪</div>
                <div className="text-left">
                    <div className="font-bold text-foreground">Gym Rat (Split 4 Days)</div>
                    <div className="text-xs text-muted-foreground">ตารางเวทเทรนนิ่งวนลูป 4 วัน (อก/หลัง/ขา/พัก)</div>
                </div>
            </button>
            <button 
                onClick={handleCustomPlan}
                disabled={loading}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 border-dashed transition-all hover:scale-[1.02]
                    ${currentPlan === 'CUSTOM' ? 'bg-primary/10 border-primary ring-1 ring-primary' : 'bg-secondary/30 border-slate-500/50 hover:bg-secondary hover:border-primary'}
                `}
            >
                <div className="text-3xl flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                    ➕
                </div>
                <div className="text-left">
                    <div className="font-bold text-foreground">Create My Own Plan</div>
                    <div className="text-xs text-muted-foreground">กำหนดเองทุกอย่าง! สร้างตารางชีวิตของคุณเอง 100%</div>
                </div>
            </button>
        </div>

      </div>
    </div>
  )
}