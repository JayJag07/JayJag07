import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { List, Map as MapIcon, SearchX } from 'lucide-react'
import FilterBar from '../components/search/FilterBar'
import LocationAutocomplete from '../components/search/LocationAutocomplete'
import PropertyCard from '../components/property/PropertyCard'
import PropertyMap from '../components/map/PropertyMap'
import Button from '../components/ui/Button'
import { PROPERTIES } from '../data/properties'
import { DEFAULT_FILTERS, applyFilters, filtersToParams, paramsToFilters } from '../lib/filters'
import { useMediaQuery } from '../hooks/useMediaQuery'

const TITLES = {
  venda: 'Imóveis à venda',
  aluguer: 'Imóveis para arrendar',
  terreno: 'Terrenos disponíveis',
}

/** Página de busca imersiva: lista à esquerda, mapa interactivo à direita. */
export default function Search() {
  const [params, setParams] = useSearchParams()
  const [filters, setFilters] = useState(() => paramsToFilters(params))
  const [activeId, setActiveId] = useState(null)
  const [mobileView, setMobileView] = useState('lista')
  const [queryText, setQueryText] = useState(
    () => paramsToFilters(params).zone || paramsToFilters(params).province || paramsToFilters(params).query,
  )
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  // Mantém o URL sincronizado com os filtros (links partilháveis).
  useEffect(() => {
    setParams(filtersToParams(filters), { replace: true })
  }, [filters, setParams])

  const results = useMemo(() => applyFilters(PROPERTIES, filters), [filters])

  useEffect(() => {
    document.title = `${TITLES[filters.purpose] ?? 'Pesquisa'} — JETCASA`
  }, [filters.purpose])

  const onSelectLocation = (item) => {
    setFilters((f) => ({ ...f, province: item.province, zone: item.zone ?? '', query: '' }))
  }

  const showList = isDesktop || mobileView === 'lista'
  const showMap = isDesktop || mobileView === 'mapa'

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] flex-col">
      <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex gap-2">
          <LocationAutocomplete
            value={queryText}
            onChange={(v) => {
              setQueryText(v)
              if (!v) setFilters((f) => ({ ...f, province: '', zone: '', query: '' }))
            }}
            onSelect={onSelectLocation}
            onSubmit={() => setFilters((f) => ({ ...f, query: queryText, province: '', zone: '' }))}
            placeholder="Pesquisar por província, município ou centralidade"
          />
        </div>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} total={results.length} />

      {/* Alternância lista/mapa no telemóvel */}
      <div className="sticky top-32 z-20 flex justify-center py-3 lg:hidden">
        <div className="flex rounded-full bg-slate-900 p-1 shadow-lg">
          {[
            { id: 'lista', label: 'Lista', icon: List },
            { id: 'mapa', label: 'Mapa', icon: MapIcon },
          ].map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setMobileView(v.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition ${
                mobileView === v.id ? 'bg-white text-slate-900' : 'text-white/80'
              }`}
            >
              <v.icon className="size-4" />
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* No desktop a área de resultados tem altura fixa: a lista faz scroll
          por dentro e o mapa acompanha, à maneira do Zillow. */}
      <div className="flex flex-1 lg:h-[calc(100vh-13.5rem)] lg:flex-none lg:overflow-hidden">
        {showList && (
          <div className="scroll-slim w-full px-4 pb-12 lg:h-full lg:w-[58%] lg:overflow-y-auto lg:px-5">
            <div className="flex items-baseline justify-between py-4">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {TITLES[filters.purpose] ?? 'Resultados'}
                {filters.zone && <span className="text-brand-500"> em {filters.zone}</span>}
                {!filters.zone && filters.province && (
                  <span className="text-brand-500"> em {filters.province}</span>
                )}
              </h1>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {results.length} {results.length === 1 ? 'imóvel' : 'imóveis'}
              </span>
            </div>

            {results.length === 0 ? (
              <div className="card mt-6 p-10 text-center">
                <SearchX className="mx-auto size-12 text-slate-300" />
                <p className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  Sem resultados para estes filtros
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                  Experimente alargar a faixa de preço, remover filtros de documentação ou
                  procurar numa província vizinha.
                </p>
                <Button
                  className="mt-6"
                  onClick={() => {
                    setFilters({ ...DEFAULT_FILTERS, purpose: filters.purpose })
                    setQueryText('')
                  }}
                >
                  Limpar todos os filtros
                </Button>
              </div>
            ) : (
              <div className="grid gap-5 pb-8 sm:grid-cols-2">
                {results.map((p) => (
                  <PropertyCard key={p.id} property={p} onHover={setActiveId} />
                ))}
              </div>
            )}
          </div>
        )}

        {showMap && (
          <div className="h-[70vh] w-full lg:h-full lg:w-[42%]">
            <PropertyMap
              properties={results}
              activeId={activeId}
              onMarkerHover={setActiveId}
            />
          </div>
        )}
      </div>
    </div>
  )
}
