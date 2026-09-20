import { Check, Tag, History } from 'lucide-react';
import {
  getMicroLabel,
  getPrecoValor,
  getPrecosOrdenados,
  menorPrecoItem,
  formatBRL,
} from '../utils/format';

function melhorMercado(item) {
  const menor = menorPrecoItem(item);
  if (menor <= 0) return null;
  const precos = getPrecosOrdenados(item);
  const found = precos.find(([, p]) => getPrecoValor(p) === menor);
  return found ? found[0] : null;
}

export default function ItemCard({ item, onToggle }) {
  const checked = Boolean(item.comprar);
  const precos = getPrecosOrdenados(item);
  const menor = menorPrecoItem(item);
  const melhor = melhorMercado(item);
  const marcaPreferida = [null, undefined, '', 'Genérica', 'Qualquer'].includes(item.marcaPreferida)
    ? null
    : item.marcaPreferida;

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
          <div className="flex flex-col min-w-0 flex-1">
            <h3
              className={`font-semibold text-[14px] truncate leading-tight ${
                checked ? 'text-on-surface' : 'line-through text-outline'
              }`}
            >
              {item.categoria}
            </h3>
            {marcaPreferida && (
              <span className="inline-flex items-center gap-0.5 self-start mt-0.5 px-1.5 py-px rounded-full text-[10px] leading-tight bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                <span aria-hidden="true" className="text-[9px]">⭐</span>
                {marcaPreferida}
              </span>
            )}
          </div>
        </div>
        {melhor && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/30 text-on-secondary-fixed-variant text-label-sm font-bold flex-shrink-0">
            <Tag className="w-3 h-3" />
            {melhor}
          </span>
        )}
      </div>

      <div className="flex items-stretch gap-2 bg-surface-container-low px-2 py-1 rounded overflow-x-auto no-scrollbar tnum">
        {precos.length === 0 ? (
          <span className="text-outline whitespace-nowrap self-center">Sem cotações</span>
        ) : (
          precos.map(([mercado, preco], idx) => {
            const value = getPrecoValor(preco);
            const microLabel = getMicroLabel(preco);
            const isBest = value > 0 && value === menor;
            return (
              <span
                key={mercado}
                className="flex flex-col items-center justify-center gap-0.5 whitespace-nowrap"
              >
                <span className="flex items-center gap-1">
                  <span className="text-on-surface-variant">{mercado}</span>
                  {value > 0 ? (
                    <span
                      className={
                        isBest
                          ? 'font-bold text-on-secondary-fixed bg-secondary-container/50 px-1 rounded'
                          : 'font-medium text-on-surface'
                      }
                    >
                      {formatBRL(value)}
                    </span>
                  ) : (
                    <span className="text-outline">—</span>
                  )}
                  {idx < precos.length - 1 && (
                    <span className="text-outline text-[10px]">•</span>
                  )}
                </span>
                <span
                  className={`text-[10px] leading-none ${
                    microLabel ? 'text-outline' : 'text-transparent select-none'
                  }`}
                >
                  {microLabel || '\u00A0'}
                </span>
              </span>
            );
          })
        )}
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