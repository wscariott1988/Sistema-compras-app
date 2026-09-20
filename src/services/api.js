import { API_URL } from '../config';
import { formatarNomeMercado } from '../utils/format';

function normalizeData(json = {}) {
  const itens = Array.isArray(json.itens)
    ? json.itens.map((item) =>
        item.mercadoMaisBarato
          ? { ...item, mercadoMaisBarato: formatarNomeMercado(item.mercadoMaisBarato) }
          : item
      )
    : [];
  return {
    campeao: formatarNomeMercado(json.campeao),
    resumoCustos: json.resumoCustos || '',
    itens,
    fila: Array.isArray(json.fila) ? json.fila : [],
  };
}

export async function fetchData() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Falha ao consultar a API (HTTP ${res.status})`);
  }
  const json = await res.json();
  return normalizeData(json);
}

function postAction(payload) {
  return fetch(API_URL, {
    method: 'POST',
    mode: 'no-cors',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
}

export const toggleItem = (linha, comprar) =>
  postAction({ action: 'toggleItem', linha, comprar });

export const biparNota = (url) => postAction({ action: 'biparNota', url });

export const desmarcarTodos = () => postAction({ action: 'desmarcarTodos' });