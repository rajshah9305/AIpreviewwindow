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
    <div className="bg-white border border-neutral-100 rounded-[3rem] p-20 text-center shadow-premium animate-fade-in relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      <div className="relative z-10">
        <div className="w-20 h-20 mx-auto mb-8 bg-neutral-50 rounded-[2rem] flex items-center justify-center shadow-sm border border-neutral-100 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
          <Icon className="w-8 h-8 text-neutral-300 group-hover:text-orange-500 transition-colors duration-700" />
        </div>
        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-10">{title}</h3>
        {action && (
          <button
            onClick={action.onClick}
            className="btn-orange"
          >
            {action.label.toUpperCase()}
          </button>
        )}
      </div>
    </div>
  )
}
