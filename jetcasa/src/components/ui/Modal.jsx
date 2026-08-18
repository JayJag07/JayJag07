import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'

/** Modal acessível: fecha com Esc, prende o foco e bloqueia o scroll de fundo. */
export default function Modal({ open, onClose, title, children, className = '' }) {
  const panelRef = useRef(null)
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key !== 'Tab') return
      const nodes = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!nodes?.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    panelRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/80 p-3 animate-[var(--animate-fade-in)] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative max-h-[92vh] w-full overflow-auto rounded-2xl bg-white shadow-2xl outline-none dark:bg-slate-900 ${className}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white dark:bg-slate-800/90 dark:text-slate-200"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
