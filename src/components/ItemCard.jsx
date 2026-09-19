import { Check, Tag, History } from 'lucide-react';
import { MARKET_KEYS, normalize, formatBRL } from '../utils/format';

function bestMarketKey(item) {
  const fromApi = MARKET_KEYS.find(
    (m) => normalize(m.label) === normalize(item.mercadoMaisBarato || '')
  );
  if (fromApi) return fromApi.key;
  let best = null;
  let bestPrice = Infinity;
  MARKET_KEYS.forEach((m) => {
    const price = Number(item[m.key]);
    if (Number.isFinite(price) && price < bestPrice) {
      bestPrice = price;
      best = m.key;
    }
  });
  return best;
}

export default function ItemCard({ item, onToggle }) {
  const checked = Boolean(item.comprar);
  const bestKey = bestMarketKey(item);
  const bestLabel = MARKET_KEYS.find((m) => m.key === bestKey)?.label;

  return (
    <article
      className={`bg-surface-container-lowest rounded-lg p-2.5 shadow-card transition-all duration-200 flex flex-col gap-1.5 ${
        checked ? '' : 'opacity-90'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            type="button"
            aria-label={checked ? `Desmarcar ${item.categoria}` : `Marcar ${item.categoria}`}
            onClick={() => onToggle(item.linha, !checked)}
            className="w-7 h-7 flex-shrink-0 flex items-center justify-center cursor-pointer rounded-full active:scale-95"
          >
            {checked ? (
              <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                <Check className="w-4 h-4" strokeWidth={3} />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-surface-container" />
            )}
          </button>
          <h3
            className={`font-semibold text-[14px] truncate leading-tight ${
              checked ? 'text-on-surface' : 'line-through text-outline'
            }`}
          >
            {item.categoria}
          </h3>
        </div>
        {bestLabel && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/30 text-on-secondary-fixed-variant text-label-sm font-bold flex-shrink-0">
            <Tag className="w-3 h-3" />
            {bestLabel}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[12px] bg-surface-container-low px-2 py-1 rounded overflow-x-auto no-scrollbar tnum">
        {MARKET_KEYS.map((m) => {
          const price = Number(item[m.key]);
          const isBest = m.key === bestKey;
          return (
            <span key={m.key} className="flex items-center gap-1 whitespace-nowrap">
              <span className={isBest ? 'text-on-surface-variant' : 'text-on-surface-variant'}>
                {m.label}
              </span>
              {Number.isFinite(price) ? (
                <span
                  className={
                    isBest
                      ? 'font-bold text-primary bg-secondary-container/40 px-1 rounded'
                      : 'font-medium text-on-surface'
                  }
                >
                  {formatBRL(price)}
                </span>
              ) : (
                <span className="text-outline">—</span>
              )}
              {m.key !== 'atacadao' && <span className="text-outline text-[10px]">•</span>}
            </span>
          );
        })}
      </div>

      {item.ultimaCompra !== undefined &&
        item.ultimaCompra !== null &&
        String(item.ultimaCompra).trim() !== '' && (
          <p className="text-body-sm text-on-surface-variant px-1 flex items-center gap-1">
            <History className="w-3 h-3 shrink-0" />
            Última compra:{' '}
            {typeof item.ultimaCompra === 'number'
              ? formatBRL(item.ultimaCompra)
              : item.ultimaCompra}
          </p>
        )}
    </article>
  );
}