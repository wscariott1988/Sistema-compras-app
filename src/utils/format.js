export const MARKET_KEYS = [
  { key: 'rissul', label: 'Rissul' },
  { key: 'macromix', label: 'Macromix' },
  { key: 'fort', label: 'Fort' },
  { key: 'atacadao', label: 'Atacadão' },
];

export function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function campeaoKey(name = '') {
  return normalize(name).replace(/\s+/g, '');
}

export function formatBRL(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '—';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatDate(value) {
  if (!value) return 'Data não informada';
  const s = String(value).trim();
  let d = null;
  let withTime = false;
  const br = s.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2}))?/);
  if (br) {
    d = new Date(+br[3], +br[2] - 1, +br[1], +(br[4] || 0), +(br[5] || 0));
    withTime = Boolean(br[4]);
  } else if (s.includes('T') || s.includes(':')) {
    d = new Date(s);
    withTime = true;
  } else {
    d = new Date(`${s}T00:00:00`);
  }
  if (Number.isNaN(d.getTime())) return s;
  const opts = { day: '2-digit', month: '2-digit', year: 'numeric' };
  if (withTime) {
    opts.hour = '2-digit';
    opts.minute = '2-digit';
  }
  return d.toLocaleDateString('pt-BR', opts);
}

export function toDanfeUrl(input = '') {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 44) {
    return `https://www.sefaz.rs.gov.br/NFE/NFE-QRCode.aspx?chave=${digits}`;
  }
  return null;
}

export function shrink(text, max = 44) {
  const s = String(text);
  return s.length > max ? `${s.slice(0, max - 3)}...` : s;
}