import { useEffect, useMemo, useRef, useState } from 'react'
import { MapPin, Search } from 'lucide-react'
import { LOCATION_SUGGESTIONS } from '../../data/locations'
import { normalize } from '../../lib/format'

/**
 * Campo de busca com auto-complete de província, município ou centralidade.
 * Navegável por teclado (setas + Enter + Esc).
 */
export default function LocationAutocomplete({
  value,
  onChange,
  onSelect,
  onSubmit,
  placeholder = 'Província, município ou centralidade (ex.: Talatona, Kilamba, Benguela)',
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const boxRef = useRef(null)

  const matches = useMemo(() => {
    const q = normalize(value)
    if (!q) return LOCATION_SUGGESTIONS.slice(0, 8)
    return LOCATION_SUGGESTIONS.filter((s) => normalize(s.label).includes(q)).slice(0, 8)
  }, [value])

  useEffect(() => {
    const onClickAway = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    return () => document.removeEventListener('mousedown', onClickAway)
  }, [])

  const choose = (item) => {
    onSelect?.(item)
    onChange(item.label)
    setOpen(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(i + 1, matches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (open && matches[active]) choose(matches[active])
      else onSubmit?.()
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={boxRef} className={`relative flex-1 ${className}`}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
          setActive(0)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Pesquisar por localização"
        aria-expanded={open}
        aria-autocomplete="list"
        role="combobox"
        className="h-13 w-full rounded-xl border-0 bg-white pl-12 pr-4 text-[15px] text-slate-800 shadow-sm ring-1 ring-slate-200 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
      />

      {open && matches.length > 0 && (
        <ul
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+8px)] z-50 max-h-80 overflow-auto rounded-xl bg-white py-2 shadow-2xl ring-1 ring-slate-900/10 animate-[var(--animate-fade-in)] dark:bg-slate-900 dark:ring-white/10"
        >
          {matches.map((m, i) => (
            <li key={m.label}>
              <button
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(m)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                  i === active ? 'bg-brand-50 dark:bg-slate-800' : ''
                }`}
              >
                <MapPin className="size-4 shrink-0 text-brand-500" />
                <span className="flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-100">
                  {m.label}
                </span>
                <span className="shrink-0 text-xs text-slate-400">{m.type}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
