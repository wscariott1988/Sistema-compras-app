import { ShoppingCart, QrCode, ReceiptText } from 'lucide-react';

const TABS = [
  { id: 'lista', label: 'Lista', icon: ShoppingCart },
  { id: 'bipar-nota', label: 'Bipar Nota', icon: QrCode },
  { id: 'fila', label: 'Fila', icon: ReceiptText },
];

export default function BottomNav({ tab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(15,23,42,0.06)]">
      <div className="flex justify-around items-center h-16 px-gutter">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] transition-colors ${
                active ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={active ? 2.4 : 2} />
              <span className="text-label-sm uppercase tracking-wider">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}