"use client"

export function CurrentRoutineDisplay({ plan, routineData }: { plan: string, routineData: any }) {
  
  if (plan === 'RANDOM') {
    return (
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/50 p-6 rounded-xl flex items-center gap-4">
         <div className="text-4xl">🎲</div>
         <div>
            <h3 className="text-lg font-bold text-indigo-400">Current Plan: Adventurer (Random)</h3>
            <p className="text-sm text-muted-foreground">
                ระบบจะสุ่มเควสให้คุณทุกวัน คุณไม่สามารถกำหนดล่วงหน้าได้ (วิถีผู้กล้า!)
            </p>
         </div>
      </div>
    )
  }

  if (plan === 'GYM_SPLIT') {
    return (
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 p-6 rounded-xl flex items-center gap-4">
         <div className="text-4xl">💪</div>
         <div>
            <h3 className="text-lg font-bold text-orange-400">Current Plan: Gym Rat (4 Days Split)</h3>
            <p className="text-sm text-muted-foreground mb-2">
                ตารางฝึกวนลูป 4 วัน: อก/หลัง/ขา/พัก
            </p>
            {/* แสดง Loop ย่อๆ */}
            <div className="flex gap-2 mt-2">
                {['Push','Pull','Legs','Rest'].map((d,i) => (
                    <span key={i} className="px-2 py-1 bg-black/40 rounded text-xs border border-white/10">
                        Day {i+1}: {d}
                    </span>
                ))}
            </div>
         </div>
      </div>
    )
  }

  // Custom Routine
  return (
      <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/50 p-6 rounded-xl space-y-4">
         <div className="flex items-center gap-4">
            <div className="text-4xl">📅</div>
            <div>
                <h3 className="text-lg font-bold text-yellow-500">Current Plan: Custom Routine</h3>
                <p className="text-sm text-muted-foreground">
                    แผนที่คุณกำหนดเอง ({routineData.length} Days Loop)
                </p>
            </div>
         </div>
         
         {/* Show Preview of Custom Loop */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(routineData.data).map(([day, quests]: any) => (
                <div key={day} className="bg-black/40 p-2 rounded border border-yellow-500/20 text-xs">
                    <div className="font-bold text-yellow-500 mb-1">Day {day}</div>
                    <ul className="list-disc list-inside text-muted-foreground">
                        {quests.map((q: any, i: number) => (
                            <li key={i} className="truncate">{q.title}</li>
                        ))}
                    </ul>
                </div>
            ))}
         </div>
      </div>
  )
}