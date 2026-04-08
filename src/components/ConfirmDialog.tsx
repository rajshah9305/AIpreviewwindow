import { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description?: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'primary'
}

export default function ConfirmDialog({
  isOpen, title, description,
  confirmText, cancelText,
  onConfirm, onCancel,
  variant = 'primary',
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Enter')  onConfirm()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onCancel, onConfirm])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-fade-in"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-premium-lg border border-black/[0.07] animate-scale-in-spring"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? 'dialog-desc' : undefined}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {variant === 'danger' && (
          <div className="w-11 h-11 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center mb-4" aria-hidden="true">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
        )}

        <h3 id="dialog-title" className="text-base font-display font-700 tracking-tight text-neutral-900 pr-8 mb-1.5">
          {title}
        </h3>
        {description && (
          <p id="dialog-desc" className="text-sm text-neutral-500 font-accent leading-relaxed mb-5">
            {description}
          </p>
        )}

        <div className="flex flex-col gap-2 mt-5">
          <button
            onClick={onConfirm}
            className={`w-full py-2.5 rounded-xl font-display font-700 uppercase tracking-widest text-[11px] transition-all active:scale-[0.98] touch-manipulation ${
              variant === 'danger'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-neutral-900 text-white hover:bg-black'
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2.5 bg-neutral-50 text-neutral-500 rounded-xl font-display font-700 uppercase tracking-widest text-[11px] hover:bg-neutral-100 transition-all active:scale-[0.98] touch-manipulation"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}
