import { useEffect, useState } from 'react'
import { Camera, CheckCircle2, FileText, Home as HomeIcon, MapPin, Wallet } from 'lucide-react'
import Button from '../components/ui/Button'
import { PROPERTY_TYPES, CONDITIONS, DOCUMENTATION, AMENITIES } from '../data/properties'
import { PROVINCES } from '../data/locations'
import { formatAOA } from '../lib/format'

const STEPS = [
  { id: 1, title: 'Tipo e finalidade', icon: HomeIcon },
  { id: 2, title: 'Localização', icon: MapPin },
  { id: 3, title: 'Características', icon: FileText },
  { id: 4, title: 'Preço e contacto', icon: Wallet },
]

/** Formulário de publicação de anúncio em 4 passos. */
export default function Publish() {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    purpose: 'venda',
    type: 'apartamento',
    province: 'Luanda',
    zone: '',
    address: '',
    bedrooms: 3,
    bathrooms: 2,
    area: '',
    parking: 1,
    condition: 'usado',
    documentation: 'registo',
    amenities: [],
    price: '',
    title: '',
    description: '',
    name: '',
    phone: '',
  })

  useEffect(() => {
    document.title = 'Publicar imóvel — JETCASA'
  }, [])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const zones = PROVINCES.find((p) => p.name === form.province)?.zones ?? []
  const isLand = form.type === 'terreno'

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <CheckCircle2 className="mx-auto size-16 text-success-500" />
        <h1 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
          Anúncio submetido!
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          A nossa equipa verifica a documentação e publica o seu anúncio em até 24 horas. Receberá
          uma confirmação no número {form.phone || 'indicado'}.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button to="/">Voltar ao início</Button>
          <Button variant="outline" onClick={() => { setDone(false); setStep(1) }}>
            Publicar outro
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Publicar imóvel
      </h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Publicação gratuita. Os anúncios com documentação verificada recebem o selo{' '}
        <span className="font-semibold text-success-600">Verificado</span> e aparecem primeiro nos
        resultados.
      </p>

      {/* Passos */}
      <ol className="mt-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(s.id)}
              className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                step >= s.id ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'
              }`}
              aria-label={s.title}
            >
              <s.icon className="size-5" />
            </button>
            <span className={`hidden text-sm font-semibold sm:block ${step === s.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
              {s.title}
            </span>
            {i < STEPS.length - 1 && <span className="h-0.5 flex-1 rounded bg-slate-200 dark:bg-slate-800" />}
          </li>
        ))}
      </ol>

      <form
        className="card mt-8 grid gap-5 p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault()
          if (step < 4) setStep(step + 1)
          else setDone(true)
        }}
      >
        {step === 1 && (
          <>
            <Field label="Finalidade">
              <div className="flex gap-2">
                {[
                  { id: 'venda', label: 'Vender' },
                  { id: 'aluguer', label: 'Arrendar' },
                ].map((o) => (
                  <Choice key={o.id} active={form.purpose === o.id} onClick={() => set('purpose', o.id)}>
                    {o.label}
                  </Choice>
                ))}
              </div>
            </Field>
            <Field label="Tipo de imóvel">
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((t) => (
                  <Choice key={t.id} active={form.type === t.id} onClick={() => set('type', t.id)}>
                    {t.label}
                  </Choice>
                ))}
              </div>
            </Field>
            <Field label="Título do anúncio">
              <Input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Ex.: Vivenda T4 em condomínio fechado no Talatona"
                required
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Província">
                <Select value={form.province} onChange={(e) => { set('province', e.target.value); set('zone', '') }}>
                  {PROVINCES.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Município / Centralidade">
                <Select value={form.zone} onChange={(e) => set('zone', e.target.value)} required>
                  <option value="">Seleccione</option>
                  {zones.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Morada ou referência">
              <Input
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                placeholder="Ex.: Condomínio Jardins do Éden, junto à Via S8"
              />
            </Field>
            <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
              <Camera className="mb-2 size-5" />
              Adicione pelo menos 5 fotografias com boa luz. Anúncios com fotos recebem, em média,
              4x mais contactos.
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {!isLand && (
              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Quartos">
                  <Input type="number" min="0" value={form.bedrooms} onChange={(e) => set('bedrooms', Number(e.target.value))} />
                </Field>
                <Field label="Casas de banho">
                  <Input type="number" min="0" value={form.bathrooms} onChange={(e) => set('bathrooms', Number(e.target.value))} />
                </Field>
                <Field label="Lugares de garagem">
                  <Input type="number" min="0" value={form.parking} onChange={(e) => set('parking', Number(e.target.value))} />
                </Field>
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={isLand ? 'Área do terreno (m²)' : 'Área útil (m²)'}>
                <Input type="number" min="0" value={form.area} onChange={(e) => set('area', e.target.value)} required />
              </Field>
              <Field label="Estado">
                <Select value={form.condition} onChange={(e) => set('condition', e.target.value)}>
                  {CONDITIONS.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Documentação">
              <Select value={form.documentation} onChange={(e) => set('documentation', e.target.value)}>
                {DOCUMENTATION.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Comodidades">
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => (
                  <Choice
                    key={a}
                    active={form.amenities.includes(a)}
                    onClick={() =>
                      set(
                        'amenities',
                        form.amenities.includes(a)
                          ? form.amenities.filter((x) => x !== a)
                          : [...form.amenities, a],
                      )
                    }
                  >
                    {a}
                  </Choice>
                ))}
              </div>
            </Field>
          </>
        )}

        {step === 4 && (
          <>
            <Field label={form.purpose === 'venda' ? 'Preço de venda (AOA)' : 'Renda mensal (AOA)'}>
              <Input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="Ex.: 45000000"
                required
              />
              {form.price !== '' && (
                <p className="mt-1.5 text-sm font-bold text-brand-600 dark:text-brand-300">
                  {formatAOA(Number(form.price))}
                  {form.purpose === 'aluguer' && '/mês'}
                </p>
              )}
            </Field>
            <Field label="Descrição">
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Descreva o imóvel, o bairro, os acessos e o que o torna especial."
                className="w-full resize-none rounded-xl bg-white px-3.5 py-3 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="O seu nome">
                <Input value={form.name} onChange={(e) => set('name', e.target.value)} required />
              </Field>
              <Field label="Telefone / WhatsApp">
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="923 000 000"
                  required
                />
              </Field>
            </div>
          </>
        )}

        <div className="mt-2 flex items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            Voltar
          </Button>
          <Button type="submit" size="lg" variant={step === 4 ? 'gold' : 'primary'}>
            {step === 4 ? 'Submeter anúncio' : 'Continuar'}
          </Button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {children}
    </label>
  )
}

function Input(props) {
  return (
    <input
      {...props}
      className="h-11 w-full rounded-xl bg-white px-3.5 text-sm ring-1 ring-slate-200 outline-none transition focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
    />
  )
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="h-11 w-full rounded-xl bg-white px-3 text-sm ring-1 ring-slate-200 outline-none transition focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
    >
      {children}
    </select>
  )
}

function Choice({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? 'bg-brand-500 text-white shadow-sm'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      {children}
    </button>
  )
}
