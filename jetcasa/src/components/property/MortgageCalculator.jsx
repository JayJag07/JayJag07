import { useMemo, useState } from 'react'
import { Calculator, Info } from 'lucide-react'
import { formatAOA } from '../../lib/format'

/**
 * Simulador de prestação (venda) ou de custo do arrendamento (aluguer).
 * Usa a fórmula da anuidade: P = C · i / (1 − (1+i)^−n).
 */
export default function MortgageCalculator({ property }) {
  const isRent = property.purpose === 'aluguer'
  return isRent ? <RentSimulator property={property} /> : <LoanSimulator property={property} />
}

function LoanSimulator({ property }) {
  const [downPct, setDownPct] = useState(30)
  const [years, setYears] = useState(15)
  const [rate, setRate] = useState(16)

  const { monthly, financed, totalPaid, interest } = useMemo(() => {
    const down = (property.price * downPct) / 100
    const financed = property.price - down
    const i = rate / 100 / 12
    const n = years * 12
    const monthly = i === 0 ? financed / n : (financed * i) / (1 - (1 + i) ** -n)
    return { monthly, financed, totalPaid: monthly * n, interest: monthly * n - financed }
  }, [property.price, downPct, years, rate])

  return (
    <Shell title="Simulador de prestação">
      <Row label="Valor do imóvel" value={formatAOA(property.price)} />
      <Slider
        label="Entrada"
        value={downPct}
        min={0}
        max={80}
        step={5}
        onChange={setDownPct}
        display={`${downPct}% · ${formatAOA((property.price * downPct) / 100)}`}
      />
      <Slider
        label="Prazo"
        value={years}
        min={5}
        max={30}
        step={1}
        onChange={setYears}
        display={`${years} anos`}
      />
      <Slider
        label="Taxa de juro anual"
        value={rate}
        min={5}
        max={30}
        step={0.5}
        onChange={setRate}
        display={`${rate.toFixed(1)}%`}
      />

      <div className="mt-5 rounded-xl bg-brand-500 p-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/90">
          Prestação mensal estimada
        </p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight">{formatAOA(monthly)}</p>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
        <Mini label="Financiado" value={formatAOA(financed)} />
        <Mini label="Juros totais" value={formatAOA(interest)} />
        <Mini label="Total pago" value={formatAOA(totalPaid)} />
      </dl>
      <Note>
        Simulação indicativa. As condições finais dependem do banco, do seguro e da avaliação do
        imóvel.
      </Note>
    </Shell>
  )
}

function RentSimulator({ property }) {
  const [months, setMonths] = useState(12)
  const [deposit, setDeposit] = useState(3)
  const [condo, setCondo] = useState(0)

  const rent = property.price
  const monthlyTotal = rent + condo
  const upfront = rent * deposit + monthlyTotal
  const annual = monthlyTotal * months

  return (
    <Shell title="Simulador de arrendamento">
      <Row label="Renda mensal" value={`${formatAOA(rent)}/mês`} />
      <Slider label="Duração do contrato" value={months} min={6} max={36} step={6} onChange={setMonths} display={`${months} meses`} />
      <Slider label="Caução (rendas adiantadas)" value={deposit} min={0} max={6} step={1} onChange={setDeposit} display={`${deposit} rendas`} />
      <Slider
        label="Condomínio / manutenção"
        value={condo}
        min={0}
        max={500000}
        step={25000}
        onChange={setCondo}
        display={formatAOA(condo)}
      />

      <div className="mt-5 rounded-xl bg-success-600 p-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/90">
          Custo mensal estimado
        </p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight">{formatAOA(monthlyTotal)}</p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-center">
        <Mini label="Entrada inicial" value={formatAOA(upfront)} />
        <Mini label={`Total em ${months} meses`} value={formatAOA(annual)} />
      </dl>
      <Note>A caução habitual em Angola varia entre 2 e 6 rendas, negociável com o proprietário.</Note>
    </Shell>
  )
}

function Shell({ title, children }) {
  return (
    <section className="card p-5 sm:p-6">
      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
        <Calculator className="size-5 text-brand-500" />
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Row({ label, value }) {
  return (
    <div className="mb-4 flex items-baseline justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-bold text-slate-900 dark:text-white">{value}</span>
    </div>
  )
}

function Slider({ label, value, min, max, step, onChange, display }) {
  return (
    <label className="mb-4 block">
      <span className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
        <span className="text-sm font-bold text-brand-600 dark:text-brand-300">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-500 dark:bg-slate-700"
      />
    </label>
  )
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{value}</dd>
    </div>
  )
}

function Note({ children }) {
  return (
    <p className="mt-4 flex gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
      <Info className="size-4 shrink-0 text-slate-400" />
      {children}
    </p>
  )
}
