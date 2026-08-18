import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Images } from 'lucide-react'
import Modal from '../ui/Modal'
import PropertyImage from '../media/PropertyImage'

/** Galeria em grelha (estilo Zillow/Airbnb) com modal de tela cheia. */
export default function Gallery({ property }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const images = property.images
  const total = images.length
  // A grelha adapta-se ao número de fotos para não deixar células vazias.
  const layout =
    total >= 5
      ? { grid: 'sm:grid-cols-4 sm:grid-rows-2', hero: 'aspect-[4/3] sm:col-span-2 sm:row-span-2 sm:aspect-auto', count: 4 }
      : total >= 3
        ? { grid: 'sm:grid-cols-3 sm:grid-rows-2', hero: 'aspect-[4/3] sm:col-span-2 sm:row-span-2 sm:aspect-auto', count: 2 }
        : { grid: 'sm:grid-cols-2', hero: 'aspect-[4/3]', count: 1 }
  const thumbs = images.slice(1, 1 + layout.count)

  const openAt = (i) => {
    setIndex(i)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % total)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + total) % total)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, total])

  return (
    <>
      <div className="relative">
      <div className={`grid gap-2 overflow-hidden rounded-2xl ${layout.grid}`}>
        <button
          type="button"
          onClick={() => openAt(0)}
          className={`group relative overflow-hidden ${layout.hero}`}
        >
          <PropertyImage
            variant={images[0]}
            seed={`${property.id}-0`}
            alt={property.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </button>

        {thumbs.map((variant, i) => (
          <button
            key={`${variant}-${i}`}
            type="button"
            onClick={() => openAt(i + 1)}
            className="group relative hidden aspect-[4/3] overflow-hidden sm:block"
          >
            <PropertyImage
              variant={variant}
              seed={`${property.id}-${i + 1}`}
              alt={`${property.title} — imagem ${i + 2}`}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </button>
        ))}

      </div>
        <button
          type="button"
          onClick={() => openAt(0)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-bold text-slate-800 shadow-lg transition hover:bg-white dark:bg-slate-900/95 dark:text-white"
        >
          <Images className="size-4" /> Ver as {total} fotos
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Galeria de fotos" className="max-w-5xl bg-slate-950">
        <div className="relative">
          <PropertyImage
            variant={images[index]}
            seed={`${property.id}-${index}`}
            alt={`${property.title} — imagem ${index + 1}`}
            className="aspect-[4/3] w-full object-cover"
          />
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + total) % total)}
            aria-label="Imagem anterior"
            className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow-lg transition hover:bg-white"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % total)}
            aria-label="Imagem seguinte"
            className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-800 shadow-lg transition hover:bg-white"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-4 bg-slate-950 px-4 py-3">
          <p className="text-sm font-semibold text-white/90">{property.title}</p>
          <p className="shrink-0 text-sm text-white/60">
            {index + 1} / {total}
          </p>
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto bg-slate-950 px-4 pb-4">
          {images.map((v, i) => (
            <button
              key={`${v}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                i === index ? 'ring-brand-500' : 'ring-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <PropertyImage variant={v} seed={`${property.id}-${i}`} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </Modal>
    </>
  )
}
