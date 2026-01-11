// src/app/diary/page.tsx
import { getQuestHistory, getRoutineData } from '../actions' // ต้อง import getRoutineData ด้วย
import { DiaryCalendar } from '@/components/DiaryCalendar' // เดี๋ยวสร้างไฟล์นี้
import Link from 'next/link'

export default async function DiaryPage() {
  const logs = await getQuestHistory()
  const routine = await getRoutineData() // ดึงข้อมูลแผนอนาคต

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-bold text-yellow-500">📅 Time Travel Diary</h1>
            <p className="text-muted-foreground text-sm">อดีตแก้ไขไม่ได้ แต่อนาคตกำหนดได้</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-secondary rounded-lg hover:bg-muted transition text-sm">
            ← Back
          </Link>
        </div>

        {/* ส่งข้อมูลไปให้ Client Component จัดการเรื่อง Popup */}
        <DiaryCalendar logs={logs} routine={routine} />
        
      </div>
    </main>
  )
}