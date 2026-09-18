import { useEffect, useMemo, useState } from 'react'
import { BadgeCheck, Camera, LineChart, Megaphone, ShieldCheck, Timer } from 'lucide-react'
import Button from '../components/ui/Button'
import { PROVINCES } from '../data/locations'
import { PROPERTIES } from '../data/properties'
import { formatAOA } from '../lib/format'

const BENEFITS = [
  { icon: Megaphone, title: 'Alcance nacional', text: 'O seu anúncio chega a compradores em todas as 18 províncias e à diáspora angolana.' },
  { icon: ShieldCheck, title: 'Documentação validada', text: 'Verificamos registo predial, título definitivo ou direito de superfície antes de publicar.' },
  { icon: Camera, title: 'Apoio na apresentação', text: 'Ajudamos com fotografias, descrição e definição de um preço realista para a zona.' },
  { icon: Timer, title: 'Menos tempo no mercado', text: 'Anúncios verificados fecham negócio, em média, 40% mais depressa.' },
]

/** Página "Vender" com avaliação rápida baseada no preço médio por m² da zona. */
export default function Sell() {
  const [province, setProvince] = useState('Luanda')
  const [zone, setZone] = useState('Talatona')
  const [area, setArea] = useState(250)
  const [type, setType] = useState('vivenda')

  useEffect(() => {
    document.title = 'Vender com a JETCASA'
  }, [])

  const zones = PROVINCES.find((p) => p.name === province)?.zones ?? []

  const estimate = useMemo(() => {
    // Preço médio por m² dos anúncios de venda comparáveis, com recuo progressivo
    // para a província e depois para todo o país quando não há amostra local.
    const sale = PROPERTIES.filter((p) => p.purpose === 'venda' && p.area > 0)
    const pools = [
      sale.filter((p) => p.zone === zone && p.type === type),
      sale.filter((p) => p.zone === zone),
      sale.filter((p) => p.province === province && p.type === type),
      sale.filter((p) => p.province === province),
      sale.filter((p) => p.type === type),
      sale,
    ]
    const pool = pools.find((s) => s.length > 0) ?? sale
    const avg = pool.reduce((sum, p) => sum + p.price / p.area, 0) / pool.length
    const value = avg * Number(area || 0)
    return { low: value * 0.88, mid: value, high: value * 1.14, sample: pool.length }
  }, [province, zone, type, area])

  return (
    <div>
      <section className="bg-brand-500">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white ring-1 ring-white/40">
              Vender no JETCASA
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Venda o seu imóvel ou terreno com quem conhece o mercado angolano
            </h1>
            <p className="mt-4 max-w-xl text-white/90">
              Publique gratuitamente, receba contactos qualificados por WhatsApp e conte com a nossa
              equipa para validar a documentação até à escritura.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/publicar" variant="gold" size="lg">Publicar Imóvel</Button>
              <Button to="/agentes" variant="white" size="lg">Falar com um agente</Button>
            </div>
          </div>

          {/* Avaliação rápida */}
          <div className="card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <LineChart className="size-5 text-brand-500" />
              Avaliação rápida
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Estimativa a partir dos anúncios comparáveis no JETCASA.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Província</span>
                <select
                  value={province}
                  onChange={(e) => {
                    setProvince(e.target.value)
                    setZone(PROVINCES.find((p) => p.name === e.target.value)?.zones[0] ?? '')
                  }}
                  className={selectCls}
                >
                  {PROVINCES.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Zona</span>
                <select value={zone} onChange={(e) => setZone(e.target.value)} className={selectCls}>
                  {zones.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tipo</span>
                <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
                  <option value="vivenda">Vivenda</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="escritorio">Escritório</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Área (m²)</span>
                <input
                  type="number"
                  min="10"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className={selectCls}
                />
              </label>
            </div>

            <div className="mt-6 rounded-xl bg-slate-900 p-5 text-white dark:bg-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                Valor estimado
              </p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                {formatAOA(estimate.mid)}
              </p>
              <p className="mt-1 text-sm text-white/70">
                Intervalo provável: {formatAOA(estimate.low)} — {formatAOA(estimate.high)}
              </p>
              <p className="mt-3 text-xs text-white/50">
                Baseado em {estimate.sample}{' '}
                {estimate.sample === 1 ? 'anúncio comparável' : 'anúncios comparáveis'}. Estimativa
                indicativa, não substitui uma avaliação presencial.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Porquê vender connosco
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <article key={b.title} className="card p-6">
              <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                <b.icon className="size-6" />
              </span>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{b.text}</p>
            </article>
          ))}
        </div>

        <div className="card mt-10 flex flex-wrap items-center justify-between gap-6 p-8">
          <div className="flex items-center gap-4">
            <BadgeCheck className="size-12 shrink-0 text-success-500" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Publicação gratuita, sem comissões escondidas
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Só paga se optar por destaque na homepage ou por acompanhamento completo do agente.
              </p>
            </div>
          </div>
          <Button to="/publicar" size="lg">Começar agora</Button>
        </div>
      </section>
    </div>
  )
}

const selectCls =
  'h-11 w-full rounded-xl bg-white px-3 text-sm font-medium ring-1 ring-slate-200 outline-none transition focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:text-white dark:ring-slate-700'
