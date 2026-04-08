import { LucideIcon, ArrowRight } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white border border-black/[0.07] rounded-2xl p-12 sm:p-16 text-center shadow-card animate-fade-in group">
      <div
        className="w-14 h-14 mx-auto mb-5 bg-neutral-50 rounded-2xl flex items-center justify-center border border-black/[0.06] transition-all duration-300 group-hover:border-orange-200 group-hover:bg-orange-50"
        aria-hidden="true"
      >
        <Icon className="w-6 h-6 text-neutral-300 group-hover:text-orange-400 transition-colors duration-300" />
      </div>
      <h2 className="text-base font-display font-700 tracking-tight text-neutral-800 mb-2">{title}</h2>
      {description && (
        <p className="text-sm text-neutral-400 mb-7 max-w-xs mx-auto leading-relaxed font-accent">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary inline-flex rounded-full px-6 py-2.5 text-[12px] uppercase tracking-widest group/btn"
        >
          {action.label}
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
