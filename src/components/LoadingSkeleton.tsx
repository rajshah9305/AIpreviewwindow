export default function LoadingSkeleton() {
  return (
    <div
      className="bg-white border border-black/[0.07] rounded-[1.125rem] h-full flex flex-col overflow-hidden relative shadow-card"
      aria-busy="true"
      aria-label="Loading component"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-300/60 animate-pulse-dot" aria-hidden="true" />
          <div className="h-2 bg-neutral-100 rounded-full w-20 animate-pulse" aria-hidden="true" />
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
          <div className="w-7 h-7 rounded-lg bg-neutral-50 animate-pulse" />
          <div className="w-7 h-7 rounded-lg bg-neutral-50 animate-pulse" style={{ animationDelay: '100ms' }} />
          <div className="w-7 h-7 rounded-lg bg-neutral-50 animate-pulse" style={{ animationDelay: '200ms' }} />
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-neutral-50 bg-neutral-50/60" aria-hidden="true">
        <div className="h-5 w-16 bg-neutral-100 rounded-md animate-pulse" />
        <div className="h-5 w-12 bg-neutral-50 rounded-md animate-pulse" style={{ animationDelay: '80ms' }} />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8" aria-hidden="true">
        {/* Spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-2xl bg-neutral-50 border border-neutral-100" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-neutral-100 border-t-orange-400 rounded-full animate-spin" />
          </div>
        </div>

        {/* Shimmer lines */}
        <div className="space-y-2.5 w-full max-w-[180px]">
          <div
            className="h-1.5 rounded-full w-full"
            style={{
              background: 'linear-gradient(90deg, #fed7aa 0%, #fb923c 50%, #fed7aa 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
            }}
          />
          <div className="h-1.5 bg-neutral-100 rounded-full w-4/5 mx-auto animate-pulse" style={{ animationDelay: '120ms' }} />
          <div className="h-1.5 bg-neutral-50 rounded-full w-3/5 mx-auto animate-pulse" style={{ animationDelay: '240ms' }} />
        </div>

        {/* Status pill */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-50 rounded-full border border-orange-100">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse-dot" aria-hidden="true" />
          <span className="text-[9px] font-display font-700 uppercase tracking-widest text-orange-500">Generating</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-100 overflow-hidden" aria-hidden="true">
        <div
          className="h-full w-1/3"
          style={{
            background: 'linear-gradient(90deg, transparent, #fb923c, #f97316, transparent)',
            animation: 'loading-bar 1.8s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  )
}
