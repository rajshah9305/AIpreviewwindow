import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

const TOAST_CONFIG: Record<ToastType, { icon: typeof CheckCircle; accent: string; bg: string; border: string }> = {
  success: { icon: CheckCircle, accent: 'bg-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  error: { icon: XCircle, accent: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-100' },
  warning: { icon: AlertCircle, accent: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
  info: { icon: Info, accent: 'bg-neutral-900', bg: 'bg-neutral-50', border: 'border-neutral-100' },
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  const [progress, setProgress] = useState(100)
  const config = TOAST_CONFIG[type]
  const Icon = config.icon

  useEffect(() => {
    if (duration <= 0) return

    const timer = setTimeout(onClose, duration)
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - (100 / (duration / 50))))
    }, 50)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [duration, onClose])

  return (
    <div
      className={`bg-white/95 backdrop-blur-xl border ${config.border} rounded-xl p-3 sm:p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3 min-w-[280px] sm:min-w-[320px] max-w-md animate-slide-up relative overflow-hidden`}
      role="alert"
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-100">
        <div
          className={`h-full ${config.accent} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-7 h-7 ${config.bg} rounded-lg flex items-center justify-center shrink-0`}>
          <Icon className="w-3.5 h-3.5" style={{ color: 'inherit' }} />
        </div>
        <p className="text-[11px] sm:text-xs font-display font-bold tracking-tight text-neutral-800 break-words">{message}</p>
      </div>

      <button
        onClick={onClose}
        className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-300 hover:text-neutral-500 transition-all shrink-0 touch-manipulation"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
