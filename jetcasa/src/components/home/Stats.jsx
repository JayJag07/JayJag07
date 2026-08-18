import { useEffect, useRef, useState } from 'react'
import { Building2, Handshake, MapPinned, Users } from 'lucide-react'
import { PLATFORM_STATS } from '../../data/properties'
import { formatNumber } from '../../lib/format'

const ITEMS = [
  { icon: Building2, value: PLATFORM_STATS.properties, label: 'Imóveis anunciados' },
  { icon: MapPinned, value: PLATFORM_STATS.land, label: 'Terrenos verificados' },
  { icon: Handshake, value: PLATFORM_STATS.deals, label: 'Negócios concluídos' },
  { icon: Users, value: PLATFORM_STATS.agents, label: 'Agentes parceiros' },
]

/** Contador que só arranca quando a secção entra no ecrã. */
function useCountUp(target, run) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(target)
      return
    }
    let frame
    const start = performance.now()
    const duration = 1200
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      setN(Math.round(target * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, run])
  return n
}

export default function Stats() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6">
      <div className="card grid grid-cols-2 gap-6 p-6 sm:p-8 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <Stat key={item.label} {...item} run={visible} />
        ))}
      </div>
    </section>
  )
}

function Stat({ icon: Icon, value, label, run }) {
  const n = useCountUp(value, run)
  return (
    <div className="flex items-center gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
        <Icon className="size-6" />
      </span>
      <div>
        <p className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {formatNumber(n)}
          <span className="text-brand-500">+</span>
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}
