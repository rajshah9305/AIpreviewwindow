import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />,
    warning: <AlertCircle className="w-4 h-4 text-yellow-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
  }

  return (
    <div
      className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 min-w-[300px] max-w-md animate-fade-in"
      role="alert"
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="text-sm font-semibold text-neutral-900">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 hover:bg-neutral-50 rounded-lg text-neutral-400 transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
