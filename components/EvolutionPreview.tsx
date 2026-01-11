"use client"

export function EvolutionPreview({ charClass }: { charClass: string }) {
  const ranks = ['Novice', 'Veteran', 'Master']
  
  return (
    <div className="mt-8 pt-8 border-t border-border">
        <h3 className="text-center text-yellow-500 font-bold uppercase tracking-widest mb-4">Evolution Path</h3>
        <div className="flex justify-between gap-2">
            {ranks.map((rank, i) => (
                <div key={rank} className="flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition">
                    <div className={`w-20 h-20 rounded-full border-2 ${i===2 ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'border-border'} overflow-hidden bg-black`}>
                        <img 
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${charClass}-${rank}-Preview`} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{rank}</span>
                    <span className="text-[10px] text-slate-600">Lv.{i === 0 ? 1 : i === 1 ? 10 : 30}+</span>
                </div>
            ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">Keep grinding to unlock new forms!</p>
    </div>
  )
}