import { Link } from 'react-router-dom'
import { Bath, BedDouble, Car, MapPin, Maximize, ShieldCheck, Star } from 'lucide-react'
import PhotoCarousel from '../media/PhotoCarousel'
import Badge from '../ui/Badge'
import FavoriteButton from '../ui/FavoriteButton'
import { formatAOA, formatArea, timeAgo } from '../../lib/format'
import { documentationLabel, propertyTypeLabel } from '../../data/properties'

/** Card de imóvel usado na homepage, nos resultados e nos favoritos. */
export default function PropertyCard({ property, compact = false, onHover }) {
  const p = property
  const isLand = p.type === 'terreno'

  return (
    <article
      onMouseEnter={() => onHover?.(p.id)}
      onMouseLeave={() => onHover?.(null)}
      className="card group overflow-hidden hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative">
        <PhotoCarousel
          images={p.images}
          seed={p.id}
          alt={p.title}
          className={compact ? 'aspect-[16/10]' : 'aspect-[4/3]'}
        />
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge tone={p.purpose === 'venda' ? 'brand' : 'success'}>
            {p.purpose === 'venda' ? 'Para Venda' : 'Para Aluguer'}
          </Badge>
          {p.featured && <Badge tone="gold" icon={Star}>Destaque</Badge>}
          {p.verified && <Badge tone="neutral" icon={ShieldCheck}>Verificado</Badge>}
        </div>
        <FavoriteButton id={p.id} className="absolute right-3 top-3" />
      </div>

      <Link to={`/imovel/${p.id}`} className="block p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {formatAOA(p.price)}
            {p.currencyPeriod && (
              <span className="ml-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                /{p.currencyPeriod}
              </span>
            )}
          </p>
          <span className="shrink-0 text-xs font-medium text-slate-400">{timeAgo(p.createdAt)}</span>
        </div>

        <h3 className="mt-1.5 line-clamp-1 font-semibold text-slate-800 transition group-hover:text-brand-600 dark:text-slate-100 dark:group-hover:text-brand-300">
          {p.title}
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <MapPin className="size-4 shrink-0 text-brand-500" />
          <span className="line-clamp-1">
            {p.province}, {p.zone}
          </span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
          {isLand ? (
            <>
              <Spec icon={Maximize} value={formatArea(p.area)} label="área" />
              <span className="chip bg-slate-100 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {documentationLabel(p.documentation)}
              </span>
            </>
          ) : (
            <>
              <Spec icon={BedDouble} value={p.bedrooms} label={p.bedrooms === 1 ? 'quarto' : 'quartos'} />
              <Spec icon={Bath} value={p.bathrooms} label={p.bathrooms === 1 ? 'wc' : 'wc'} />
              <Spec icon={Maximize} value={formatArea(p.area)} />
              {p.parking > 0 && <Spec icon={Car} value={p.parking} label="lugares" />}
            </>
          )}
          <span className="ml-auto text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
            {propertyTypeLabel(p.type)}
          </span>
        </div>
      </Link>
    </article>
  )
}

function Spec({ icon: Icon, value, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="size-4 text-slate-400" aria-hidden="true" />
      <span className="font-semibold text-slate-700 dark:text-slate-200">{value}</span>
      {label && <span className="text-slate-500 dark:text-slate-400">{label}</span>}
    </span>
  )
}
