import { useState } from 'react'
import { CalendarClock, CheckCircle2, Mail, MessageCircle, Phone, ShieldCheck, Star } from 'lucide-react'
import Button from '../ui/Button'
import { formatAOA } from '../../lib/format'
import { formatPhone, whatsappLink } from '../../lib/whatsapp'

/** Widget lateral fixo: agendar visita ou falar por WhatsApp com o agente. */
export default function ContactWidget({ property, agent }) {
  const [tab, setTab] = useState('visita')
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '10:00',
    message: `Olá, vi o imóvel ${property.title} no JETCASA e gostaria de mais informações`,
  })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    // Demonstração: o envio real ligaria a um backend ou CRM do agente.
    setSent(true)
  }

  return (
    <aside className="min-w-0 lg:sticky lg:top-24">
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-5 dark:border-slate-800">
          <p className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {formatAOA(property.price)}
            {property.currencyPeriod && (
              <span className="text-base font-semibold text-slate-500">/{property.currencyPeriod}</span>
            )}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {property.purpose === 'venda' ? 'Valor de venda' : 'Renda mensal'} · Ref. {property.id.toUpperCase()}
          </p>
        </div>

        {agent && (
          <div className="flex items-center gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-500 text-lg font-bold text-white">
              {agent.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <span className="truncate">{agent.name}</span>
                {agent.verified && <ShieldCheck className="size-4 shrink-0 text-success-500" />}
              </p>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                {agent.agency} · {agent.role}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-gold-700 dark:text-gold-400">
                <Star className="size-3.5 fill-gold-500 text-gold-500" /> {agent.rating} · {agent.deals} negócios
              </p>
            </div>
          </div>
        )}

        <div className="p-5">
          <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {[
              { id: 'visita', label: 'Agendar Visita' },
              { id: 'mensagem', label: 'Enviar Mensagem' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  tab === t.id
                    ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-950 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {sent ? (
            <div className="rounded-xl bg-success-600/10 p-5 text-center">
              <CheckCircle2 className="mx-auto size-10 text-success-600" />
              <p className="mt-3 font-bold text-slate-900 dark:text-white">Pedido enviado!</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {agent ? `${agent.name} responde normalmente em menos de 2 horas.` : 'Entraremos em contacto em breve.'}
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 text-sm font-bold text-brand-600 hover:underline dark:text-brand-300"
              >
                Enviar outro pedido
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-3">
              <Input placeholder="O seu nome" value={form.name} onChange={set('name')} required />
              <Input
                type="tel"
                placeholder="Telefone (ex.: 923 000 000)"
                value={form.phone}
                onChange={set('phone')}
                required
              />
              <Input type="email" placeholder="Email (opcional)" value={form.email} onChange={set('email')} />

              {tab === 'visita' ? (
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Dia da visita
                    </span>
                    <Input type="date" value={form.date} onChange={set('date')} required />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Hora
                    </span>
                    <Input type="time" value={form.time} onChange={set('time')} required />
                  </label>
                </div>
              ) : (
                <textarea
                  rows={4}
                  aria-label="Mensagem para o agente"
                  value={form.message}
                  onChange={set('message')}
                  className="w-full resize-none rounded-xl bg-white px-3.5 py-3 text-sm text-slate-800 ring-1 ring-slate-200 outline-none transition focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700"
                />
              )}

              <Button type="submit" size="lg" icon={tab === 'visita' ? CalendarClock : Mail}>
                {tab === 'visita' ? 'Agendar Visita' : 'Enviar Mensagem'}
              </Button>
            </form>
          )}

          <Button
            href={whatsappLink(agent?.phone ?? '244923000100', property.title)}
            target="_blank"
            rel="noopener noreferrer"
            variant="success"
            size="lg"
            icon={MessageCircle}
            className="mt-3 w-full"
          >
            Falar via WhatsApp
          </Button>

          {agent && (
            <a
              href={`tel:+${agent.phone}`}
              className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-brand-600 dark:text-slate-300"
            >
              <Phone className="size-4" /> {formatPhone(agent.phone)}
            </a>
          )}
        </div>
      </div>

      <p className="mt-3 px-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Nunca faça pagamentos antes de visitar o imóvel e confirmar a documentação. O JETCASA não
        intermedeia pagamentos entre particulares.
      </p>
    </aside>
  )
}

function Input(props) {
  return (
    <input
      {...props}
      className="h-11 w-full rounded-xl bg-white px-3.5 text-sm text-slate-800 ring-1 ring-slate-200 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-700"
    />
  )
}
