export default function LoadingSkeleton() {
  return (
    <div className="bg-white border border-black/5 rounded-3xl h-full flex flex-col overflow-hidden relative group shadow-glass">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between bg-white relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500/20 animate-pulse" />
          <div className="h-2.5 bg-neutral-100 rounded-full w-24 animate-pulse" />
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 rounded-xl bg-neutral-50 animate-pulse" />
          <div className="w-8 h-8 rounded-xl bg-neutral-50 animate-pulse" style={{ animationDelay: '150ms' }} />
        </div>
      </div>
      
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-neutral-100 bg-neutral-50/50">
        <div className="h-6 w-20 bg-neutral-100 rounded-lg animate-pulse" />
        <div className="h-6 w-16 bg-neutral-50 rounded-lg animate-pulse" style={{ animationDelay: '100ms' }} />
      </div>

      {/* Body */}
      <div className="flex-1 p-8 sm:p-12 flex flex-col items-center justify-center space-y-6 relative z-10">
        {/* Spinner container */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-neutral-50 animate-pulse shadow-sm border border-neutral-100" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-9 h-9 border-2 border-neutral-100 border-t-[#f97316] rounded-full animate-spin" />
          </div>
        </div>

        {/* Text lines */}
        <div className="space-y-3 w-full max-w-[200px]">
          <div className="h-2 bg-gradient-to-r from-orange-500/10 to-orange-500/5 rounded-full w-full animate-pulse" />
          <div className="h-2 bg-neutral-50 rounded-full w-4/5 mx-auto animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="h-2 bg-neutral-100 rounded-full w-3/5 mx-auto animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-100 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-[10px] font-display font-bold uppercase tracking-widest text-orange-500">Generating...</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 w-1/3 animate-[loading-bar_2s_infinite_ease-in-out]" />
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
