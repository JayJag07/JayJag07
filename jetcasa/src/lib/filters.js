import { normalize } from './format'

/** Estado inicial dos filtros de pesquisa. */
export const DEFAULT_FILTERS = {
  purpose: 'venda',        // venda | aluguer | terreno
  query: '',
  province: '',
  zone: '',
  types: [],               // ids de PROPERTY_TYPES
  minPrice: '',
  maxPrice: '',
  bedrooms: 0,             // mínimo
  bathrooms: 0,            // mínimo
  minArea: '',
  maxArea: '',
  conditions: [],          // novo | usado | construcao
  documentation: [],       // registo | superficie | titulo | pendente
  amenities: [],
  land: { water: false, power: false, pavedAccess: false, walled: false },
  sort: 'relevancia',
}

export const SORT_OPTIONS = [
  { id: 'relevancia', label: 'Relevância' },
  { id: 'recentes', label: 'Mais recentes' },
  { id: 'preco-asc', label: 'Preço: menor primeiro' },
  { id: 'preco-desc', label: 'Preço: maior primeiro' },
  { id: 'area-desc', label: 'Maior área' },
]

const num = (v) => (v === '' || v == null ? null : Number(v))

/** Aplica todos os filtros activos a uma lista de imóveis. */
export function applyFilters(properties, filters) {
  const f = { ...DEFAULT_FILTERS, ...filters }
  const q = normalize(f.query)

  const result = properties.filter((p) => {
    // Finalidade: "terreno" é um separador próprio na barra de pesquisa.
    if (f.purpose === 'terreno') {
      if (p.type !== 'terreno') return false
    } else if (f.purpose && p.purpose !== f.purpose) {
      return false
    }

    if (f.province && p.province !== f.province) return false
    if (f.zone && p.zone !== f.zone) return false

    if (q) {
      const haystack = normalize(
        [p.title, p.zone, p.province, p.address, p.description].join(' '),
      )
      if (!haystack.includes(q)) return false
    }

    if (f.types.length && !f.types.includes(p.type)) return false

    const min = num(f.minPrice)
    const max = num(f.maxPrice)
    if (min != null && p.price < min) return false
    if (max != null && p.price > max) return false

    if (f.bedrooms && (p.bedrooms ?? 0) < f.bedrooms) return false
    if (f.bathrooms && (p.bathrooms ?? 0) < f.bathrooms) return false

    const minA = num(f.minArea)
    const maxA = num(f.maxArea)
    if (minA != null && p.area < minA) return false
    if (maxA != null && p.area > maxA) return false

    if (f.conditions.length && !f.conditions.includes(p.condition)) return false
    if (f.documentation.length && !f.documentation.includes(p.documentation)) return false

    if (f.amenities.length && !f.amenities.every((a) => p.amenities?.includes(a))) return false

    // Infra-estruturas — só se aplicam a terrenos.
    const landKeys = Object.keys(f.land).filter((k) => f.land[k])
    if (landKeys.length) {
      if (p.type !== 'terreno') return false
      if (!landKeys.every((k) => p.land?.[k])) return false
    }

    return true
  })

  return sortProperties(result, f.sort)
}

export function sortProperties(list, sort) {
  const arr = [...list]
  switch (sort) {
    case 'recentes':
      return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'preco-asc':
      return arr.sort((a, b) => a.price - b.price)
    case 'preco-desc':
      return arr.sort((a, b) => b.price - a.price)
    case 'area-desc':
      return arr.sort((a, b) => b.area - a.area)
    default:
      // Relevância: destaques e verificados primeiro, depois os mais recentes.
      return arr.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          Number(b.verified) - Number(a.verified) ||
          new Date(b.createdAt) - new Date(a.createdAt),
      )
  }
}

/** Quantos filtros (para além da finalidade) estão activos. */
export function countActiveFilters(f) {
  let n = 0
  if (f.province) n++
  if (f.zone) n++
  if (f.types.length) n += f.types.length
  if (f.minPrice !== '' || f.maxPrice !== '') n++
  if (f.bedrooms) n++
  if (f.bathrooms) n++
  if (f.minArea !== '' || f.maxArea !== '') n++
  n += f.conditions.length + f.documentation.length + f.amenities.length
  n += Object.values(f.land).filter(Boolean).length
  return n
}

/** Serializa/lê os filtros na query string, para links partilháveis. */
export function filtersToParams(filters) {
  const p = new URLSearchParams()
  const f = { ...DEFAULT_FILTERS, ...filters }
  if (f.purpose !== DEFAULT_FILTERS.purpose) p.set('fim', f.purpose)
  if (f.query) p.set('q', f.query)
  if (f.province) p.set('prov', f.province)
  if (f.zone) p.set('zona', f.zone)
  if (f.types.length) p.set('tipo', f.types.join(','))
  if (f.minPrice !== '') p.set('min', f.minPrice)
  if (f.maxPrice !== '') p.set('max', f.maxPrice)
  if (f.bedrooms) p.set('q_min', String(f.bedrooms))
  if (f.bathrooms) p.set('wc_min', String(f.bathrooms))
  if (f.minArea !== '') p.set('area_min', f.minArea)
  if (f.maxArea !== '') p.set('area_max', f.maxArea)
  if (f.conditions.length) p.set('estado', f.conditions.join(','))
  if (f.documentation.length) p.set('doc', f.documentation.join(','))
  if (f.amenities.length) p.set('extras', f.amenities.join(','))
  const infra = Object.keys(f.land).filter((k) => f.land[k])
  if (infra.length) p.set('infra', infra.join(','))
  if (f.sort !== DEFAULT_FILTERS.sort) p.set('ord', f.sort)
  return p
}

export function paramsToFilters(params) {
  const list = (key) => {
    const v = params.get(key)
    return v ? v.split(',').filter(Boolean) : []
  }
  const infra = list('infra')
  return {
    ...DEFAULT_FILTERS,
    purpose: params.get('fim') || DEFAULT_FILTERS.purpose,
    query: params.get('q') || '',
    province: params.get('prov') || '',
    zone: params.get('zona') || '',
    types: list('tipo'),
    minPrice: params.get('min') ?? '',
    maxPrice: params.get('max') ?? '',
    bedrooms: Number(params.get('q_min') || 0),
    bathrooms: Number(params.get('wc_min') || 0),
    minArea: params.get('area_min') ?? '',
    maxArea: params.get('area_max') ?? '',
    conditions: list('estado'),
    documentation: list('doc'),
    amenities: list('extras'),
    land: {
      water: infra.includes('water'),
      power: infra.includes('power'),
      pavedAccess: infra.includes('pavedAccess'),
      walled: infra.includes('walled'),
    },
    sort: params.get('ord') || DEFAULT_FILTERS.sort,
  }
}
