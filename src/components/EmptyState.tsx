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
    <div className="bg-white border border-neutral-100/60 rounded-2xl p-10 sm:p-14 md:p-16 text-center shadow-[0_4px_24px_rgba(0,0,0,0.03)] animate-fade-in relative overflow-hidden group">
      <div className="relative z-10">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 sm:mb-6 bg-neutral-50 rounded-xl flex items-center justify-center border border-neutral-100/60 transition-all duration-500 group-hover:border-orange-500/20">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-300 group-hover:text-orange-500 transition-colors duration-500" />
        </div>
        <h3 className="text-base sm:text-lg font-display font-bold tracking-tight text-neutral-800 mb-2" style={{ fontWeight: 750 }}>{title}</h3>
        {description && (
          <p className="text-xs sm:text-sm text-neutral-400 mb-6 sm:mb-8 max-w-xs mx-auto">{description}</p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-neutral-900 text-white rounded-xl text-xs sm:text-sm font-display font-bold hover:bg-black transition-all active:scale-95 touch-manipulation tracking-tight shadow-sm hover:shadow-md group/btn"
          >
            {action.label}
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  )
}
