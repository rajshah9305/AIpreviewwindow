import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  }

  return (
    <div
      className={`${styles[type]} border-2 rounded-2xl p-4 shadow-lg animate-slide-down flex items-start justify-between gap-3 min-w-[320px] max-w-md`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 flex-1">
        <div className={iconColors[type]}>{icons[type]}</div>
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
