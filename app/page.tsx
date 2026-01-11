// src/app/page.tsx
import { getCharacter, getDailyQuests, getDailyProgress } from './actions'
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import { ThemeToggle } from "@/components/ThemeToggle"
import { GameMenu } from "@/components/GameMenu"
import { GameEffects } from "@/components/GameEffects"
import { QuestButton } from "@/components/QuestButton" // ✅ Import ปุ่มใหม่
import { TourGuide } from "@/components/TourGuide" // ✅ Import Tour
export default async function Home() {
  const session = await auth()
  if (!session) redirect('/login')

  const char = await getCharacter()
  if (!char) redirect('/create')

  const dailyQuests = await getDailyQuests()
  const dailyProgress = await getDailyProgress()
  const xpProgress = (char.currentXp / char.nextLevelXp) * 100
  const isAllDone = dailyQuests.length > 0 && dailyQuests.every(q => dailyProgress.completedIds.includes(q.id))

  // 🎨 Class Aura
  let auraColor = "shadow-yellow-500/50" 
  let ringColor = "border-yellow-500"
  if (char.class === "Warrior") { auraColor = "shadow-red-500/50"; ringColor = "border-red-500" }
  if (char.class === "Mage") { auraColor = "shadow-blue-500/50"; ringColor = "border-blue-500" }
  if (char.class === "Rogue") { auraColor = "shadow-green-500/50"; ringColor = "border-green-500" }

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 transition-colors duration-300">
      <TourGuide />
      <GameEffects level={char.level} currentXp={char.currentXp} />

      <div className="max-w-lg mx-auto space-y-8 relative">
        
        {/* --- Top Bar --- */}
        <div className="flex justify-between items-center mb-4">
            
             {/* 🔥 Streak Display (ใหม่!) */}
             <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-full shadow-sm">
                <span className="text-xl">🔥</span>
                <span className="font-black text-lg text-orange-500">{char.streak || 0}</span>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider pt-1">Day Streak</span>
             </div>

             <div className="flex items-center gap-2">
                <Link href="/diary" className="p-2 rounded-lg bg-secondary hover:bg-muted border border-border text-foreground transition-colors" title="Calendar History">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </Link>
                <ThemeToggle />
                <GameMenu currentPlan={char.plan} />
             </div>
        </div>

        {/* --- Header Profile --- */}
        <div className="flex flex-col items-center gap-4 pt-4 mb-8">
            
            {/* กดที่รูปเพื่อไปหน้า Profile */}
            <Link href="/profile">
                <div id="tour-avatar" className="relative group cursor-pointer">
                    
                    {/* แสงออร่าด้านหลัง (เปลี่ยนสีตามอาชีพ) */}
                    <div className={`absolute inset-0 rounded-full blur-xl opacity-50 ${auraColor} group-hover:opacity-80 transition-opacity duration-500`}></div>
                    
                    {/* กรอบรูป Profile */}
                    <div className={`relative w-36 h-36 rounded-full overflow-hidden border-4 ${ringColor} shadow-2xl bg-secondary z-10 transition-transform duration-300 group-hover:scale-105`}>
                        <img 
                          src={char.avatarUrl || ""} 
                          alt="Character Avatar" 
                          className="w-full h-full object-cover" 
                        />
                    </div>
                    
                    {/* Badge เลเวล (มุมขวาล่าง) */}
                    <div className="absolute -bottom-2 -right-2 bg-foreground text-background font-black text-sm px-3 py-1 rounded-full border-2 border-background z-20 shadow-lg">
                        LV.{char.level}
                    </div>

                    {/* Tooltip 'View Stats' (โผล่มาตอนเอาเมาส์ชี้) */}
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 duration-300">
                        View Stats
                    </div>
                </div>
            </Link>
            
            {/* ชื่อและยศ */}
            <div className="text-center space-y-1">
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 drop-shadow-sm tracking-tight animate-in fade-in slide-in-from-bottom-2">
                  {char.name}
              </h1>
              
              <p className="text-muted-foreground text-lg font-medium flex items-center justify-center gap-2">
                 {/* จุดสีบอกอาชีพ */}
                 <span className={`w-2 h-2 rounded-full ${char.class === 'Warrior' ? 'bg-red-500' : char.class === 'Mage' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                 
                 {/* ชื่ออาชีพ */}
                 {char.class} 
                 
                 <span className="text-xs opacity-50">|</span> 
                 
                 {/* ยศ (Rank) ตามเลเวล */}
                 <span className={char.level >= 30 ? "text-yellow-500 font-bold" : ""}>
                    {char.level >= 30 ? "Master" : char.level >= 10 ? "Veteran" : "Novice"}
                 </span>
              </p>
            </div>
        </div>

        {/* --- Stats & XP --- */}
        <div id="tour-stats" className="space-y-4">
        <Card className="bg-card border-border shadow-sm">
             <CardContent className="pt-6">
                <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wider">
                <span>Experience</span>
                <span>{char.currentXp} / {char.nextLevelXp} XP</span>
                </div>
                <Progress value={xpProgress} className="h-3 bg-secondary [&>div]:bg-gradient-to-r from-yellow-500 to-orange-500" />
            </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-3">
            <StatBox label="STR" value={char.str} color="text-red-500" />
            <StatBox label="INT" value={char.int} color="text-blue-500" />
            <StatBox label="VIT" value={char.vit} color="text-green-500" />
        </div>
        </div>
        {/* --- Daily Quest Board --- */}
        <div id="tour-daily" className="space-y-4">
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground border-l-4 border-primary pl-3">
                Daily Quests
                </h2>
                {isAllDone && (
                    <span className="text-xs font-bold text-green-500 bg-green-900/10 px-2 py-1 rounded-full border border-green-500/20 animate-pulse">
                        🎉 Bonus Claimed!
                    </span>
                )}
            </div>
            
            <div className="grid gap-3">
                {dailyQuests.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                        No quests available. Please add quests in Manage menu.
                    </div>
                ) : (
                    dailyQuests.map((quest) => {
                    const isCompleted = dailyProgress.completedIds.includes(quest.id)
                    return (
                        // ✅ ใช้ QuestButton แทน Form เดิม
                        <QuestButton 
                            key={quest.id}
                            questId={quest.id}
                            title={quest.title}
                            xpReward={quest.xpReward}
                            statReward={quest.statReward}
                            statType={quest.statType}
                            isCompleted={isCompleted}
                        />
                    )
                    })
                )}
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
                ทำครบ 3 เควสเพื่อรับ Bonus XP! 🎁 (รีเซ็ตทุกเที่ยงคืน)
            </p>
        </div>
            </div>
      </div>
    </main>
  )
}

function StatBox({ label, value, color }: any) {
    return (
      <div className={`bg-card border border-border p-4 rounded-xl text-center flex flex-col items-center justify-center shadow-sm`}>
        <div className={`font-black text-sm mb-1 ${color} tracking-widest`}>{label}</div>
        <div className="text-3xl font-mono font-bold text-card-foreground">{value}</div>
      </div>
    )
}