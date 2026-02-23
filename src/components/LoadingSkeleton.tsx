export default function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl h-full flex flex-col border border-neutral-100/60 overflow-hidden relative group">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-50 flex items-center justify-between bg-white/80 backdrop-blur-sm relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-neutral-200 animate-pulse" />
          <div className="h-2.5 bg-neutral-100 rounded-full w-20 animate-pulse" />
        </div>
        <div className="flex space-x-1.5">
          <div className="w-7 h-7 rounded-lg bg-neutral-50 animate-pulse" />
          <div className="w-7 h-7 rounded-lg bg-neutral-50 animate-pulse" />
        </div>
      </div>
      
      {/* Body */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-6 relative z-10">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-neutral-50 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-orange-500/15 border-t-orange-500 rounded-full animate-spin" />
          </div>
        </div>

        <div className="space-y-3 w-full max-w-[180px]">
          <div className="h-2 bg-neutral-100 rounded-full w-full animate-pulse" />
          <div className="h-2 bg-neutral-50 rounded-full w-3/4 mx-auto animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="h-2 bg-neutral-50 rounded-full w-1/2 mx-auto animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>

        <p className="text-[9px] font-display font-semibold text-neutral-300 uppercase tracking-[0.1em]">Generating...</p>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-50 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-500/60 to-orange-500 w-1/3 animate-[loading-bar_2s_infinite_ease-in-out]" />
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
