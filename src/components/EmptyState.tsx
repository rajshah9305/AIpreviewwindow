import { LucideIcon, ArrowRight } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white border-2 border-neutral-100 rounded-2xl p-12 sm:p-14 md:p-16 text-center shadow-[0_8px_32px_rgba(0,0,0,0.04)] animate-fade-in relative overflow-hidden group">
      <div className="relative z-10">
        <div className="w-16 h-16 sm:w-16 sm:h-16 mx-auto mb-6 sm:mb-6 bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-2xl flex items-center justify-center border-2 border-neutral-100 transition-all duration-500 group-hover:border-orange-500/30 group-hover:shadow-lg group-hover:shadow-orange-500/10">
          <Icon className="w-7 h-7 sm:w-7 sm:h-7 text-neutral-300 group-hover:text-orange-500 transition-colors duration-500" />
        </div>
        <h3 className="text-lg sm:text-lg font-display font-bold tracking-tight text-neutral-800 mb-2.5" style={{ fontWeight: 750 }}>{title}</h3>
        {description && (
          <p className="text-sm sm:text-sm text-neutral-500 mb-7 sm:mb-8 max-w-xs mx-auto leading-relaxed">{description}</p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2.5 px-6 sm:px-6 py-3.5 sm:py-3 bg-neutral-900 text-white rounded-xl text-sm sm:text-sm font-display font-bold hover:bg-black transition-all active:scale-95 touch-manipulation tracking-tight shadow-md hover:shadow-lg group/btn min-h-[52px] sm:min-h-0"
          >
            {action.label}
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  )
}
