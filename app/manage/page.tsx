// src/app/manage/page.tsx

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
// Import getRoutineData และ getCharacter เพิ่ม
import { getAllQuests, createQuest, deleteQuest, seedDefaultQuests, getCharacter, getRoutineData } from "../actions" 
import { ScheduleBuilder } from "@/components/ScheduleBuilder"
import { CurrentRoutineDisplay } from "@/components/CurrentRoutineDisplay" // ✅ Import
export default async function ManagePage() {
  const session = await auth()
  if (!session) redirect('/login')

  // 1. ดึงข้อมูลเควสทั้งหมดมารรอไว้
  const quests = await getAllQuests()
  const char = await getCharacter() // ✅ ดึงข้อมูลตัวละคร
  const routineData = await getRoutineData() // ✅ ดึงข้อมูล Routine

  if (!char) redirect('/')

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* --- Header --- */}
        <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
                <h1 className="text-3xl font-black text-yellow-500 uppercase tracking-wide">
                    ⚙️ Control Center
                </h1>
                <p className="text-muted-foreground">Manage your quests & routines</p>
            </div>
            <Link href="/" className="px-4 py-2 bg-secondary hover:bg-muted rounded-lg font-bold transition">
                ← Back Home
            </Link>
        </div>
        {/* ✅ แก้ตรงนี้: เอาเงื่อนไขกลับมาครอบครับ ปุ่มจะซ่อนถ้ามีเควสอยู่แล้ว */}
        {quests.length === 0 && (
            <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl flex justify-between items-center">
                <div className="text-red-500 font-bold">
                    ⚠️ Warning: No quests found!
                </div>
                <form action={seedDefaultQuests}>
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-lg animate-pulse">
                        🛠️ Restore Default Quests
                    </button>
                </form>
            </div>
        )}
        <div className="space-y-2">
             <h2 className="text-xl font-bold border-l-4 border-purple-500 pl-3">Your Active Lifestyle</h2>
             <CurrentRoutineDisplay plan={char.plan} routineData={routineData} />
        </div>
        {/* --- SECTION 1: CREATE QUESTS (ของเดิม) --- */}
        <div className="space-y-6">
            <h2 className="text-xl font-bold border-l-4 border-primary pl-3">
                1. Quest Database
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
                {/* Form สร้างเควส */}
                <div className="bg-card border border-border p-6 rounded-xl h-fit">
                    <h3 className="font-bold mb-4 text-lg">✨ Create New Quest</h3>
                    <form action={createQuest} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-muted-foreground">Quest Title</label>
                            <input name="title" required placeholder="e.g. Read 10 Pages" className="w-full bg-secondary border border-border rounded p-2 mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-muted-foreground">XP Reward</label>
                                <input name="xp" type="number" defaultValue="20" className="w-full bg-secondary border border-border rounded p-2 mt-1" />
                            </div>
                        <div>
                                <label className="text-xs font-bold text-muted-foreground">Stat Val</label>
                                {/* ✅ เพิ่มช่องนี้ครับ! (Stat Reward) */}
                                <input name="statReward" type="number" defaultValue="1" className="w-full bg-secondary border border-border rounded p-2 mt-1" />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted-foreground">Stat Type</label>
                                <select name="statType" className="w-full bg-secondary border border-border rounded p-2 mt-1">
                                    <option value="STR">STR (Body)</option>
                                    <option value="INT">INT (Brain)</option>
                                    <option value="VIT">VIT (Health)</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-2 rounded hover:opacity-90 transition">
                            + Add to Database
                        </button>
                    </form>
                </div>

                {/* List รายชื่อเควสที่มีอยู่ */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="font-bold mb-2 text-lg">📚 All Available Quests</h3>
                    {quests.length === 0 ? (
                        <div className="text-center p-8 border border-dashed rounded text-muted-foreground">No quests found. Create one!</div>
                    ) : (
                        quests.map((q) => (
                            <div key={q.id} className="flex justify-between items-center p-3 bg-secondary/30 border border-border rounded-lg group hover:border-primary transition">
                                <div>
                                    <div className="font-bold">{q.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                        +{q.xpReward} XP | +{q.statReward} {q.statType}
                                    </div>
                                </div>
                                <form action={deleteQuest}>
                                <input type="hidden" name="id" value={q.id} />
                                <button className="text-xs text-red-500 hover:bg-red-500/10 px-2 py-1 rounded">Delete</button>
                           </form>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        <hr className="border-border/50" />

        {/* --- SECTION 2: SCHEDULE BUILDER (ของใหม่!) --- */}
        {/* ✅ แปะตรงนี้แหละครับ! ด้านล่างสุด */}
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold border-l-4 border-yellow-500 pl-3">
                    {char.plan === 'CUSTOM_ROUTINE' ? 'Edit Your Routine' : 'Switch to Custom Routine'}
                </h2>
                <p className="text-sm text-muted-foreground pl-4 mb-2">
                    คุณสามารถสร้างตารางใหม่ได้ที่นี่ (เมื่อกด Save ระบบจะเปลี่ยนแผนของคุณเป็น Custom ทันที)
                </p>
            </div>
            
            {/* เรียกใช้ Component และส่ง quests ทั้งหมดเข้าไปให้เลือก */}
            <ScheduleBuilder allQuests={quests} />
        </div>

      </div>
    </main>
  )
}