import { Link } from 'react-router-dom'

/** Marca JETCASA — telhado azul com detalhe dourado. */
export default function Logo({ className = '', inverted = false }) {
  return (
    <Link to="/" className={`group flex items-center gap-2.5 ${className}`} aria-label="JETCASA — página inicial">
      <span className="grid size-10 place-items-center rounded-xl bg-brand-500 shadow-md transition group-hover:scale-105">
        <svg viewBox="0 0 64 64" className="size-7" aria-hidden="true">
          <path d="M32 12 54 31h-7v20H17V31h-7z" fill="#fff" />
          <path d="M26 37h12v14H26z" fill="#F59E0B" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`block text-xl font-extrabold tracking-tight ${
            inverted ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}
        >
          JET<span className="text-brand-500 dark:text-brand-300">CASA</span>
        </span>
        <span
          className={`mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] ${
            inverted ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          Portal imobiliário
        </span>
      </span>
    </Link>
  )
}
