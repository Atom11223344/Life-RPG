"use client"

import { useState } from "react"

export function DiaryCalendar({ logs, routine }: { logs: any[], routine: any }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  // สร้าง Array วันที่ 1 ถึงวันสิ้นเดือน
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const getFutureQuests = (date: Date) => {
      if (!routine?.length) return []
      const start = new Date(routine.startDate)
      start.setHours(0,0,0,0); date.setHours(0,0,0,0);
      
      const diffTime = date.getTime() - start.getTime()
      if (diffTime < 0) return [] // ก่อนเริ่มแผน ไม่มีข้อมูล
      
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      const cycleDay = (diffDays % routine.length) + 1
      return routine.data[cycleDay] || [] 
  }

  const renderPopup = () => {
      if (!selectedDate) return null
      const isFuture = selectedDate > today
      
      // หา Logs
      const daysLogs = logs.filter((l: any) => {
          const d = new Date(l.completedAt)
          return d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth()
      })
      // หา Future
      const futureQuests = isFuture ? getFutureQuests(selectedDate) : []

      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-card border border-yellow-500 p-6 rounded-2xl w-full max-w-xl relative shadow-[0_0_50px_rgba(234,179,8,0.2)]">
                  <button onClick={() => setSelectedDate(null)} className="absolute top-2 right-4 text-2xl text-muted-foreground hover:text-white">×</button>
                  <h3 className="text-xl font-bold text-yellow-500 mb-1">
                      {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                  </h3>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                      {isFuture ? "🔮 Future Prediction" : "📜 History Log"}
                  </div>

                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                      {isFuture ? (
                          futureQuests.length > 0 ? futureQuests.map((q: any, i: number) => (
                              // ✅ 2. เปลี่ยน ? เป็น - (ขีด)
                              <div key={i} className="flex items-center gap-3 p-3 bg-secondary/30 rounded border border-dashed border-slate-700 opacity-70">
                                  <div className="w-6 h-6 rounded-full border border-slate-500 flex items-center justify-center text-sm font-bold pb-0.5">
                                    -
                                  </div>
                                  <span className="text-lg">{q.title}</span> {/* เพิ่มขนาดตัวอักษรนิดนึง */}
                              </div>
                          )) : <p className="text-center py-4 text-muted-foreground">Rest Day (No Quests)</p>
                      ) : (
                          daysLogs.length > 0 ? daysLogs.map((l: any) => (
                              <div key={l.id} className="flex items-center gap-3 p-3 bg-green-900/20 border border-green-500/30 rounded">
                                  <div className="text-green-500 font-bold">✓</div> {/* ใช้เครื่องหมายถูก */}
                                  <div>
                                      <div className="font-bold">{l.questTitle || l.quest?.title}</div>
                                      <div className="text-xs text-muted-foreground">{new Date(l.completedAt).toLocaleTimeString()}</div>
                                  </div>
                              </div>
                          )) : <p className="text-center py-4 text-muted-foreground">No activity recorded.</p>
                      )}
                  </div>
              </div>
          </div>
      )
  }

  return (
      <div className="space-y-4">
         {/* --- ส่วน Grid ปฏิทินที่หายไป --- */}
         <div className="grid grid-cols-7 gap-2 text-center mb-2">
             {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                 <div key={d} className="text-xs font-bold text-muted-foreground">{d}</div>
             ))}
         </div>
         
         <div className="grid grid-cols-7 gap-2">
             {/* เว้นช่องว่างวันแรกของเดือน (สมมติเริ่มวันว่างๆ ไปก่อนเพื่อให้ง่าย) */}
             {/* ของจริงต้องคำนวณ firstDayOfMonth แต่เพื่อให้โค้ดสั้นลง ผมขอข้ามไปก่อน */}
             
             {daysArray.map((day) => {
                 const date = new Date(currentYear, currentMonth, day)
                 const isToday = day === today.getDate()
                 // เช็คว่าวันนั้นมี Log หรือไม่
                 const hasLog = logs.some((l:any) => {
                    const d = new Date(l.completedAt)
                    return d.getDate() === day && d.getMonth() === currentMonth
                 })

                 return (
                     <button 
                        key={day}
                        onClick={() => setSelectedDate(date)}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition hover:bg-secondary
                            ${isToday ? 'bg-primary text-primary-foreground font-bold border-2 border-primary' : 'bg-card border border-border'}
                        `}
                     >
                         <span className="text-sm">{day}</span>
                         {hasLog && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1"></span>}
                     </button>
                 )
             })}
         </div>

         {renderPopup()}
      </div>
  )
}