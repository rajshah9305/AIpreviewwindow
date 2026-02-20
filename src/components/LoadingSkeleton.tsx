interface LoadingSkeletonProps {
  style: 'minimal' | 'bold' | 'elegant' | 'playful' | 'modern';
  name: string;
}

export default function LoadingSkeleton({ style, name }: LoadingSkeletonProps) {
  const styleColors = {
    minimal: 'from-neutral-500 to-neutral-600',
    bold: 'from-accent-500 to-primary-500',
    elegant: 'from-primary-400 to-accent-400',
    playful: 'from-yellow-500 to-primary-500',
    modern: 'from-primary-500 to-accent-500',
  }

  return (
    <div 
      className="bg-white rounded-[2rem] overflow-hidden animate-fade-in h-full flex flex-col border border-neutral-200/60"
      style={{ animationDelay: `${Object.keys(styleColors).indexOf(style) * 100}ms` }}
    >
      <div className="px-4 sm:px-5 py-3 sm:py-4 bg-white border-b border-neutral-100 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br ${styleColors[style]} shadow-sm animate-pulse`} />
          <div className="flex flex-col">
            <h4 className="font-bold text-xs sm:text-[13px] text-neutral-900 tracking-tight leading-none">{name}</h4>
            <span className="text-[8px] sm:text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-1">{style}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-50 animate-pulse" />
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-neutral-50 animate-pulse" />
        </div>
      </div>
      
      <div className="p-6 sm:p-8 bg-gradient-to-br from-neutral-50/50 via-white to-primary-50/30 flex-1 flex items-center justify-center">
        <div className="w-full bg-white rounded-2xl shadow-lg p-8 sm:p-12 space-y-6 min-h-[500px] sm:min-h-[600px] flex flex-col justify-center border border-neutral-100 ring-1 ring-neutral-200/50">
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className={`w-20 h-20 rounded-full border-4 border-neutral-200`} />
              <div 
                className={`absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-primary-500 animate-spin`}
                style={{ animationDuration: '1s' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded-lg w-3/4 mx-auto" />
            <div className="h-4 bg-neutral-200 rounded-lg w-1/2 mx-auto" />
            <div className="h-4 bg-neutral-200 rounded-lg w-5/6 mx-auto" />
            <div className="h-3 bg-neutral-100 rounded-lg w-2/3 mx-auto mt-6" />
          </div>
          
          <div className="text-center pt-4">
            <p className="text-base text-neutral-600 animate-pulse font-semibold">
              Generating {name.toLowerCase()}...
            </p>
            <p className="text-xs text-neutral-400 mt-2">This may take a few moments</p>
          </div>
        </div>
      </div>
    </div>
  )
}
