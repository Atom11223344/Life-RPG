// src/app/login/page.tsx
import { signIn } from "@/auth"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import Link from "next/link" // ✅ เพิ่ม import Link
export default async function LoginPage() {
  // เช็คก่อนว่าถ้า Login อยู่แล้ว ให้เด้งไปหน้าเกมเลย
  const session = await auth()
  if (session?.user) redirect("/")

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-8">
        
        {/* Logo & Title */}
        <div className="space-y-2">
          <div className="w-16 h-16 bg-indigo-600 rounded-xl mx-auto flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/20">
            ⚔️
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Life RPG</h1>
          <p className="text-slate-400">Turn your daily routine into an adventure.</p>
        </div>

        {/* Login Buttons */}
        <div className="space-y-4">
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/" })
            }}
          >
            <button className="w-full bg-white hover:bg-slate-200 text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all">
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
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500">Or continue as</span>
            </div>
          </div>

          {/* ✅ แก้ปุ่ม Guest ให้เป็น Link */}
          <Link 
            href="/guest" 
            className="w-full block text-center bg-secondary hover:bg-secondary/80 text-foreground font-bold py-3 rounded-xl transition border border-border mt-4"
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