import { useMemo, useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ReceiptText,
  Download,
  ArrowRight,
  Inbox,
  BadgeCheck,
} from 'lucide-react';
import { normalize, formatDate, shrink } from '../utils/format';

function statusMeta(status = '') {
  const raw = String(status || '');
  let text = raw;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      text = parsed.msg || parsed.message || parsed.status || raw;
    }
  } catch {
    /* not json, use raw */
  }
  const s = normalize(text);
  if (s.includes('existe') || s.includes('duplic')) {
    return {
      key: 'Erro',
      label: 'Duplicada',
      dot: 'bg-orange-400',
      chip: 'bg-orange-100 text-orange-700',
      icon: AlertTriangle,
      detail: text,
    };
  }
  if (s.includes('pend') || s.includes('anal') || s.includes('valid') || s.includes('aguard')) {
    return {
      key: 'Pendente',
      label: 'Em Análise',
      dot: 'bg-amber-400',
      chip: 'bg-amber-100 text-amber-800',
      icon: Clock,
      detail: text,
    };
  }
  if (s.includes('erro') || s.includes('alert') || s.includes('fail') || s.includes('error')) {
    return {
      key: 'Erro',
      label: 'Com Alerta',
      dot: 'bg-red-400',
      chip: 'bg-red-100 text-red-700',
      icon: AlertTriangle,
      detail: text,
    };
  }
  return {
    key: 'Processado',
    label: 'Processado',
    dot: 'bg-secondary-container',
    chip: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle2,
    detail: text,
  };
}

function isToday(value) {
  if (!value) return false;
  const d = new Date(String(value).includes('T') ? value : `${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function Fila({ data, loading, syncing, onSync, showToast }) {
  const [filter, setFilter] = useState('all');

  const fila = data.fila || [];

  const stats = useMemo(() => {
    const counts = { Processado: 0, Pendente: 0, Erro: 0 };
    let today = 0;
    fila.forEach((f) => {
      const meta = statusMeta(f.status);
      counts[meta.key] += 1;
      if (isToday(f.data)) today += 1;
    });
    return { total: fila.length, today, ...counts };
  }, [fila]);

  const filtered = useMemo(() => {
    if (filter === 'all') return fila;
    return fila.filter((f) => statusMeta(f.status).key === filter);
  }, [fila, filter]);

  const chips = [
    { key: 'all', label: `Todas (${stats.total})` },
    { key: 'Processado', label: `Processadas (${stats.Processado})` },
    { key: 'Pendente', label: `Em Análise (${stats.Pendente})` },
    { key: 'Erro', label: `Com Alerta (${stats.Erro})` },
  ];

  const exportCsv = () => {
    if (!fila.length) {
      showToast('Nenhuma nota fiscal para exportar.', 'error');
      return;
    }
    const header = 'id,data,url,status';
    const rows = fila.map((f) =>
      [`"${f.id}"`, `"${f.data}"`, `"${f.url}"`, `"${f.status}"`].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `smart-market-fila-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast(`Exportando ${fila.length} notas fiscais em .CSV`);
  };

  return (
    <div className="min-h-dvh bg-surface pb-24 pt-safe">
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl pt-safe shadow-[0_1px_12px_rgba(15,23,42,0.04)]">
        <div className="h-16 px-gutter flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
              <ReceiptText className="w-[22px] h-[22px]" />
            </div>
            <h1 className="text-headline-sm font-semibold tracking-tight">Fila</h1>
          </div>
          <button
            type="button"
            aria-label="Sincronizar"
            onClick={onSync}
            className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <RefreshCw className={`w-[22px] h-[22px] ${syncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full px-gutter pt-[88px] pb-4">
        <div className="flex flex-col w-full gap-space-lg">
          <section className="relative overflow-hidden rounded-xl bg-primary text-on-primary shadow-md p-space-lg">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-primary-container opacity-40 pointer-events-none blur-xl" />
            <div className="relative z-10 flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <RefreshCw className="w-5 h-5 text-primary-fixed" />
                  <span className="text-label-md tracking-wide uppercase text-primary-fixed font-semibold">
                    Monitor de Sincronia
                  </span>
                </div>
                <span className="text-label-sm px-space-sm py-0.5 rounded-full bg-surface-container-lowest/15 text-primary-fixed">
                  SEFAZ Online
                </span>
              </div>
              <div className="grid grid-cols-2 gap-space-md pt-space-xs">
                <div className="flex flex-col">
                  <span className="text-label-sm text-surface-container-highest opacity-90">
                    Fila de Notas
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-headline-lg-mobile font-bold tnum">{stats.total}</span>
                    <span className="text-body-sm text-surface-container-highest">na fila</span>
                  </div>
                  <span className="text-body-sm text-secondary-fixed mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-ping" />
                    {stats.Pendente} em validação SEFAZ
                  </span>
                </div>
                <div className="flex flex-col pl-space-sm">
                  <span className="text-label-sm text-surface-container-highest opacity-90">
                    Enviadas Hoje
                  </span>
                  <div className="flex items-baseline gap-0.5 mt-0.5">
                    <span className="text-price-hero text-on-primary tnum">{stats.today}</span>
                  </div>
                  <span className="text-body-sm text-surface-container-highest mt-1 flex items-center gap-0.5">
                    <BadgeCheck className="w-[15px] h-[15px] text-primary-fixed" />
                    {stats.Processado} processadas
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 -mx-gutter px-gutter no-scrollbar">
            {chips.map((c) => {
              const active = filter === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setFilter(c.key)}
                  className={`px-space-md py-1.5 rounded-full text-label-md whitespace-nowrap transition-all ${
                    active
                      ? 'bg-primary text-on-primary font-semibold shadow-sm'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex flex-col gap-space-sm">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-surface-container-lowest p-space-md shadow-card animate-pulse flex flex-col gap-2"
                >
                  <div className="h-4 w-1/2 bg-surface-container rounded" />
                  <div className="h-3 w-3/4 bg-surface-container-low rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-14 text-on-surface-variant">
              <Inbox className="w-10 h-10 text-outline" />
              <p className="text-body-md">Nenhuma nota fiscal neste filtro.</p>
            </div>
          ) : (
            <section className="flex flex-col gap-space-sm">
              {filtered.map((f) => {
                const meta = statusMeta(f.status);
                const StatusIcon = meta.icon;
                return (
                  <article
                    key={f.id}
                    className="rounded-xl bg-surface-container-lowest p-space-md shadow-card flex flex-col gap-space-md"
                  >
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="flex items-center gap-space-md min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                          <ReceiptText className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-space-xs">
                            <h3 className="text-label-lg font-semibold text-on-surface truncate">
                              Nota #{f.id}
                            </h3>
                            {meta.dot && (
                              <span className={`w-2 h-2 rounded-full ${meta.dot} shrink-0`} />
                            )}
                          </div>
                          <p className="text-body-sm text-on-surface-variant">
                            {formatDate(f.data)}
                          </p>
                          {meta.detail && meta.detail !== meta.label && (
                            <p className="text-body-sm text-on-surface-variant truncate">
                              {meta.detail}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        title={meta.detail && meta.detail !== meta.label ? meta.detail : undefined}
                        className={`inline-flex items-center gap-1 text-label-sm px-2 py-0.5 rounded-full font-semibold shrink-0 ${meta.chip}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {meta.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-0.5 gap-space-sm">
                      <p className="text-body-sm text-on-surface-variant font-mono truncate min-w-0 flex-1">
                        {shrink(f.url, 42)}
                      </p>
                      {f.url && (
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-label-md font-semibold flex items-center gap-1 transition-colors shrink-0"
                        >
                          <span>Ver Nota</span>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          )}

          <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
            <button
              type="button"
              onClick={onSync}
              disabled={syncing}
              className="h-12 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-label-lg flex items-center justify-center gap-space-xs shadow-md active:scale-95 transition-all disabled:opacity-70"
            >
              <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Buscando...' : 'Sincronizar Agora'}
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="h-12 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-primary text-label-lg flex items-center justify-center gap-space-xs shadow-sm active:scale-95 transition-all"
            >
              <Download className="w-5 h-5" />
              Exportar CSV
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}