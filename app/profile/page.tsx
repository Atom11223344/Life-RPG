import { getCharacter, getQuestHistory } from '../actions'
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from 'next/link'
import { StatsRadar } from '@/components/StatsRadar'
import { Achievements } from '@/components/Achievements'
import { EvolutionPreview } from '@/components/EvolutionPreview' // ✅ Import
export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const char = await getCharacter()
  if (!char) redirect('/create')
  
  const history = await getQuestHistory()
  const totalQuests = history.length

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8 pb-20">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Navbar */}
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-yellow-500 uppercase tracking-widest">Character Sheet</h1>
            <Link href="/" className="px-4 py-2 bg-secondary rounded-lg hover:bg-muted text-sm font-bold transition">
                ✕ Close
            </Link>
        </div>

        {/* Header Stats */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-card border border-border p-6 rounded-2xl shadow-xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-800/20 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>

            {/* Avatar Big */}
            <div className="relative z-10">
                 <div className="w-32 h-32 rounded-full border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.4)] overflow-hidden bg-black">
                    <img src={char.avatarUrl || ""} alt="Profile" className="w-full h-full object-cover" />
                 </div>
                 <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                    {char.class}
                 </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left z-10 space-y-2">
                <div>
                    <h2 className="text-3xl font-black text-foreground">{char.name}</h2>
                    <p className="text-muted-foreground text-sm">Joined: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="bg-secondary/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground uppercase">Level</div>
                        <div className="text-xl font-black text-foreground">{char.level}</div>
                    </div>
                    <div className="bg-secondary/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground uppercase">Quests</div>
                        <div className="text-xl font-black text-foreground">{totalQuests}</div>
                    </div>
                    <div className="bg-secondary/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground uppercase">Streak</div>
                        <div className="text-xl font-black text-orange-500">🔥 {char.streak}</div>
                    </div>
                </div>
            </div>
        </div>

        {/* 📊 Radar Chart (Stats Analysis) */}
        <div className="space-y-4">
             <h3 className="text-xl font-bold border-l-4 border-yellow-500 pl-3">Stats Analysis</h3>
             <div className="grid md:grid-cols-2 gap-6 items-center">
                 <StatsRadar str={char.str} int={char.int} vit={char.vit} />
                 
                 <div className="space-y-3">
                     <div className="p-4 bg-secondary/30 border border-border rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-red-400">STR (Body)</span>
                            <span className="text-xl font-mono">{char.str}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: `${Math.min(char.str, 100)}%` }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Muscle power & physical strength.</p>
                     </div>

                     <div className="p-4 bg-secondary/30 border border-border rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-blue-400">INT (Brain)</span>
                            <span className="text-xl font-mono">{char.int}</span>
                        </div>
                         <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${Math.min(char.int, 100)}%` }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Knowledge, focus & mental skills.</p>
                     </div>

                     <div className="p-4 bg-secondary/30 border border-border rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-green-400">VIT (Health)</span>
                            <span className="text-xl font-mono">{char.vit}</span>
                        </div>
                         <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${Math.min(char.vit, 100)}%` }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Stamina, cardio & wellness.</p>
                     </div>
                 </div>
             </div>
        </div>

        {/* 🏆 Achievements */}
        <Achievements char={char} />
        <EvolutionPreview charClass={char.class} />
      </div>
    </main>
  )
}