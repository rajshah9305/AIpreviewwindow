import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

const CONFIG: Record<ToastType, {
  icon: typeof CheckCircle
  accent: string
  iconColor: string
  bg: string
  border: string
  progress: string
}> = {
  success: {
    icon: CheckCircle,
    accent: 'bg-emerald-500',
    iconColor: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    progress: 'bg-emerald-500',
  },
  error: {
    icon: XCircle,
    accent: 'bg-red-500',
    iconColor: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-100',
    progress: 'bg-red-500',
  },
  warning: {
    icon: AlertCircle,
    accent: 'bg-orange-500',
    iconColor: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    progress: 'bg-orange-500',
  },
  info: {
    icon: Info,
    accent: 'bg-neutral-700',
    iconColor: 'text-neutral-600',
    bg: 'bg-neutral-50',
    border: 'border-neutral-200',
    progress: 'bg-neutral-600',
  },
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  const [progress, setProgress] = useState(100)
  const { icon: Icon, iconColor, bg, border, progress: progressColor } = CONFIG[type]

  useEffect(() => {
    if (duration <= 0) return
    const timer    = setTimeout(onClose, duration)
    const interval = setInterval(() => {
      setProgress(p => Math.max(0, p - (100 / (duration / 50))))
    }, 50)
    return () => { clearTimeout(timer); clearInterval(interval) }
  }, [duration, onClose])

  return (
    <div
      className={`bg-white/96 backdrop-blur-xl border ${border} rounded-2xl p-3.5 shadow-premium flex items-center justify-between gap-3 min-w-[280px] sm:min-w-[320px] max-w-sm animate-slide-up relative overflow-hidden`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-100" aria-hidden="true">
        <div
          className={`h-full ${progressColor} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center shrink-0 border ${border}`} aria-hidden="true">
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <p className="text-sm font-accent font-500 text-neutral-800 break-words leading-snug">{message}</p>
      </div>

      <button
        onClick={onClose}
        className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-300 hover:text-neutral-600 transition-all shrink-0 touch-manipulation"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
