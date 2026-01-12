"use client" // ✅ ต้องมีบรรทัดนี้เพื่อเช็คว่าเป็น Browser อะไร

import { signIn } from "next-auth/react" // ใช้ตัวนี้แทน server action ชั่วคราวเพื่อให้ทำงานใน client ได้
import Link from "next/link"
import { useState, useEffect } from "react"

export default function LoginPage() {
  const [isLineBrowser, setIsLineBrowser] = useState(false)

useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor
    
    // ✅ อัปเดต Regex: ดัก LINE, Facebook (FBAN/FBAV) และ Instagram
    if (/Line|FBAN|FBAV|Instagram/i.test(userAgent)) {
      setIsLineBrowser(true)
    }
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-8">
        
        {/* Logo & Title (ของเดิม) */}
        <div className="space-y-2">
          <div className="w-16 h-16 bg-indigo-600 rounded-xl mx-auto flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/20">
            ⚔️
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Life RPG</h1>
          <p className="text-slate-400">Turn your daily routine into an adventure.</p>
        </div>

        {/* Login Section */}
        <div className="space-y-4">
          
          {/* 🚨 ตรวจจับ LINE Browser 🚨 */}
          {isLineBrowser ? (
            <div className="bg-red-950/50 border border-red-500/50 p-6 rounded-xl animate-pulse text-left">
                <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                    ⚠️ เปิดผ่านแอป Social Media ไม่ได้ครับ
                </h3>
                <p className="text-sm text-slate-300 mb-4">
                    Google บล็อกการ Login ผ่านแอป LINE เพื่อความปลอดภัย
                </p>
                <div className="text-xs bg-black/40 p-3 rounded border border-slate-700 text-slate-400">
                    <p className="font-bold text-yellow-500 mb-1">วิธีแก้ (How to fix):</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>กดปุ่ม <span className="text-white border border-slate-600 px-1 rounded mx-1">⋮</span> หรือ <span className="text-white border border-slate-600 px-1 rounded mx-1">Share</span> มุมขวาบน</li>
                        <li>เลือก <span className="text-white">Open in external browser</span> (เปิดในเบราว์เซอร์เริ่มต้น)</li>
                    </ol>
                </div>
            </div>
          ) : (
            /* ✅ ถ้าไม่ใช่ LINE (Chrome/Safari) โชว์ปุ่มปกติ */
            <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all"
            >
                {/* Google Icon SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
            </button>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">Or continue as</span>
            </div>
          </div>

          {/* Guest Button (Link) */}
          <Link 
            href="/guest" 
            className="w-full block text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition border border-slate-700 mt-4"
          >
            👻 Continue as Guest (Demo)
          </Link>
          
          <p className="text-xs text-slate-500 mt-2">
            *Guest data is saved on this device only.
          </p>
        </div>
      </div>
    </main>
  )
}