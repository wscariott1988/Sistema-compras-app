import { useMemo, useState } from 'react';
import { Search, Check, Eraser, Inbox } from 'lucide-react';
import ChampionHeader from './ChampionHeader';
import ItemCard from './ItemCard';
import { normalize } from '../utils/format';

export default function ListaTab({ data, loading, syncing, onSync, onToggle, onUncheckAll }) {
  const [search, setSearch] = useState('');
  const [onlyChecked, setOnlyChecked] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const itens = data.itens || [];
  const checkedCount = itens.filter((i) => i.comprar).length;

  const filtered = useMemo(() => {
    const term = normalize(search);
    return itens.filter((item) => {
      const matchesSearch = !term || normalize(item.categoria).includes(term);
      const matchesChecked = !onlyChecked || item.comprar;
      return matchesSearch && matchesChecked;
    });
  }, [itens, search, onlyChecked]);

  const handleUncheckAll = () => {
    if (!confirming) {
      setConfirming(true);
      window.setTimeout(() => setConfirming(false), 3500);
      return;
    }
    setConfirming(false);
    onUncheckAll();
  };

  return (
    <>
      <div className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md shadow-[0_1px_12px_rgba(15,23,42,0.04)] pt-safe">
        <div className="px-gutter pt-2.5">
          <ChampionHeader data={data} syncing={syncing} onSync={onSync} />
        </div>
        <div className="flex flex-col gap-2 px-gutter pb-2 pt-2">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3.5 text-outline w-5 h-5 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar categoria na lista..."
              type="text"
              className="w-full h-10 pl-10 pr-4 bg-surface-container-lowest text-on-surface placeholder:text-outline text-body-md rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow"
            />
          </div>
          <div className="flex items-center justify-between gap-2 px-0.5">
            <button
              type="button"
              onClick={() => setOnlyChecked((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-sm transition-colors ${
                onlyChecked
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${onlyChecked ? 'opacity-100' : 'opacity-60'}`} />
              <span className="text-label-sm font-medium">Apenas Marcados</span>
              <span className="px-1.5 py-0.5 rounded-full bg-primary-container/10 text-primary text-label-sm font-bold">
                ({checkedCount})
              </span>
            </button>
            <button
              type="button"
              onClick={handleUncheckAll}
              className={`text-label-sm transition-colors flex items-center gap-1 py-0.5 ${
                confirming ? 'text-error font-bold' : 'text-outline hover:text-error'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              {confirming ? 'Confirmar?' : 'Desmarcar Todos'}
            </button>
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-2 px-gutter py-2 pb-6">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-lg p-2.5 shadow-sm flex flex-col gap-2 animate-pulse"
            >
              <div className="h-4 w-2/3 bg-surface-container rounded" />
              <div className="h-8 w-full bg-surface-container-low rounded" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 text-on-surface-variant">
            <Inbox className="w-10 h-10 text-outline" />
            <p className="text-body-md">
              {itens.length === 0
                ? 'Nenhum item encontrado na lista.'
                : 'Nenhum item corresponde aos filtros.'}
            </p>
          </div>
        ) : (
          filtered.map((item) => <ItemCard key={item.linha} item={item} onToggle={onToggle} />)
        )}
      </main>
    </>
  );
}