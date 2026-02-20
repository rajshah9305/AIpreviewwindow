interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'primary';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = 'primary',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl border border-neutral-100 animate-slide-up">
        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">{title}</h3>
        <p className="text-xs font-medium text-neutral-400 mb-10 leading-relaxed uppercase tracking-tight">{message}</p>

        <div className="flex flex-col gap-3">
           <button
            onClick={onConfirm}
            className={`w-full py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all duration-300 shadow-lg active:scale-[0.98] ${
              variant === 'danger'
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20'
              : 'bg-black text-white hover:bg-neutral-900 shadow-black/10'
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-4 bg-neutral-50 text-neutral-400 rounded-2xl font-black uppercase italic tracking-widest hover:bg-neutral-100 transition-all active:scale-[0.98]"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}
