"use client"
import { signOut } from "next-auth/react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { undoLastQuest, resetCharacter } from "@/app/actions"
import { PlanSelector } from "./PlanSelector" // ✅ Import
import { ConfirmDialog } from "./ConfirmDialog" // ✅ Import
// รับ Prop currentPlan มาด้วย
export function GameMenu({ currentPlan }: { currentPlan: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false) // ✅ State เปิด Modal
  const menuRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false) // ✅ State สำหรับ Dialog
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  const handleResetClick = () => {
      setIsOpen(false)
      setShowResetConfirm(true)
  }

  const handleResetConfirm = async () => {
      setLoading(true)
      await resetCharacter()
      setLoading(false)
      setShowResetConfirm(false)
  }
  const handleUndo = async () => {
    if (loading) return
    setLoading(true)
    await undoLastQuest()
    setLoading(false)
    setIsOpen(false)
  }

  const handleReset = async () => {
    if (loading) return
    if (confirm("⚠️ รีเซ็ตตัวละครกลับไปเริ่มต้น?")) {
        setLoading(true)
        await resetCharacter()
        setLoading(false)
        setIsOpen(false)
    }
  }

  return (
    <>
      <ConfirmDialog 
         isOpen={showResetConfirm}
         title="Reset Character?"
         message="การกระทำนี้ไม่สามารถย้อนกลับได้! เลเวล, เควส, และประวัติทั้งหมดจะหายไป คุณแน่ใจหรือไม่?"
         onConfirm={handleResetConfirm}
         onCancel={() => setShowResetConfirm(false)}
      />
      {/* 1. ตัว Modal เลือกแผน (จะโชว์เมื่อ showPlanModal = true) */}
      {showPlanModal && (
        <PlanSelector currentPlan={currentPlan} onClose={() => setShowPlanModal(false)} />
      )}

      {/* 2. ปุ่ม Hamburger เดิม */}
      <div className="relative" ref={menuRef}>
        <button 
          id="tour-menu" // ✅ ใส่ ID สำหรับ Tour Guide
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-secondary hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-border"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden text-popover-foreground animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col py-1">
              
              {/* ✅ ปุ่มเปิดหน้าเลือกแผน (สวยๆ ไม่รก) */}
              <button 
                  onClick={() => { setIsOpen(false); setShowPlanModal(true); }}
                  className="px-4 py-3 hover:bg-secondary flex items-center gap-2 text-sm font-bold text-left text-yellow-500"
              >
                  <span>📋</span> Change Life Plan
              </button>
              
              <hr className="border-border opacity-50"/>

              <Link href="/manage" onClick={() => setIsOpen(false)} className="px-4 py-3 hover:bg-secondary flex items-center gap-2 text-sm font-medium">
                <span>⚙️</span> Manage Quests
              </Link>

              <button onClick={handleUndo} disabled={loading} className="px-4 py-3 hover:bg-secondary flex items-center gap-2 text-sm font-medium text-orange-500 w-full text-left">
                <span>↩️</span> Undo Last
              </button>

              <button onClick={handleResetClick} disabled={loading} className="px-4 py-3 hover:bg-secondary flex items-center gap-2 text-sm font-medium text-red-500 w-full text-left">
                <span>💣</span> Reset Character
              </button>
              {/* ✅ แทรกเส้นคั่น (Divider) เพื่อความสวยงาม */}
            <hr className="border-slate-700 my-2" />

            {/* ✅ เพิ่มปุ่ม LOGOUT ตรงนี้ครับ (ล่างสุด) */}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg flex items-center gap-3 transition-all font-bold group"
            >
              {/* ไอคอนประตูทางออก */}
              <div className="w-8 h-8 rounded-full bg-red-900/20 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                🚪
              </div>
              Sign Out
            </button>
              
            </div>
          </div>
        )}
      </div>
    </>
  )
}