export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl h-full flex flex-col border-2 border-neutral-100 overflow-hidden relative group shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between bg-white backdrop-blur-sm relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-200 animate-pulse" />
          <div className="h-3 bg-neutral-100 rounded-full w-24 animate-pulse" />
        </div>
        <div className="flex space-x-1.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-50 animate-pulse" />
          <div className="w-8 h-8 rounded-lg bg-neutral-50 animate-pulse" />
        </div>
      </div>
      
      {/* Body */}
      <div className="flex-1 p-10 flex flex-col items-center justify-center space-y-7 relative z-10">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          </div>
        </div>

        <div className="space-y-3.5 w-full max-w-[200px]">
          <div className="h-2.5 bg-neutral-100 rounded-full w-full animate-pulse" />
          <div className="h-2.5 bg-neutral-50 rounded-full w-3/4 mx-auto animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="h-2.5 bg-neutral-50 rounded-full w-1/2 mx-auto animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>

        <p className="text-[10px] font-display font-bold text-orange-400 uppercase tracking-[0.12em]">Generating...</p>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-50 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 w-1/3 animate-[loading-bar_2s_infinite_ease-in-out] shadow-lg shadow-orange-500/30" />
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  )
}
