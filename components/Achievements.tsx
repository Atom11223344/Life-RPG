"use client"

import { Card } from "@/components/ui/card"

export function Achievements({ char }: { char: any }) {
  
  // รายการเหรียญตราและเงื่อนไข
  const allBadges = [
    { 
      id: 'rookie', name: 'Rookie', icon: '🐣', desc: 'Start your journey', 
      unlocked: true // ได้ทุกคน
    },
    { 
      id: 'veteran', name: 'Veteran', icon: '⚔️', desc: 'Reach Level 10', 
      unlocked: char.level >= 10 
    },
    { 
      id: 'master', name: 'Grand Master', icon: '👑', desc: 'Reach Level 30', 
      unlocked: char.level >= 30 
    },
    { 
      id: 'gymrat', name: 'Hercules', icon: '💪', desc: 'STR 20+', 
      unlocked: char.str >= 20 
    },
    { 
      id: 'scholar', name: 'Einstein', icon: '🧠', desc: 'INT 20+', 
      unlocked: char.int >= 20 
    },
    { 
      id: 'tank', name: 'Iron Man', icon: '🛡️', desc: 'VIT 20+', 
      unlocked: char.vit >= 20 
    },
    { 
      id: 'onfire', name: 'On Fire', icon: '🔥', desc: '7 Day Streak', 
      unlocked: (char.streak || 0) >= 7 
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold border-l-4 border-yellow-500 pl-3">Achievements</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {allBadges.map((badge) => (
          <div 
            key={badge.id}
            className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 transition-all duration-300
              ${badge.unlocked 
                ? 'bg-secondary border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)] scale-100' 
                : 'bg-secondary/30 border-border opacity-40 grayscale scale-95'
              }`}
          >
            <div className="text-3xl filter drop-shadow-md">{badge.icon}</div>
            <div>
              <div className={`text-sm font-bold ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {badge.name}
              </div>
              <div className="text-[10px] text-muted-foreground">{badge.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}