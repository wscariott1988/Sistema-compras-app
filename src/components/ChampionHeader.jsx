import { Trophy, TrendingDown, Store, RefreshCw } from 'lucide-react';
import { MARKET_KEYS, campeaoKey, formatBRL } from '../utils/format';

function resolveMarket(campeao) {
  const norm = campeaoKey(campeao);
  if (!norm) return null;
  const exact = MARKET_KEYS.find((m) => m.key === norm);
  if (exact) return exact;
  const contained = MARKET_KEYS.find((m) => norm.includes(m.key));
  if (contained) return contained;
  return MARKET_KEYS.find((m) => m.key.includes(norm)) || null;
}

export default function ChampionHeader({ data, syncing, onSync }) {
  const itens = data.itens || [];
  const market = resolveMarket(data.campeao);

  let totalCampeao = 0;
  let totalMaisCaro = 0;
  let totalMinimo = 0;
  itens.forEach((item) => {
    if (market) {
      const jacote = Number(item[market.key]);
      if (Number.isFinite(jacote)) totalCampeao += jacote;
    }
    const prices = MARKET_KEYS.map((m) => Number(item[m.key])).filter(Number.isFinite);
    if (prices.length) {
      totalMaisCaro += Math.max(...prices);
      totalMinimo += Math.min(...prices);
    }
  });
  if (!market) totalCampeao = totalMinimo;

  const economia = totalMaisCaro - totalCampeao;
  const resumo =
    data.resumoCustos ||
    (economia > 0
      ? `Economia de ${formatBRL(economia)} em relação ao mais caro`
      : 'Preços comparados na última cotação');

  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary-container to-tertiary p-space-md shadow-lg text-on-primary">
      <div className="absolute -right-8 -bottom-10 w-36 h-36 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-6 -top-6 w-24 h-24 bg-primary-fixed/15 rounded-full blur-xl pointer-events-none" />
      <div className="relative z-10 flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/20 backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5" />
            <span className="text-label-sm tracking-wide uppercase">Mercado Campeão</span>
          </div>
          <button
            type="button"
            aria-label="Atualizar cotações"
            onClick={onSync}
            disabled={syncing}
            className="w-8 h-8 rounded-full bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-90 disabled:opacity-70"
          >
            <RefreshCw className={`w-4 h-4 transition-transform ${syncing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-end justify-between gap-space-sm mt-0.5">
          <div className="min-w-0">
            <p className="text-label-md text-on-primary/80 font-medium">Cesta Completa</p>
            <h2 className="text-headline-lg-mobile tracking-tight truncate">{data.campeao || '—'}</h2>
          </div>
          <div className="text-right shrink-0">
            <span className="block text-price-hero leading-tight tnum">{formatBRL(totalCampeao)}</span>
            <span className="text-body-sm text-on-primary/75">Melhor cotação total</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container w-fit shadow-sm">
            <TrendingDown className="w-3.5 h-3.5" />
            <span className="text-label-md font-semibold">{resumo}</span>
          </div>
          <div className="flex items-center gap-1.5 text-on-primary/85 min-w-0">
            <Store className="w-4 h-4 shrink-0" />
            <span className="text-body-sm">4 redes: Rissul, Macromix, Fort, Atacadão</span>
          </div>
        </div>
      </div>
    </section>
  );
}