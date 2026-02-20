import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />,
    warning: <AlertCircle className="w-4 h-4 text-orange-500" />,
    info: <Info className="w-4 h-4 text-black" />,
  }

  const styles = {
    success: 'border-green-100',
    error: 'border-red-100',
    warning: 'border-orange-100',
    info: 'border-neutral-100',
  }

  return (
    <div
      className={`bg-white/90 backdrop-blur-xl border ${styles[type]} rounded-[1.5rem] p-5 shadow-premium flex items-center justify-between gap-6 min-w-[320px] max-w-md animate-slide-up relative overflow-hidden group`}
      role="alert"
    >
      <div className={`absolute left-0 top-0 w-1 h-full ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-orange-500' :
        'bg-black'
      }`} />

      <div className="flex items-center gap-4">
        <div className="shrink-0">{icons[type]}</div>
        <p className="text-xs font-black uppercase italic tracking-tight text-black">{message}</p>
      </div>

      <button
        onClick={onClose}
        className="p-2 hover:bg-neutral-50 rounded-xl text-neutral-300 hover:text-black transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
