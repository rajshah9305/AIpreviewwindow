interface LoadingSkeletonProps {
  style: 'minimal' | 'bold' | 'elegant' | 'playful' | 'modern';
  name: string;
}

export default function LoadingSkeleton({ name }: Omit<LoadingSkeletonProps, 'style'>) {
  return (
    <div className="bg-white rounded-3xl h-full flex flex-col border border-neutral-100 overflow-hidden animate-pulse">
      <div className="px-5 py-4 border-b border-neutral-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
          <div className="h-3 bg-neutral-100 rounded-full w-20" />
        </div>
        <div className="flex space-x-1">
          <div className="w-8 h-8 rounded-lg bg-neutral-50" />
          <div className="w-8 h-8 rounded-lg bg-neutral-50" />
        </div>
      </div>
      
      <div className="flex-1 p-8 flex flex-col justify-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-neutral-50 mx-auto" />
        <div className="space-y-3">
          <div className="h-3 bg-neutral-100 rounded-full w-3/4 mx-auto" />
          <div className="h-3 bg-neutral-100 rounded-full w-1/2 mx-auto" />
        </div>
        <p className="text-center text-xs text-neutral-400 font-medium uppercase tracking-widest">
          Generating {name}...
        </p>
      </div>
    </div>
  )
}
