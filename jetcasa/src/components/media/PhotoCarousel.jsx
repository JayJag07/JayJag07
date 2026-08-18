import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PropertyImage from './PropertyImage'

/**
 * Carrossel de fotos do card — permite deslizar sem abrir o imóvel.
 * Suporta rato, teclado e gesto de arrastar/swipe no telemóvel.
 */
export default function PhotoCarousel({ images = [], seed, alt, className = '', rounded = 'rounded-t-2xl' }) {
  const [index, setIndex] = useState(0)
  const [drag, setDrag] = useState(null)
  const total = images.length || 1

  const go = (delta, e) => {
    e?.preventDefault()
    e?.stopPropagation()
    setIndex((i) => (i + delta + total) % total)
  }

  const onPointerDown = (e) => setDrag({ x: e.clientX, moved: false })
  const onPointerUp = (e) => {
    if (!drag) return
    const dx = e.clientX - drag.x
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1, e)
    setDrag(null)
  }

  return (
    <div
      className={`group/carousel relative overflow-hidden bg-slate-200 dark:bg-slate-800 ${rounded} ${className}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={() => setDrag(null)}
    >
      <div
        className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {(images.length ? images : ['villa']).map((variant, i) => (
          <div key={`${variant}-${i}`} className="h-full w-full shrink-0">
            <PropertyImage
              variant={variant}
              seed={`${seed}-${i}`}
              alt={`${alt} — imagem ${i + 1} de ${total}`}
              className="h-full w-full object-cover transition duration-700 group-hover/carousel:scale-[1.04]"
            />
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Imagem anterior"
            onClick={(e) => go(-1, e)}
            className="absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-md transition hover:bg-white focus-visible:opacity-100 group-hover/carousel:opacity-100 dark:bg-slate-900/85 dark:text-slate-100"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Imagem seguinte"
            onClick={(e) => go(1, e)}
            className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-md transition hover:bg-white focus-visible:opacity-100 group-hover/carousel:opacity-100 dark:bg-slate-900/85 dark:text-slate-100"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full bg-white transition-all duration-300 ${
                  i === index ? 'w-5 opacity-100' : 'w-1.5 opacity-60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
