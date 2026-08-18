import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react'
import {
  AMENITIES,
  CONDITIONS,
  DOCUMENTATION,
  PROPERTY_TYPES,
} from '../../data/properties'
import { PROVINCE_NAMES } from '../../data/locations'
import { DEFAULT_FILTERS, SORT_OPTIONS, countActiveFilters } from '../../lib/filters'
import { formatAOA } from '../../lib/format'

const LAND_INFRA = [
  { id: 'water', label: 'Água da rede' },
  { id: 'power', label: 'Energia eléctrica' },
  { id: 'pavedAccess', label: 'Acesso asfaltado' },
  { id: 'walled', label: 'Terreno murado' },
]

/** Filtros dinâmicos da página de resultados. */
export default function FilterBar({ filters, setFilters, total }) {
  const isLand = filters.purpose === 'terreno'
  const active = countActiveFilters(filters)

  const patch = (partial) => setFilters((f) => ({ ...f, ...partial }))
  const toggleIn = (key, value) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }))

  return (
    <div className="sticky top-18 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        {/* Finalidade */}
        <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {[
            { id: 'venda', label: 'Comprar' },
            { id: 'aluguer', label: 'Alugar' },
            { id: 'terreno', label: 'Terrenos' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => patch({ purpose: t.id, types: [] })}
              className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${
                filters.purpose === t.id
                  ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-950 dark:text-brand-300'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Dropdown label="Preço" summary={priceSummary(filters)}>
          <div className="grid w-72 gap-3">
            <NumberField
              label="Mínimo (AOA)"
              value={filters.minPrice}
              onChange={(v) => patch({ minPrice: v })}
            />
            <NumberField
              label="Máximo (AOA)"
              value={filters.maxPrice}
              onChange={(v) => patch({ maxPrice: v })}
            />
            <div className="flex flex-wrap gap-1.5">
              {(filters.purpose === 'aluguer'
                ? [300_000, 600_000, 1_200_000, 3_000_000]
                : [20_000_000, 50_000_000, 100_000_000, 250_000_000]
              ).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => patch({ maxPrice: String(v) })}
                  className="chip bg-slate-100 text-xs hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-800 dark:text-slate-200"
                >
                  até {formatAOA(v)}
                </button>
              ))}
            </div>
          </div>
        </Dropdown>

        {!isLand && (
          <Dropdown label="Tipo" summary={filters.types.length ? `${filters.types.length} selec.` : null}>
            <div className="grid w-60 gap-1">
              {PROPERTY_TYPES.filter((t) => t.id !== 'terreno').map((t) => (
                <CheckRow
                  key={t.id}
                  checked={filters.types.includes(t.id)}
                  onChange={() => toggleIn('types', t.id)}
                  label={t.label}
                />
              ))}
            </div>
          </Dropdown>
        )}

        {!isLand && (
          <Dropdown
            label="Quartos / WC"
            summary={
              filters.bedrooms || filters.bathrooms
                ? `T${filters.bedrooms || 0}+ · ${filters.bathrooms || 0}+ wc`
                : null
            }
          >
            <div className="w-64">
              <Stepper
                label="Quartos (mínimo)"
                value={filters.bedrooms}
                onChange={(v) => patch({ bedrooms: v })}
                prefix="T"
              />
              <Stepper
                label="Casas de banho (mínimo)"
                value={filters.bathrooms}
                onChange={(v) => patch({ bathrooms: v })}
              />
            </div>
          </Dropdown>
        )}

        <Dropdown
          label={isLand ? 'Dimensão' : 'Área'}
          summary={filters.minArea || filters.maxArea ? 'definida' : null}
        >
          <div className="grid w-72 gap-3">
            <NumberField
              label="Área mínima (m²)"
              value={filters.minArea}
              onChange={(v) => patch({ minArea: v })}
            />
            <NumberField
              label="Área máxima (m²)"
              value={filters.maxArea}
              onChange={(v) => patch({ maxArea: v })}
            />
            {isLand && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'até 1.000 m²', max: '1000' },
                  { label: '1.000 – 5.000 m²', min: '1000', max: '5000' },
                  { label: '0,5 – 1 ha', min: '5000', max: '10000' },
                  { label: '1 ha ou mais', min: '10000' },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => patch({ minArea: p.min ?? '', maxArea: p.max ?? '' })}
                    className="chip bg-slate-100 text-xs hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Dropdown>

        <Dropdown label="Estado" summary={filters.conditions.length ? `${filters.conditions.length} selec.` : null}>
          <div className="grid w-56 gap-1">
            {CONDITIONS.map((c) => (
              <CheckRow
                key={c.id}
                checked={filters.conditions.includes(c.id)}
                onChange={() => toggleIn('conditions', c.id)}
                label={c.label}
              />
            ))}
          </div>
        </Dropdown>

        <Dropdown
          label="Documentação"
          summary={filters.documentation.length ? `${filters.documentation.length} selec.` : null}
        >
          <div className="grid w-64 gap-1">
            {DOCUMENTATION.map((d) => (
              <CheckRow
                key={d.id}
                checked={filters.documentation.includes(d.id)}
                onChange={() => toggleIn('documentation', d.id)}
                label={d.label}
              />
            ))}
          </div>
        </Dropdown>

        {isLand && (
          <Dropdown
            label="Infra-estruturas"
            summary={
              Object.values(filters.land).filter(Boolean).length
                ? `${Object.values(filters.land).filter(Boolean).length} selec.`
                : null
            }
          >
            <div className="grid w-60 gap-1">
              {LAND_INFRA.map((i) => (
                <CheckRow
                  key={i.id}
                  checked={filters.land[i.id]}
                  onChange={() =>
                    patch({ land: { ...filters.land, [i.id]: !filters.land[i.id] } })
                  }
                  label={i.label}
                />
              ))}
            </div>
          </Dropdown>
        )}

        <Dropdown label="Mais filtros" icon={SlidersHorizontal} summary={filters.amenities.length ? `${filters.amenities.length} extras` : null}>
          <div className="w-80">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Província
            </p>
            <select
              value={filters.province}
              onChange={(e) => patch({ province: e.target.value, zone: '' })}
              className="mb-4 h-10 w-full rounded-lg bg-white px-3 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700"
            >
              <option value="">Todas as províncias</option>
              {PROVINCE_NAMES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Comodidades
            </p>
            <div className="grid max-h-56 grid-cols-1 gap-1 overflow-auto">
              {AMENITIES.map((a) => (
                <CheckRow
                  key={a}
                  checked={filters.amenities.includes(a)}
                  onChange={() => toggleIn('amenities', a)}
                  label={a}
                />
              ))}
            </div>
          </div>
        </Dropdown>

        {active > 0 && (
          <button
            type="button"
            onClick={() => setFilters({ ...DEFAULT_FILTERS, purpose: filters.purpose })}
            className="chip bg-rose-50 text-sm text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <RotateCcw className="size-4" /> Limpar ({active})
          </button>
        )}

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-sm text-slate-500 sm:block dark:text-slate-400">
            <strong className="text-slate-800 dark:text-slate-100">{total}</strong> resultados
          </span>
          <select
            value={filters.sort}
            onChange={(e) => patch({ sort: e.target.value })}
            aria-label="Ordenar resultados"
            className="h-10 w-44 shrink-0 rounded-xl bg-slate-100 px-3 text-sm font-semibold text-slate-700 outline-none transition hover:bg-slate-200 focus:ring-2 focus:ring-brand-500 dark:bg-slate-800 dark:text-slate-200"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function priceSummary(f) {
  if (f.minPrice === '' && f.maxPrice === '') return null
  if (f.minPrice !== '' && f.maxPrice !== '')
    return `${formatAOA(Number(f.minPrice))} – ${formatAOA(Number(f.maxPrice))}`
  if (f.maxPrice !== '') return `até ${formatAOA(Number(f.maxPrice))}`
  return `desde ${formatAOA(Number(f.minPrice))}`
}

function Dropdown({ label, summary, icon: Icon = ChevronDown, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const away = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', esc)
    }
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex h-10 items-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold transition ${
          summary
            ? 'bg-brand-50 text-brand-600 ring-1 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-500/30'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {label}
        {summary && <span className="max-w-32 truncate font-medium opacity-80">· {summary}</span>}
        <Icon className={`size-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-40 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-slate-900/10 animate-[var(--animate-fade-in)] dark:bg-slate-900 dark:ring-white/10">
          {children}
        </div>
      )}
    </div>
  )
}

function CheckRow({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800">
      <span
        className={`grid size-5 shrink-0 place-items-center rounded-md ring-1 transition ${
          checked ? 'bg-brand-500 ring-brand-500' : 'bg-white ring-slate-300 dark:bg-slate-900 dark:ring-slate-600'
        }`}
      >
        {checked && <Check className="size-3.5 text-white" strokeWidth={3} />}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="text-slate-700 dark:text-slate-200">{label}</span>
    </label>
  )
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <input
        type="number"
        min="0"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        className="h-10 w-full rounded-lg bg-white px-3 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700"
      />
    </label>
  )
}

function Stepper({ label, value, onChange, prefix = '' }) {
  return (
    <div className="mb-3">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`h-9 flex-1 rounded-lg text-sm font-semibold transition ${
              value === n
                ? 'bg-brand-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {n === 0 ? 'Todos' : `${prefix}${n}+`}
          </button>
        ))}
      </div>
    </div>
  )
}
