import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Languages, MapPin, MessageCircle, Phone, ShieldCheck, Star } from 'lucide-react'
import Button from '../components/ui/Button'
import { AGENTS } from '../data/agents'
import { PROVINCE_NAMES } from '../data/locations'
import { PROPERTIES } from '../data/properties'
import { formatPhone, whatsappLink } from '../lib/whatsapp'
import { normalize } from '../lib/format'

export default function Agents() {
  const [query, setQuery] = useState('')
  const [province, setProvince] = useState('')

  useEffect(() => {
    document.title = 'Agentes imobiliários — JETCASA'
  }, [])

  const list = useMemo(() => {
    const q = normalize(query)
    return AGENTS.filter((a) => {
      if (province && a.province !== province) return false
      if (!q) return true
      return normalize(`${a.name} ${a.agency} ${a.zones.join(' ')}`).includes(q)
    })
  }, [query, province])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Agentes imobiliários
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Profissionais verificados que conhecem o mercado da sua província — de Luanda a Cabinda,
          do Lobito ao Lubango.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Procurar por nome, agência ou zona"
          className="h-12 flex-1 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none transition focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
        />
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="h-12 rounded-xl bg-white px-4 text-sm font-semibold ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
        >
          <option value="">Todas as províncias</option>
          {PROVINCE_NAMES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((agent) => {
          const count = PROPERTIES.filter((p) => p.agentId === agent.id).length
          return (
            <article key={agent.id} className="card flex flex-col p-6">
              <div className="flex items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-brand-500 text-xl font-bold text-white">
                  {agent.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </span>
                <div className="min-w-0">
                  <h2 className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <span className="truncate">{agent.name}</span>
                    {agent.verified && <ShieldCheck className="size-4 shrink-0 text-success-500" />}
                  </h2>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">{agent.role}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-gold-600">
                    <Star className="size-3.5 fill-gold-500 text-gold-500" />
                    {agent.rating} · {agent.deals} negócios
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{agent.bio}</p>

              <ul className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <Building2 className="size-4 text-brand-500" /> {agent.agency} · desde {agent.since}
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-brand-500" /> {agent.zones.join(' · ')}
                </li>
                <li className="flex items-center gap-2">
                  <Languages className="size-4 text-brand-500" /> {agent.languages.join(', ')}
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="size-4 text-brand-500" /> {formatPhone(agent.phone)}
                </li>
              </ul>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <Link
                  to={`/pesquisar?prov=${encodeURIComponent(agent.province)}`}
                  className="text-sm font-bold text-brand-600 hover:underline dark:text-brand-300"
                >
                  {count} anúncios activos
                </Link>
                <Button
                  href={whatsappLink(agent.phone, `da carteira de ${agent.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="success"
                  size="sm"
                  icon={MessageCircle}
                >
                  WhatsApp
                </Button>
              </div>
            </article>
          )
        })}
      </div>

      {list.length === 0 && (
        <p className="mt-16 text-center text-slate-500">
          Nenhum agente corresponde à sua pesquisa.
        </p>
      )}
    </div>
  )
}
