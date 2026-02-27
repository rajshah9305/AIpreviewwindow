import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'primary';
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = 'primary',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Close dialog"
        role="button"
        tabIndex={-1}
      />
      <div className="relative bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-[0_24px_64px_rgba(0,0,0,0.12)] border-2 border-black animate-scale-in">
        {variant === 'danger' && (
          <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
        )}

        <h3 className="text-base sm:text-lg font-display font-bold tracking-tight text-neutral-900">{title}</h3>
        
        {description && (
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">{description}</p>
        )}

        <div className="flex flex-col gap-2 sm:gap-2.5 mt-6">
          <button
            onClick={onConfirm}
            className={`w-full py-2.5 sm:py-3 rounded-xl font-display font-bold uppercase tracking-[0.06em] transition-all duration-300 active:scale-[0.98] text-[10px] sm:text-xs touch-manipulation ${
              variant === 'danger'
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-neutral-900 text-white hover:bg-black'
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2.5 sm:py-3 bg-neutral-50 text-neutral-500 rounded-xl font-display font-bold uppercase tracking-[0.06em] hover:bg-neutral-100 transition-all active:scale-[0.98] text-[10px] sm:text-xs touch-manipulation"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}
