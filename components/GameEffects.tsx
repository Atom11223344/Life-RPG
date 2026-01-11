"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

export function GameEffects({ level, currentXp }: { level: number, currentXp: number }) {

  useEffect(() => {
    // 1. ดึงค่าเก่าจาก LocalStorage (ความจำเครื่อง) มาเช็ค
    // ถ้าไม่มี (เป็น NaN หรือ null) ให้ถือว่าเป็น 0
    const storedLevel = parseInt(localStorage.getItem("life-rpg-level") || "0")
    const storedXp = parseInt(localStorage.getItem("life-rpg-xp") || "0")

    // กรณี: เพิ่งเข้าเว็บครั้งแรก (ไม่มีข้อมูลเก่าเลย)
    // ให้บันทึกค่าปัจจุบันลงไปก่อน แล้วจบฟังก์ชัน (ไม่เล่นเสียงตอนเปิดเว็บ)
    if (storedLevel === 0 && storedXp === 0) {
       saveState(level, currentXp)
       return
    }

    // 2. เช็ค Level Up 🎉 (ถ้าเลเวลปัจจุบัน มากกว่า ที่จำไว้)
    if (level > storedLevel) {
      triggerLevelUpEffect()
      saveState(level, currentXp)
    }
    // 3. เช็ค XP Gain 🔊 (ถ้าเลเวลเท่าเดิม แต่ XP เพิ่มขึ้น)
    else if (level === storedLevel && currentXp > storedXp) {
       playSound('coin') 
       saveState(level, currentXp)
    }
    // กรณีอื่นๆ (เช่น XP ลดจากการ Undo) ก็แค่อัปเดตค่าล่าสุดเฉยๆ
    else if (level !== storedLevel || currentXp !== storedXp) {
       saveState(level, currentXp)
    }

  }, [level, currentXp])

  // Helper: บันทึกค่าลงเครื่อง
  const saveState = (l: number, x: number) => {
      localStorage.setItem("life-rpg-level", l.toString())
      localStorage.setItem("life-rpg-xp", x.toString())
  }

  return null
}

// --- Helper Functions ---

function triggerLevelUpEffect() {
  console.log("🚀 Level Up Triggered!")
  playSound('levelup')

  // ยิงพลุรัวๆ 3 วินาที
  const duration = 3 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  const random = (min: number, max: number) => Math.random() * (max - min) + min

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } })
    confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } })
  }, 250)
}

function playSound(type: 'levelup' | 'coin') {
    // สร้าง Audio Object ใหม่ทุกครั้งเพื่อให้เล่นเสียงซ้อนกันได้ (รัวๆ)
    const audio = new Audio(`/${type}.mp3`)
    audio.volume = 0.5 // ปรับความดังตรงนี้ (0.0 - 1.0)
    
    // สั่งเล่นทันที
    audio.play().catch((e) => {
        // ส่วนใหญ่จะ Error ถ้า User ยังไม่เคยคลิกหน้าเว็บเลย (Autoplay Policy)
        console.warn(`Cannot play sound ${type}.mp3`, e)
    })
}