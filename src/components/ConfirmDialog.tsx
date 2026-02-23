interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'primary';
}

export default function ConfirmDialog({
  isOpen,
  title,
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
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-neutral-100 animate-slide-up">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-6 sm:mb-8 text-black">{title}</h3>

        <div className="flex flex-col gap-2.5 sm:gap-3">
           <button
            onClick={onConfirm}
            className={`w-full py-3 sm:py-3.5 rounded-xl font-semibold uppercase tracking-widest-xl transition-all duration-300 active:scale-[0.98] text-[10px] sm:text-xs touch-manipulation ${
              variant === 'danger'
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-black text-white hover:bg-neutral-900'
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 sm:py-3.5 bg-neutral-50 text-neutral-500 rounded-xl font-semibold uppercase tracking-widest-xl hover:bg-neutral-100 transition-all active:scale-[0.98] text-[10px] sm:text-xs touch-manipulation"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}
