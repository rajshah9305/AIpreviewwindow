export default function LoadingSkeleton() {
  return (
    <div className="card-premium h-full flex flex-col overflow-hidden relative group">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between bg-white backdrop-blur-sm relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-200 to-amber-200 animate-pulse" />
          <div className="h-3.5 bg-gradient-to-r from-neutral-100 to-neutral-50 rounded-full w-28 animate-pulse" />
        </div>
        <div className="flex space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 animate-pulse" />
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-50 to-neutral-100 animate-pulse" style={{ animationDelay: '150ms' }} />
        </div>
      </div>
      
      {/* Body */}
      <div className="flex-1 p-12 flex flex-col items-center justify-center space-y-8 relative z-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 animate-pulse shadow-lg" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          </div>
        </div>

        <div className="space-y-4 w-full max-w-[220px]">
          <div className="h-3 bg-gradient-to-r from-neutral-100 to-neutral-50 rounded-full w-full animate-pulse" />
          <div className="h-3 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-full w-4/5 mx-auto animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="h-3 bg-gradient-to-r from-neutral-100 to-neutral-50 rounded-full w-3/5 mx-auto animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>

        <div className="badge-premium animate-pulse">
          <span className="text-orange-500">Generating...</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-neutral-50 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 w-1/3 animate-[loading-bar_2s_infinite_ease-in-out] shadow-lg shadow-orange-500/40" />
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
