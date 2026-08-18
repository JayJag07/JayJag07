import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PropertyCard from '../property/PropertyCard'

/** Carrossel horizontal de imóveis em destaque. */
export default function FeaturedCarousel({ title, subtitle, properties, seeAllTo }) {
  const trackRef = useRef(null)

  const scrollBy = (dir) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: dir * (track.clientWidth * 0.8), behavior: 'smooth' })
  }

  if (!properties.length) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {seeAllTo && (
            <Link
              to={seeAllTo}
              className="rounded-xl px-3 py-2 text-sm font-bold text-brand-600 transition hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-slate-800"
            >
              Ver todos
            </Link>
          )}
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Anterior"
            className="grid size-10 place-items-center rounded-xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Seguinte"
            className="grid size-10 place-items-center rounded-xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </header>

      <div
        ref={trackRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {properties.map((p) => (
          <div
            key={p.id}
            className="w-[85vw] shrink-0 snap-start sm:w-[330px] lg:w-[360px]"
          >
            <PropertyCard property={p} compact />
          </div>
        ))}
      </div>
    </section>
  )
}
