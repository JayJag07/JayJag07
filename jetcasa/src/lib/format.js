/** Formatação de valores para o mercado angolano (Kwanza). */

// pt-BR usa o ponto como separador de milhares — o formato pedido para o
// Kwanza: 150.000.000 AOA.
const nf = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0, useGrouping: 'always' })

/** 150000000 -> "150.000.000" (sem sufixo de moeda). */
export function formatNumber(value) {
  return nf.format(Math.round(Number(value) || 0))
}

/** 150000000 -> "150.000.000 AOA" */
export function formatAOA(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return `${nf.format(Math.round(value))} AOA`
}

/** Versão curta para marcadores do mapa: "150 M", "850 mil". */
export function formatAOAShort(value) {
  if (value == null || Number.isNaN(value)) return '—'
  if (value >= 1_000_000_000) return `${round(value / 1_000_000_000)} MM`
  if (value >= 1_000_000) return `${round(value / 1_000_000)} M`
  if (value >= 1_000) return `${round(value / 1_000)} mil`
  return nf.format(value)
}

function round(n) {
  return nf.format(Number(n.toFixed(n < 10 ? 1 : 0)))
}

/** 250 -> "250 m²" */
export function formatArea(m2) {
  if (m2 == null) return '—'
  if (m2 >= 10_000) return `${nf.format(m2 / 10_000)} ha`
  return `${nf.format(m2)} m²`
}

/** Preço por m² — útil na comparação de terrenos. */
export function pricePerM2(price, area) {
  if (!price || !area) return null
  return price / area
}

export function formatDateShort(iso) {
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

/** "há 3 dias" a partir de uma data ISO. */
export function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'hoje'
  if (days === 1) return 'há 1 dia'
  if (days < 30) return `há ${days} dias`
  const months = Math.floor(days / 30)
  return months === 1 ? 'há 1 mês' : `há ${months} meses`
}

/** Remove acentos e normaliza para comparação de texto. */
export function normalize(text = '') {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
