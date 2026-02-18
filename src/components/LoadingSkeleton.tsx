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
      className="card overflow-hidden animate-fade-in h-full flex flex-col border-2"
      style={{ animationDelay: `${Object.keys(styleColors).indexOf(style) * 100}ms` }}
    >
      <div className="p-2.5 bg-gradient-to-r from-neutral-50 to-primary-50 border-b-2 border-neutral-200 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${styleColors[style]} shadow-sm animate-pulse`} />
          <h4 className="font-semibold text-xs text-neutral-900">{name}</h4>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-7 h-7 rounded-lg bg-neutral-100 animate-pulse" />
          <div className="w-7 h-7 rounded-lg bg-neutral-100 animate-pulse" />
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-br from-neutral-50 to-primary-50/30 flex-1 flex items-center justify-center">
        <div className="w-full bg-white rounded-lg shadow-sm p-8 space-y-4 min-h-[400px] flex flex-col justify-center">
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
