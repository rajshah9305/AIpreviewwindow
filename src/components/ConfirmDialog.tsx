import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning',
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const variantStyles = {
    danger: {
      icon: 'bg-red-100 text-red-600',
      button: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500',
    },
    warning: {
      icon: 'bg-yellow-100 text-yellow-600',
      button: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:ring-yellow-500',
    },
    info: {
      icon: 'bg-blue-100 text-blue-600',
      button: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500',
    },
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${variantStyles[variant].icon}`}>
            <AlertTriangle className="w-7 h-7" />
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <h2 id="dialog-title" className="text-2xl font-bold text-neutral-900 mb-3">
          {title}
        </h2>
        <p className="text-neutral-600 leading-relaxed mb-8">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onCancel()
            }}
            className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantStyles[variant].button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
