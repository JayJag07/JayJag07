import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import LocationAutocomplete from './LocationAutocomplete'
import Button from '../ui/Button'
import { PROPERTY_TYPES } from '../../data/properties'
import { DEFAULT_FILTERS, filtersToParams } from '../../lib/filters'
import { formatNumber } from '../../lib/format'

const TABS = [
  { id: 'venda', label: 'Comprar' },
  { id: 'aluguer', label: 'Alugar' },
  { id: 'terreno', label: 'Terrenos' },
]

const PRICE_STEPS = [5_000_000, 15_000_000, 30_000_000, 60_000_000, 120_000_000, 250_000_000, 500_000_000]
const RENT_STEPS = [150_000, 300_000, 500_000, 800_000, 1_500_000, 3_000_000, 6_000_000]

/** Barra de pesquisa central da homepage, com separadores e filtros rápidos. */
export default function SearchBar({ variant = 'hero' }) {
  const navigate = useNavigate()
  const [purpose, setPurpose] = useState('venda')
  const [query, setQuery] = useState('')
  const [province, setProvince] = useState('')
  const [zone, setZone] = useState('')
  const [type, setType] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [bedrooms, setBedrooms] = useState(0)
  const [showQuick, setShowQuick] = useState(false)

  const steps = purpose === 'aluguer' ? RENT_STEPS : PRICE_STEPS
  const isLand = purpose === 'terreno'

  const submit = (e) => {
    e?.preventDefault()
    const params = filtersToParams({
      ...DEFAULT_FILTERS,
      purpose,
      // Se o utilizador escolheu uma sugestão, filtramos por província/zona;
      // caso contrário fica como pesquisa livre de texto.
      province,
      zone,
      query: province ? '' : query,
      types: type ? [type] : [],
      maxPrice: maxPrice || '',
      bedrooms,
    })
    navigate(`/pesquisar?${params.toString()}`)
  }

  const onSelectLocation = (item) => {
    setProvince(item.province)
    setZone(item.zone ?? '')
  }

  return (
    <form
      onSubmit={submit}
      className={
        variant === 'hero'
          ? 'w-full rounded-2xl bg-white/95 p-3 shadow-2xl ring-1 ring-white/40 backdrop-blur-xl sm:p-4 dark:bg-slate-900/90 dark:ring-white/10'
          : 'w-full rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800'
      }
    >
      <div className="flex gap-1 border-b border-slate-200 pb-3 dark:border-slate-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setPurpose(t.id)
              setMaxPrice('')
              if (t.id === 'terreno') setType('')
            }}
            aria-pressed={purpose === t.id}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
              purpose === t.id
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <LocationAutocomplete
          value={query}
          onChange={(v) => {
            setQuery(v)
            if (!v) {
              setProvince('')
              setZone('')
            }
          }}
          onSelect={onSelectLocation}
          onSubmit={submit}
        />
        <button
          type="button"
          onClick={() => setShowQuick((v) => !v)}
          aria-expanded={showQuick}
          className="flex h-13 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 sm:w-auto dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <SlidersHorizontal className="size-5" />
          Filtros
        </button>
        <Button type="submit" size="lg" icon={Search} className="sm:px-8">
          Pesquisar
        </Button>
      </div>

      {showQuick && (
        <div className="mt-3 grid gap-3 rounded-xl bg-slate-50 p-3 animate-[var(--animate-fade-in)] sm:grid-cols-3 dark:bg-slate-800/60">
          <Field label={isLand ? 'Preço máximo (AOA)' : purpose === 'aluguer' ? 'Renda máxima (AOA/mês)' : 'Preço máximo (AOA)'}>
            <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={selectCls}>
              <option value="">Sem limite</option>
              {steps.map((s) => (
                <option key={s} value={s}>
                  até {formatNumber(s)} AOA
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tipo de imóvel">
            <select
              value={isLand ? 'terreno' : type}
              disabled={isLand}
              onChange={(e) => setType(e.target.value)}
              className={selectCls}
            >
              <option value="">Todos os tipos</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Tipologia">
            <select
              value={bedrooms}
              disabled={isLand}
              onChange={(e) => setBedrooms(Number(e.target.value))}
              className={selectCls}
            >
              <option value={0}>Qualquer</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  T{n}{n === 5 ? '+' : ' ou mais'}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}
    </form>
  )
}

const selectCls =
  'h-11 w-full rounded-lg border-0 bg-white px-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200 outline-none transition focus:ring-2 focus:ring-brand-500 disabled:opacity-50 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      {children}
    </label>
  )
}
