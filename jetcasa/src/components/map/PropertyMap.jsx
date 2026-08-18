import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import PropertyImage from '../media/PropertyImage'
import { formatAOA, formatAOAShort, formatArea } from '../../lib/format'

/** Marcador em forma de "pill" com o preço aproximado do imóvel. */
function priceIcon(property, highlighted) {
  const label = formatAOAShort(property.price)
  const period = property.currencyPeriod ? '/mês' : ''
  const cls = highlighted
    ? 'bg-slate-900 text-white ring-white'
    : property.purpose === 'aluguer'
      ? 'bg-emerald-600 text-white ring-white'
      : 'bg-brand-500 text-white ring-white'

  return L.divIcon({
    className: 'jc-marker',
    html: `<span style="white-space:nowrap;width:max-content" class="inline-flex -translate-x-1/2 -translate-y-1/2 items-center rounded-full px-2.5 py-1 text-xs font-bold shadow-lg ring-2 transition ${cls}">${label}${period}</span>`,
    iconSize: [0, 0],
  })
}

/** O contentor só tem dimensão depois do layout: obriga o Leaflet a remedir. */
function ResizeOnMount() {
  const map = useMap()
  useEffect(() => {
    const fix = () => map.invalidateSize()
    const id = setTimeout(fix, 120)
    window.addEventListener('resize', fix)
    return () => {
      clearTimeout(id)
      window.removeEventListener('resize', fix)
    }
  }, [map])
  return null
}

/** Ajusta o enquadramento sempre que a lista de resultados muda. */
function FitBounds({ properties }) {
  const map = useMap()
  useEffect(() => {
    if (!properties.length) return
    map.invalidateSize()
    const bounds = L.latLngBounds(properties.map((p) => p.coords))
    map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 14, duration: 0.6 })
  }, [map, properties])
  return null
}

/** Centra o mapa no imóvel sobre o qual o rato está no card correspondente. */
function FocusMarker({ property }) {
  const map = useMap()
  useEffect(() => {
    if (property) map.panTo(property.coords, { animate: true, duration: 0.4 })
  }, [map, property])
  return null
}

export default function PropertyMap({ properties = [], activeId, onMarkerHover, className = '' }) {
  const [tilesFailed, setTilesFailed] = useState(false)
  const center = useMemo(
    () => (properties.length ? properties[0].coords : [-8.8383, 13.2344]),
    [properties],
  )
  const focused = properties.find((p) => p.id === activeId)
  const mapRef = useRef(null)

  return (
    <div className={`relative h-full w-full ${className}`}>
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom
        ref={mapRef}
        className="h-full w-full"
        attributionControl
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
          eventHandlers={{ tileerror: () => setTilesFailed(true) }}
        />
        <ResizeOnMount />
        <FitBounds properties={properties} />
        <FocusMarker property={focused} />

        {properties.map((p) => (
          <Marker
            key={p.id}
            position={p.coords}
            icon={priceIcon(p, p.id === activeId)}
            zIndexOffset={p.id === activeId ? 1000 : 0}
            eventHandlers={{
              mouseover: () => onMarkerHover?.(p.id),
              mouseout: () => onMarkerHover?.(null),
            }}
          >
            <Popup minWidth={240} maxWidth={260}>
              <Link to={`/imovel/${p.id}`} className="block w-56 no-underline">
                <PropertyImage
                  variant={p.images[0]}
                  seed={p.id}
                  alt={p.title}
                  className="h-28 w-full rounded-lg object-cover"
                />
                <p className="mt-2 text-base font-extrabold text-slate-900">
                  {formatAOA(p.price)}
                  {p.currencyPeriod && <span className="text-xs font-semibold">/{p.currencyPeriod}</span>}
                </p>
                <p className="line-clamp-2 text-sm font-medium text-slate-700">{p.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {p.type === 'terreno'
                    ? formatArea(p.area)
                    : `${p.bedrooms} quartos · ${p.bathrooms} wc · ${formatArea(p.area)}`}
                </p>
                <p className="mt-1 text-xs font-semibold text-brand-600">Ver detalhes →</p>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {tilesFailed && properties.length > 0 && (
        <p className="pointer-events-none absolute inset-x-3 bottom-8 z-[500] rounded-xl bg-white/90 px-3 py-2 text-center text-xs font-semibold text-slate-600 shadow-md backdrop-blur dark:bg-slate-900/90 dark:text-slate-300">
          Sem ligação ao servidor de mapas — os marcadores continuam a mostrar a localização e o preço.
        </p>
      )}

      {!properties.length && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-slate-100/80 backdrop-blur-sm dark:bg-slate-900/80">
          <p className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-lg dark:bg-slate-800 dark:text-slate-200">
            Nenhum imóvel corresponde aos filtros aplicados.
          </p>
        </div>
      )}
    </div>
  )
}
