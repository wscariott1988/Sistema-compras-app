import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import * as api from './services/api';
import BottomNav from './components/BottomNav';
import ListaTab from './components/ListaTab';
import Fila from './components/Fila';
import Toast from './components/Toast';

const BiparNota = lazy(() => import('./components/BiparNota'));

const CACHE_KEY = 'SMART_MARKET_CACHE';

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && Array.isArray(parsed.itens) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    return;
  }
}

function FallbackScreen() {
  return (
    <div className="min-h-dvh bg-surface flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-surface-container-high border-t-primary animate-spin" />
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('lista');
  const [data, setData] = useState({ campeao: '', resumoCustos: '', itens: [], fila: [] });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  }, []);

  const loadData = useCallback(
    async (opts = {}) => {
      const cached = opts.hasCache;
      if (!opts.silent && !cached) setLoading(true);
      setSyncing(true);
      try {
        const d = await api.fetchData();
        setData(d);
        writeCache(d);
        return d;
      } catch {
        if (!cached) {
          showToast('Falha ao consultar a API. Verifique a conexão.', 'error');
        }
        return null;
      } finally {
        setLoading(false);
        setSyncing(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setData(cached);
      setLoading(false);
      loadData({ silent: true, hasCache: true });
    } else {
      loadData({ silent: false, hasCache: false });
    }
  }, [loadData]);

  const handleSync = useCallback(async () => {
    setSyncing(true);
    await loadData({ silent: true });
  }, [loadData]);

  const toggleItem = useCallback(
    async (linha, comprar) => {
      const previous = data.itens.find((i) => i.linha === linha);
      setData((prev) => ({
        ...prev,
        itens: prev.itens.map((i) => (i.linha === linha ? { ...i, comprar } : i)),
      }));
      try {
        await api.toggleItem(linha, comprar);
      } catch {
        setData((prev) => ({
          ...prev,
          itens: prev.itens.map((i) => (i.linha === linha ? { ...previous } : i)),
        }));
        showToast('Falha ao atualizar o item. Alteração revertida.', 'error');
      }
    },
    [data.itens, showToast]
  );

  const uncheckAll = useCallback(async () => {
    const previousItens = data.itens;
    setData((prev) => ({
      ...prev,
      itens: prev.itens.map((i) => ({ ...i, comprar: false })),
    }));
    try {
      await api.desmarcarTodos();
      showToast('Todos os itens foram desmarcados.');
    } catch {
      setData((prev) => ({ ...prev, itens: previousItens }));
      showToast('Falha ao desmarcar itens. Alteração revertida.', 'error');
    }
  }, [data.itens, showToast]);

  const handleBiparNota = useCallback(
    async (url) => {
      try {
        await api.biparNota(url);
        showToast('Nota fiscal enviada para a fila!');
        setTab('fila');
        loadData({ silent: true });
        return true;
      } catch {
        showToast('Falha ao enviar a nota fiscal.', 'error');
        return false;
      }
    },
    [showToast, loadData]
  );

  return (
    <div className="min-h-dvh bg-surface text-on-surface font-sans antialiased">
      {tab === 'lista' && (
        <ListaTab
          data={data}
          loading={loading}
          syncing={syncing}
          onSync={handleSync}
          onToggle={toggleItem}
          onUncheckAll={uncheckAll}
        />
      )}
      {tab === 'bipar-nota' && (
        <Suspense fallback={<FallbackScreen />}>
          <BiparNota
            onScan={handleBiparNota}
            showToast={showToast}
            onSync={handleSync}
            syncing={syncing}
          />
        </Suspense>
      )}
      {tab === 'fila' && (
        <Fila
          data={data}
          loading={loading}
          syncing={syncing}
          onSync={handleSync}
          showToast={showToast}
        />
      )}
      <BottomNav tab={tab} onTabChange={setTab} />
      <Toast toasts={toasts} />
    </div>
  );
}