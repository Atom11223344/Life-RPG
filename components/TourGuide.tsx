"use client"

import { useEffect, useState } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

export function TourGuide() {
  const [isMounted, setIsMounted] = useState(false)

  const startTour = () => {
    document.body.style.overflow = 'hidden'
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: "Let's GO!",
      nextBtnText: "Next ➤",
      prevBtnText: "◀ Prev",
      // ✅ 2. เพิ่ม Options เพื่อคืนค่าหน้าจอเมื่อจบ
      onDestroyed: () => {
        document.body.style.overflow = 'auto' // คืนค่าการเลื่อน
      },
      popoverClass: 'life-rpg-popover',
      // การตั้งค่าตำแหน่ง (Config เดิม)
      stagePadding: 5,
      popoverOffset: 20,

      steps: [
        { 
          element: '#tour-avatar', 
          popover: { 
            title: 'Your Character', 
            description: 'นี่คือตัวละครของคุณ เลเวลจะขึ้นตามเควสที่ทำ',
            // Profile: กล่องอยู่ล่าง -> ลูกศรชี้ขึ้น
            side: 'bottom', 
            align: 'center'
          } 
        },
        { 
          element: '#tour-stats', 
          popover: { 
            title: 'Status', 
            description: 'ค่าพลังทั้ง 3 ด้าน (Body, Brain, Health)',
            // Status: กล่องอยู่บน -> ลูกศรชี้ลง
            side: 'top', 
            align: 'center'
          } 
        },
        { 
          element: '#tour-daily', 
          popover: { 
            title: 'Daily Quests', 
            description: 'ภารกิจรายวัน! ทำให้ครบเพื่อรับ Bonus XP',
            // Daily: กล่องอยู่บน -> ลูกศรชี้ลง
            side: 'top', 
            align: 'center'
          } 
        },
        { 
          element: '#tour-menu', 
          popover: { 
            title: 'Control Center', 
            description: 'เมนูจัดการต่างๆ อยู่ตรงนี้',
            // Menu: กล่องอยู่ซ้าย -> ลูกศรชี้ขวา
            side: 'left', 
            align: 'start' 
          } 
        },
      ]
    })

    driverObj.drive()
  }

  useEffect(() => {
    setIsMounted(true)
    const hasSeenTour = localStorage.getItem("life-rpg-tour-seen")
    if (!hasSeenTour) {
      setTimeout(() => {
        startTour()
        localStorage.setItem("life-rpg-tour-seen", "true")
      }, 1000)
    }
  }, [])

  if (!isMounted) return null

  return (
    // ✅ ปรับ Z-Index เป็น 100 และขยับขึ้นมาหน่อยกันชนปุ่ม Next.js
    <button 
      onClick={startTour}
      className="fixed bottom-6 left-6 z-[100] p-3 rounded-full bg-secondary border-2 border-yellow-500 text-foreground shadow-xl hover:scale-110 transition-transform hover:bg-yellow-500 hover:text-black"
      title="Open Guide"
    >
      <span className="text-xl">📖</span>
    </button>
  )
}