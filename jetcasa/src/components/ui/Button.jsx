import { Link } from 'react-router-dom'

const VARIANTS = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm hover:shadow-md',
  gold: 'bg-gold-700 text-white hover:bg-gold-800 shadow-sm hover:shadow-md',
  success: 'bg-success-600 text-white hover:bg-success-700 shadow-sm',
  outline:
    'ring-1 ring-slate-300 text-slate-700 hover:bg-slate-100 hover:ring-slate-400 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800',
  ghost:
    'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
  white: 'bg-white text-brand-600 hover:bg-brand-50 shadow-sm',
}

const SIZES = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-13 px-7 text-base gap-2.5',
}

export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  className = '',
  children,
  ...props
}) {
  const cls = `inline-flex items-center justify-center rounded-xl font-semibold transition
    duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50
    ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  const content = (
    <>
      {Icon && <Icon className="size-[1.15em]" aria-hidden="true" />}
      {children}
      {IconRight && <IconRight className="size-[1.15em]" aria-hidden="true" />}
    </>
  )

  if (to) return <Link to={to} className={cls} {...props}>{content}</Link>
  if (href) return <a href={href} className={cls} {...props}>{content}</a>
  const Tag = as ?? 'button'
  return <Tag className={cls} {...props}>{content}</Tag>
}
