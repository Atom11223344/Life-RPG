"use client"

export function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean, 
  title: string, 
  message: string, 
  onConfirm: () => void, 
  onCancel: () => void 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border-2 border-red-500/50 p-6 rounded-2xl shadow-2xl max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-200">
        
        <h2 className="text-xl font-black text-red-500 flex items-center gap-2">
          ⚠️ {title}
        </h2>
        
        <p className="text-muted-foreground">{message}</p>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg bg-secondary hover:bg-muted font-bold transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-lg"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  )
}