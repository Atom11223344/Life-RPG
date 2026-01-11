// src/app/create/page.tsx
import { createCharacter } from '../actions'
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function CreatePage() {
  const session = await auth()
  if (!session) redirect('/login') // ถ้ายังไม่ล็อกอิน ไล่ไปล็อกอินก่อน

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* ฝั่งซ้าย: คำอธิบาย */}
        <div className="space-y-6 text-white self-center">
          <h1 className="text-4xl font-bold text-yellow-500">Choose Your Destiny</h1>
          <p className="text-slate-400 text-lg">
            เส้นทางชีวิตของคุณเริ่มต้นที่นี่ เลือกสายอาชีพที่ตรงกับเป้าหมายชีวิตจริงของคุณ
          </p>
          <ul className="space-y-4">
            <li className="flex gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <span className="text-3xl">⚔️</span>
              <div>
                <strong className="block text-red-400">Warrior Path</strong>
                <span className="text-sm text-slate-500">เน้นออกกำลังกาย สร้างกล้ามเนื้อ ความแข็งแกร่ง</span>
              </div>
            </li>
            <li className="flex gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <span className="text-3xl">🧙‍♂️</span>
              <div>
                <strong className="block text-blue-400">Mage Path</strong>
                <span className="text-sm text-slate-500">เน้นการเรียนรู้ อ่านหนังสือ พัฒนาสมอง</span>
              </div>
            </li>
            <li className="flex gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <span className="text-3xl">🌿</span>
              <div>
                <strong className="block text-green-400">Rogue Path</strong>
                <span className="text-sm text-slate-500">เน้นความสมดุล สุขภาพ การท่องเที่ยว</span>
              </div>
            </li>
          </ul>
        </div>

        {/* ฝั่งขวา: แบบฟอร์ม */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
          <form action={createCharacter} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Character Name</label>
              <input 
                name="name" 
                required 
                placeholder="Ex. Arthas" 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <label className="cursor-pointer">
                <input type="radio" name="class" value="Warrior" className="peer sr-only" required defaultChecked />
                <div className="p-4 rounded-xl border border-slate-700 bg-slate-950 text-center peer-checked:border-red-500 peer-checked:bg-red-900/20 transition-all hover:bg-slate-800">
                  <div className="text-2xl mb-1">⚔️</div>
                  <div className="text-xs font-bold text-slate-300">Warrior</div>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="class" value="Mage" className="peer sr-only" />
                <div className="p-4 rounded-xl border border-slate-700 bg-slate-950 text-center peer-checked:border-blue-500 peer-checked:bg-blue-900/20 transition-all hover:bg-slate-800">
                  <div className="text-2xl mb-1">🧙‍♂️</div>
                  <div className="text-xs font-bold text-slate-300">Mage</div>
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="class" value="Rogue" className="peer sr-only" />
                <div className="p-4 rounded-xl border border-slate-700 bg-slate-950 text-center peer-checked:border-green-500 peer-checked:bg-green-900/20 transition-all hover:bg-slate-800">
                  <div className="text-2xl mb-1">🌿</div>
                  <div className="text-xs font-bold text-slate-300">Rogue</div>
                </div>
              </label>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg transition-all transform active:scale-95">
              Start Adventure ➜
            </button>
          </form>
        </div>

      </div>
    </main>
  )
}