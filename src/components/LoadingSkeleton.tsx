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
      className="card overflow-hidden animate-fade-in h-full flex flex-col"
      style={{ animationDelay: `${Object.keys(styleColors).indexOf(style) * 100}ms` }}
    >
      <div className="p-3 bg-gradient-to-r from-neutral-50 to-primary-50 border-b border-neutral-200 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${styleColors[style]} shadow-sm animate-pulse`} />
          <h4 className="font-semibold text-sm text-neutral-900">{name}</h4>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 animate-pulse" />
          <div className="w-8 h-8 rounded-lg bg-neutral-100 animate-pulse" />
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-br from-neutral-50 to-primary-50/30 flex-1 flex items-center justify-center">
        <div className="w-full bg-white rounded-lg shadow-sm p-8 space-y-4">
          {/* Loading animation */}
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              {/* Outer ring */}
              <div className={`w-16 h-16 rounded-full border-4 border-neutral-200`} />
              
              {/* Spinning ring */}
              <div 
                className={`absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary-500 animate-spin`}
                style={{ animationDuration: '1s' }}
              />
              
              {/* Inner pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-primary-100 animate-pulse" />
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
