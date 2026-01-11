// src/app/guest/page.tsx
"use client"
import Link from "next/link"
import { useState } from "react"
import { EvolutionPreview } from "@/components/EvolutionPreview"

export default function GuestPage() {
  // --- MOCK DATA (ข้อมูลสมมติ เพื่อโชว์ของ) ---
  const [xp, setXp] = useState(75)
  const [level, setLevel] = useState(15) // ให้ Guest เริ่มที่เวล 15 เลย จะได้ดูเท่
  
  // จำลองเควสเท่ๆ (Gym Rat Plan)
  const [quests, setQuests] = useState([
    { id: 1, title: "Chest & Triceps Workout (อก/หลังแขน 1 ชม.)", xp: 50, stat: "STR", completed: false },
    { id: 2, title: "Abs Workout (เล่นท้อง 15 นาที)", xp: 25, stat: "STR", completed: true }, // เสร็จไปแล้ว 1 อัน
    { id: 3, title: "Eat High Protein (กินโปรตีนให้ถึง)", xp: 20, stat: "VIT", completed: false },
  ])

  // ฟังก์ชันกดเควสเล่นๆ (ไม่เซฟลง DB)
  const toggleQuest = (id: number) => {
    setQuests(quests.map(q => q.id === id ? { ...q, completed: !q.completed } : q))
    // เพิ่มลูกเล่น XP เด้ง
    const quest = quests.find(q => q.id === id)
    if (quest && !quest.completed) {
        if (xp + quest.xp >= 100) {
            setXp(0)
            setLevel(level + 1)
            alert("LEVEL UP! (Demo Mode)")
        } else {
            setXp(prev => prev + quest.xp)
        }
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 pb-20">
      <div className="max-w-md mx-auto space-y-8">
        
        {/* --- Header (แจ้งเตือนว่าเป็น Demo) --- */}
        <div className="flex items-center justify-between">
            <div className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/50 animate-pulse">
                🚧 GUEST DEMO MODE
            </div>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-white underline">
                Log In to Save Progress
            </Link>
        </div>

        {/* --- Avatar & Stats (ก๊อปดีไซน์หน้าจริงมา) --- */}
        <div className="text-center space-y-4">
            <div className="relative inline-block">
                 <div className="w-32 h-32 rounded-full border-4 border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.5)] overflow-hidden bg-black mx-auto">
                    {/* ใช้รูป DiceBear ตัวเท่ๆ */}
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=warrior-veteran&backgroundColor=transparent" className="w-full h-full object-cover scale-110" />
                 </div>
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-black px-3 py-0.5 rounded-full text-sm border-2 border-white">
                    LV.{level}
                 </div>
            </div>
            
            <div>
                <h1 className="text-3xl font-black uppercase text-yellow-500 drop-shadow-md">Guest Warrior</h1>
                <p className="text-muted-foreground text-sm">Gym Rat Plan (Day 1: Push)</p>
            </div>
        </div>

        {/* --- XP Bar --- */}
        <div className="bg-secondary/50 p-4 rounded-xl border border-border">
            <div className="flex justify-between text-xs font-bold mb-2 text-muted-foreground uppercase">
                <span>Experience</span>
                <span>{xp} / 100 XP</span>
            </div>
            <div className="h-4 w-full bg-black/50 rounded-full overflow-hidden border border-white/10">
                <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    style={{ width: `${xp}%` }}
                ></div>
            </div>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-3 gap-3">
            {[
                { label: 'STR', val: 18, color: 'text-red-500', border: 'border-red-500/30' },
                { label: 'INT', val: 12, color: 'text-blue-500', border: 'border-blue-500/30' },
                { label: 'VIT', val: 15, color: 'text-green-500', border: 'border-green-500/30' },
            ].map((s) => (
                <div key={s.label} className={`bg-card border ${s.border} p-3 rounded-lg text-center`}>
                    <div className={`font-black text-xl ${s.color}`}>{s.val}</div>
                    <div className="text-[10px] font-bold text-muted-foreground">{s.label}</div>
                </div>
            ))}
        </div>

        {/* --- Daily Quests (Interactive Demo) --- */}
        <div className="space-y-4">
            <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3">Daily Quests (Demo)</h2>
            <div className="space-y-3">
                {quests.map((q) => (
                    <div 
                        key={q.id}
                        onClick={() => toggleQuest(q.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group
                            ${q.completed 
                                ? 'bg-green-900/20 border-green-500/50 opacity-60' 
                                : 'bg-secondary/40 border-border hover:border-yellow-500/50 hover:bg-secondary/60'
                            }
                        `}
                    >
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <div className={`font-bold ${q.completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {q.title}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    +{q.xp} XP | +1 {q.stat}
                                </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                ${q.completed ? 'bg-green-500 border-green-500 text-black' : 'border-slate-500 group-hover:border-yellow-500'}
                            `}>
                                {q.completed && '✓'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- Evolution Preview (โชว์ของ) --- */}
        <EvolutionPreview charClass="Warrior" />

        {/* --- Call to Action --- */}
        <div className="mt-8 pt-8 border-t border-border text-center space-y-4">
            <p className="text-muted-foreground">ชอบสิ่งที่เห็นไหม? สมัครสมาชิกเพื่อบันทึกข้อมูลจริง!</p>
            <Link href="/login" className="block w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-xl transition shadow-[0_4px_15px_rgba(234,179,8,0.3)]">
                🚀 Create Real Account
            </Link>
        </div>

      </div>
    </main>
  )
}