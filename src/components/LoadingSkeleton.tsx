interface LoadingSkeletonProps {
  style: 'minimal' | 'bold' | 'elegant' | 'playful' | 'modern';
  name: string;
}

export default function LoadingSkeleton({ style, name }: LoadingSkeletonProps) {
  const styleColors = {
    minimal: 'from-neutral-500 to-neutral-600',
    bold: 'from-red-500 to-orange-500',
    elegant: 'from-orange-400 to-red-400',
    playful: 'from-yellow-500 to-orange-500',
    modern: 'from-orange-500 to-red-500',
  }

  const animationDelays = {
    minimal: 'animation-delay-0',
    bold: 'animation-delay-100',
    elegant: 'animation-delay-200',
    playful: 'animation-delay-300',
    modern: 'animation-delay-400',
  }

  return (
    <div 
      className="card overflow-hidden animate-fade-in"
      style={{ animationDelay: `${Object.keys(styleColors).indexOf(style) * 100}ms` }}
    >
      <div className="p-3 bg-gradient-to-r from-neutral-50 to-orange-50 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${styleColors[style]} shadow-sm animate-pulse`} />
          <h4 className="font-semibold text-sm text-neutral-900">{name}</h4>
          <span className="px-2 py-0.5 bg-white rounded-md text-xs font-medium text-neutral-600 capitalize border border-neutral-200">
            {style}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 animate-pulse" />
          <div className="w-8 h-8 rounded-lg bg-neutral-100 animate-pulse" />
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-br from-neutral-50 to-orange-50/30">
        <div className="w-full bg-white rounded-lg shadow-sm p-8 space-y-4">
          {/* Loading animation */}
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              {/* Outer ring */}
              <div className={`w-16 h-16 rounded-full border-4 border-neutral-200`} />
              
              {/* Spinning ring */}
              <div 
                className={`absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-orange-500 animate-spin`}
                style={{ animationDuration: '1s' }}
              />
              
              {/* Inner pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-orange-100 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Skeleton content */}
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-3/4" />
            <div className="h-4 bg-neutral-200 rounded w-1/2" />
            <div className="h-4 bg-neutral-200 rounded w-5/6" />
          </div>
          
          {/* Loading text */}
          <div className="text-center">
            <p className="text-sm text-neutral-500 animate-pulse">
              Generating {name.toLowerCase()}...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
