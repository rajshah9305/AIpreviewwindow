import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  children?: ReactNode
}

export default function EmptyState({ icon: Icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div className="bg-white border border-neutral-200/60 rounded-[2rem] sm:rounded-[3rem] p-12 sm:p-20 text-center shadow-sm animate-fade-in">
      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-neutral-50 to-primary-50 rounded-[2rem] flex items-center justify-center shadow-inner">
        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-300" />
      </div>
      <h3 className="text-xl sm:text-2xl font-display font-black text-neutral-900 mb-3">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-neutral-500 max-w-md mx-auto font-medium leading-relaxed mb-6">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </button>
      )}
      {children}
    </div>
  )
}
