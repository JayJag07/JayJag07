import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  CheckCircle2,
  FileText,
  Layers,
  MapPin,
  Maximize,
  Share2,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react'
import Gallery from '../components/property/Gallery'
import ContactWidget from '../components/property/ContactWidget'
import MortgageCalculator from '../components/property/MortgageCalculator'
import PropertyCard from '../components/property/PropertyCard'
import PropertyMap from '../components/map/PropertyMap'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import FavoriteButton from '../components/ui/FavoriteButton'
import { getAgent } from '../data/agents'
import {
  PROPERTIES,
  conditionLabel,
  documentationLabel,
  getProperty,
  propertyTypeLabel,
} from '../data/properties'
import { formatAOA, formatArea, formatDateShort, pricePerM2 } from '../lib/format'

const LAND_INFRA = [
  { key: 'water', label: 'Água da rede' },
  { key: 'power', label: 'Energia eléctrica' },
  { key: 'pavedAccess', label: 'Acesso asfaltado' },
  { key: 'walled', label: 'Terreno murado' },
]

export default function PropertyDetail() {
  const { id } = useParams()
  const property = getProperty(id)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    if (property) document.title = `${property.title} — JETCASA`
  }, [property, id])

  if (!property) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Imóvel não encontrado</h1>
        <p className="mt-2 text-slate-500">O anúncio que procura pode ter sido removido.</p>
        <Button to="/pesquisar" className="mt-6" icon={ArrowLeft}>Voltar à pesquisa</Button>
      </div>
    )
  }

  const agent = getAgent(property.agentId)
  const isLand = property.type === 'terreno'
  const perM2 = pricePerM2(property.price, property.area)
  const similar = PROPERTIES.filter(
    (p) => p.id !== property.id && (p.province === property.province || p.type === property.type),
  ).slice(0, 4)

  const share = async () => {
    const data = { title: property.title, text: `${property.title} — ${formatAOA(property.price)}`, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(data)
      else await navigator.clipboard.writeText(window.location.href)
    } catch {
      /* utilizador cancelou a partilha */
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <nav aria-label="Caminho de navegação" className="mb-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <Link to="/" className="hover:text-brand-600">Início</Link>
        <span>/</span>
        <Link to={`/pesquisar?fim=${property.purpose === 'aluguer' ? 'aluguer' : isLand ? 'terreno' : 'venda'}`} className="hover:text-brand-600">
          {isLand ? 'Terrenos' : property.purpose === 'venda' ? 'Comprar' : 'Alugar'}
        </Link>
        <span>/</span>
        <span className="truncate text-slate-700 dark:text-slate-200">{property.zone}, {property.province}</span>
      </nav>

      <Gallery property={property} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <Badge tone={property.purpose === 'venda' ? 'brand' : 'success'}>
                  {property.purpose === 'venda' ? 'Para Venda' : 'Para Aluguer'}
                </Badge>
                {property.featured && <Badge tone="gold" icon={Star}>Destaque</Badge>}
                {property.verified && <Badge tone="outline" icon={ShieldCheck}>Verificado</Badge>}
                <Badge tone="outline">{propertyTypeLabel(property.type)}</Badge>
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-balance break-words text-slate-900 sm:text-3xl dark:text-white">
                {property.title}
              </h1>
              <p className="mt-2 flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-500" />
                {property.address} — {property.province}
              </p>
            </div>
            <div className="flex gap-2">
              <FavoriteButton id={property.id} size="lg" />
              <button
                type="button"
                onClick={share}
                aria-label="Partilhar imóvel"
                className="grid size-11 place-items-center rounded-full bg-white shadow-md ring-1 ring-slate-900/5 transition hover:scale-105 dark:bg-slate-900 dark:ring-white/10"
              >
                <Share2 className="size-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>

          {/* Resumo de características */}
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Fact icon={Maximize} label="Área útil" value={formatArea(property.area)} />
            {isLand ? (
              <>
                <Fact icon={Layers} label="Lote" value={formatArea(property.plotArea ?? property.area)} />
                <Fact icon={FileText} label="Documentação" value={documentationLabel(property.documentation)} />
                <Fact
                  icon={Zap}
                  label="Infra-estruturas"
                  value={`${Object.values(property.land ?? {}).filter(Boolean).length} de 4`}
                />
              </>
            ) : (
              <>
                <Fact icon={BedDouble} label="Quartos" value={`T${property.bedrooms}`} />
                <Fact icon={Bath} label="Casas de banho" value={property.bathrooms} />
                <Fact icon={Car} label="Garagem" value={property.parking > 0 ? `${property.parking} lugares` : 'Não tem'} />
              </>
            )}
          </dl>

          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Fact icon={Building2} label="Estado" value={conditionLabel(property.condition)} />
            {isLand ? (
              <Fact icon={Layers} label="Preço / m²" value={perM2 ? formatAOA(perM2) : '—'} />
            ) : (
              <Fact icon={FileText} label="Documentação" value={documentationLabel(property.documentation)} />
            )}
            <Fact icon={CalendarDays} label="Publicado" value={formatDateShort(property.createdAt)} />
            <Fact icon={MapPin} label="Zona" value={property.zone} />
          </dl>

          {/* Descrição */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sobre este imóvel</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-300">
              {property.description}
            </p>
          </section>

          {/* Infra-estruturas do terreno */}
          {isLand && property.land && (
            <section className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Infra-estruturas</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {LAND_INFRA.map((i) => (
                  <li
                    key={i.key}
                    className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium ${
                      property.land[i.key]
                        ? 'bg-success-500/10 text-success-600 dark:text-success-500'
                        : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="size-5" />
                    {i.label}
                    <span className="ml-auto text-xs font-bold uppercase">
                      {property.land[i.key] ? 'disponível' : 'não disponível'}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Comodidades */}
          {property.amenities?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Comodidades</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {property.amenities.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-slate-900/5 dark:bg-slate-900 dark:text-slate-200 dark:ring-white/10"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-brand-500" />
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Localização */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Localização</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {property.address}. A localização exacta é confirmada com o agente antes da visita.
            </p>
            <div className="mt-4 h-80 overflow-hidden rounded-2xl ring-1 ring-slate-900/5 dark:ring-white/10">
              <PropertyMap properties={[property]} activeId={property.id} />
            </div>
          </section>

          <div className="mt-8">
            <MortgageCalculator property={property} />
          </div>
        </div>

        <ContactWidget property={property} agent={agent} />
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
            Imóveis semelhantes
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <Icon className="size-4 text-brand-500" />
        {label}
      </dt>
      <dd className="mt-1.5 font-bold text-slate-900 dark:text-white">{value}</dd>
    </div>
  )
}
