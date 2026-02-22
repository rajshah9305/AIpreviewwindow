import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon: Icon, title, action }: EmptyStateProps) {
  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-10 sm:p-12 md:p-16 text-center shadow-premium animate-fade-in relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="relative z-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 bg-neutral-50 rounded-xl flex items-center justify-center shadow-sm border border-neutral-100 transition-all duration-700">
          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-300 group-hover:text-orange-500 transition-colors duration-700" />
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight mb-6 sm:mb-8">{title}</h3>
        {action && (
          <button
            onClick={action.onClick}
            className="btn-orange"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
