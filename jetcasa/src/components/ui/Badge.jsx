const TONES = {
  brand: 'bg-brand-500 text-white',
  // Texto escuro sobre o dourado: branco sobre #f59e0b fica em 2.14:1.
  gold: 'bg-gold-400 text-slate-900',
  success: 'bg-success-600 text-white',
  neutral: 'bg-white/95 text-slate-800 dark:bg-slate-900/90 dark:text-slate-100',
  outline:
    'bg-transparent text-slate-700 ring-1 ring-slate-400 dark:text-slate-300 dark:ring-slate-700',
}

export default function Badge({ tone = 'neutral', icon: Icon, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur ${TONES[tone]} ${className}`}
    >
      {Icon && <Icon className="size-3.5" aria-hidden="true" />}
      {children}
    </span>
  )
}
