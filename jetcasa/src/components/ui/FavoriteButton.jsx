import { Heart } from 'lucide-react'
import { useFavorites } from '../../context/FavoritesContext'

/** Coração interactivo — guarda o imóvel localmente, sem login. */
export default function FavoriteButton({ id, className = '', size = 'md' }) {
  const { has, toggle } = useFavorites()
  const active = has(id)
  const box = size === 'lg' ? 'size-11' : 'size-9'

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? 'Remover dos favoritos' : 'Guardar nos favoritos'}
      title={active ? 'Remover dos favoritos' : 'Guardar nos favoritos'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(id)
      }}
      className={`grid ${box} place-items-center rounded-full bg-white/90 shadow-md ring-1 ring-slate-900/5
        backdrop-blur transition duration-200 hover:scale-110 active:scale-95
        dark:bg-slate-900/85 dark:ring-white/10 ${className}`}
    >
      <Heart
        className={`size-[55%] transition duration-300 ${
          active ? 'scale-110 fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
        }`}
      />
    </button>
  )
}
