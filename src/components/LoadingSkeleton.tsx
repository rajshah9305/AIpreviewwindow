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
      <div className="px-5 py-4 bg-white border-b border-neutral-100 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${styleColors[style]} shadow-sm animate-pulse`} />
          <div className="flex flex-col">
            <h4 className="font-bold text-[13px] text-neutral-900 tracking-tight leading-none">{name}</h4>
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-1">{style}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-9 h-9 rounded-xl bg-neutral-50 animate-pulse" />
          <div className="w-9 h-9 rounded-xl bg-neutral-50 animate-pulse" />
        </div>
      </div>
      
      <div className="p-6 bg-neutral-50/30 flex-1 flex items-center justify-center">
        <div className="w-full bg-white rounded-2xl shadow-sm p-8 space-y-4 min-h-[400px] flex flex-col justify-center border border-neutral-100">
          <div className="flex items-center justify-center py-10">
            <div className="relative">
              <div className={`w-14 h-14 rounded-full border-4 border-neutral-200`} />
              <div 
                className={`absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-primary-500 animate-spin`}
                style={{ animationDuration: '1s' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-primary-100 animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="space-y-3 animate-pulse">
            <div className="h-3 bg-neutral-200 rounded w-3/4 mx-auto" />
            <div className="h-3 bg-neutral-200 rounded w-1/2 mx-auto" />
            <div className="h-3 bg-neutral-200 rounded w-5/6 mx-auto" />
          </div>
          
          <div className="text-center pt-2">
            <p className="text-sm text-neutral-500 animate-pulse font-medium">
              Generating {name.toLowerCase()}...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
