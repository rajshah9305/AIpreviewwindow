interface LoadingSkeletonProps {
  name: string;
}

export default function LoadingSkeleton({ name }: LoadingSkeletonProps) {
  return (
    <div className="bg-white rounded-[2rem] h-full flex flex-col border border-neutral-100 overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="px-5 py-4 border-b border-neutral-50 flex items-center justify-between bg-white/50 backdrop-blur-sm relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-200 animate-pulse" />
          <div className="h-2 bg-neutral-100 rounded-full w-24 animate-pulse" />
        </div>
        <div className="flex space-x-1.5">
          <div className="w-8 h-8 rounded-xl bg-neutral-50 animate-pulse" />
          <div className="w-8 h-8 rounded-xl bg-neutral-50 animate-pulse" />
        </div>
      </div>
      
      <div className="flex-1 p-8 flex flex-col justify-center space-y-8 relative z-10">
        <div className="relative mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-neutral-50 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          </div>
        </div>

        <div className="space-y-4 max-w-[200px] mx-auto">
          <div className="h-2 bg-neutral-100 rounded-full w-full animate-pulse" />
          <div className="h-2 bg-neutral-100 rounded-full w-2/3 mx-auto animate-pulse" />
          <div className="h-2 bg-neutral-100 rounded-full w-1/2 mx-auto animate-pulse" />
        </div>

        <div className="pt-4">
          <p className="text-center text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] animate-pulse">
            Crafting <span className="text-orange-500">{name}</span>
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-50 overflow-hidden">
        <div className="h-full bg-orange-500 w-1/3 animate-[loading-bar_2s_infinite_ease-in-out]" />
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  )
}
