"use client"

import { useState } from "react"
import { saveRoutine } from "@/app/actions"

export function ScheduleBuilder({ allQuests }: { allQuests: any[] }) {
  const [loopLength, setLoopLength] = useState(3) // Default 3 วัน
  const [schedule, setSchedule] = useState<Record<number, string[]>>({})
  const [loading, setLoading] = useState(false)

  // ฟังก์ชันเพิ่มเควสลงในวัน
  const toggleQuest = (day: number, questId: string) => {
    const current = schedule[day] || []
    if (current.includes(questId)) {
        setSchedule({ ...schedule, [day]: current.filter(id => id !== questId) })
    } else {
        setSchedule({ ...schedule, [day]: [...current, questId] })
    }
  }

  const handleSave = async () => {
      setLoading(true)
      await saveRoutine(loopLength, schedule)
      setLoading(false)
      alert("✅ Routine Saved! เริ่มต้นแผนใหม่ตั้งแต่วันนี้เป็นต้นไป")
      window.location.href = "/" // กลับหน้าแรก
  }

  return (
    <div className="bg-card border border-border p-6 rounded-xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-yellow-500">📅 Custom Loop Routine</h2>
        
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Loop Length (Days):</span>
            <select 
                value={loopLength}
                onChange={(e) => setLoopLength(Number(e.target.value))}
                className="bg-secondary border border-border rounded px-2 py-1 font-bold"
            >
                {[1,2,3,4,5,6,7,30].map(n => (
                    <option key={n} value={n}>{n} Days</option>
                ))}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: loopLength }).map((_, i) => {
              const day = i + 1
              return (
                  <div key={day} className="border border-border rounded-lg p-4 bg-secondary/20">
                      <h3 className="font-bold text-center mb-3 bg-secondary py-1 rounded">Day {day}</h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                          {allQuests.map(q => {
                              const isSelected = (schedule[day] || []).includes(q.id)
                              return (
                                  <div 
                                    key={q.id} 
                                    onClick={() => toggleQuest(day, q.id)}
                                    className={`text-sm p-2 rounded cursor-pointer border transition-all
                                        ${isSelected 
                                            ? 'bg-primary/20 border-primary text-primary font-bold' 
                                            : 'bg-card border-border hover:bg-secondary opacity-70'
                                        }
                                    `}
                                  >
                                      {isSelected ? '✓ ' : '+ '} {q.title}
                                  </div>
                              )
                          })}
                      </div>
                  </div>
              )
          })}
      </div>

      <button 
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 rounded-xl transition"
      >
        {loading ? "Saving..." : "💾 Save & Activate Routine"}
      </button>
    </div>
  )
}