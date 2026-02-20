import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-16 text-center shadow-sm animate-fade-in">
      <div className="w-16 h-16 mx-auto mb-6 bg-neutral-50 rounded-2xl flex items-center justify-center">
        <Icon className="w-8 h-8 text-neutral-300" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-neutral-400 max-w-xs mx-auto mb-8 font-medium leading-relaxed">
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
    </div>
  )
}
