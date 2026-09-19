import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toasts }) {
  return (
    <div className="fixed bottom-24 inset-x-4 z-[60] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`w-full max-w-sm flex items-center gap-2 px-4 py-3 rounded-xl shadow-modal text-body-md text-inverse-on-surface bg-inverse-surface animate-[toast-in_0.25s_ease] ${
            t.type === 'error'
              ? 'border border-red-400/40'
              : 'border border-secondary-container/20'
          }`}
        >
          {t.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-300" />
          ) : (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-secondary-container" />
          )}
          <span className="flex-1 min-w-0">{t.message}</span>
          <button
            type="button"
            aria-label="Fechar aviso"
            className="text-inverse-on-surface/70 hover:text-inverse-on-surface p-0.5 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <style>{`@keyframes toast-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}