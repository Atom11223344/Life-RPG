"use client"

import { useState, useEffect, useRef } from "react"

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // โหลดไฟล์เสียง bgm.mp3 จากโฟลเดอร์ public
    audioRef.current = new Audio("/bgm.mp3")
    audioRef.current.loop = true // เล่นวนซ้ำ
    audioRef.current.volume = 0.3 // ความดัง 30% (ไม่หนวกหู)
    
    // Cleanup ตอนปิดหน้าเว็บ
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const toggleMusic = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      // Browser บังคับว่าต้องมีการ "คลิก" ก่อนถึงจะเล่นเสียงได้
      audioRef.current.play().catch((err) => {
        console.error("Autoplay blocked:", err)
      })
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <button
      onClick={toggleMusic}
      className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-xl transition-all duration-300 border-2 
        ${isPlaying 
          ? "bg-primary text-primary-foreground border-primary animate-pulse" 
          : "bg-secondary text-muted-foreground border-border hover:scale-110"
        }`}
      title={isPlaying ? "Mute Music" : "Play Music"}
    >
      {isPlaying ? (
        // Icon ลำโพงดัง 🔊
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
      ) : (
        // Icon ลำโพงปิด 🔇
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
      )}
    </button>
  )
}